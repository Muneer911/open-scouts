"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/shadcn/button";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import {
  Check,
  AlertCircle,
  Mail,
  Bell,
  Flame,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  MapPin,
  Key,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import { Connector } from "@/components/shared/layout/curvy-rect";
import LocationSelector, { UserLocation } from "@/components/location-selector";
import posthog from "posthog-js";
import { useI18n } from "@/contexts/I18nContext";

type FirecrawlKeyStatus =
  | "pending"
  | "active"
  | "fallback"
  | "failed"
  | "invalid";

interface FirecrawlInfo {
  status: FirecrawlKeyStatus;
  hasKey: boolean;
  createdAt: string | null;
  error: string | null;
}

interface FirecrawlCredits {
  remainingCredits: number | null;
  planCredits: number | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);
  const [sendingTest, setSendingTest] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [testMessage, setTestMessage] = useState("");
  const [testEmailCooldown, setTestEmailCooldown] = useState(0);

  // Firecrawl state
  const [firecrawlInfo, setFirecrawlInfo] = useState<FirecrawlInfo | null>(
    null,
  );
  const [regeneratingKey, setRegeneratingKey] = useState(false);
  const [regenerateMessage, setRegenerateMessage] = useState("");
  const [regenerateStatus, setRegenerateStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [regenerateCooldown, setRegenerateCooldown] = useState(0); // seconds remaining

  // Location state
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [savingLocation, setSavingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Custom API key state
  const [customApiKey, setCustomApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [savingApiKey, setSavingApiKey] = useState(false);
  const [apiKeyMessage, setApiKeyMessage] = useState("");
  const [apiKeyStatus, setApiKeyStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Sponsored credits state
  const [sponsoredCredits, setSponsoredCredits] = useState<FirecrawlCredits | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);

  // Load preferences (Firecrawl + Location)
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data } = await supabase
          .from("user_preferences")
          .select(
            "firecrawl_api_key, firecrawl_key_status, firecrawl_key_created_at, firecrawl_key_error, firecrawl_custom_api_key, location",
          )
          .eq("user_id", user.id)
          .maybeSingle();

        if (data) {
          // Status only reflects the auto-generated key (sponsored integration)
          setFirecrawlInfo({
            status: (data.firecrawl_key_status ||
              "pending") as FirecrawlKeyStatus,
            hasKey: !!data.firecrawl_api_key,
            createdAt: data.firecrawl_key_created_at,
            error: data.firecrawl_key_error,
          });
          if (data.location) {
            setUserLocation(data.location as UserLocation);
          }
          if (data.firecrawl_custom_api_key) {
            setHasCustomKey(true);
            // Show masked version with first 3 and last 3 characters
            const key = data.firecrawl_custom_api_key;
            const masked =
              key.length > 6
                ? key.slice(0, 3) + "•".repeat(key.length - 6) + key.slice(-3)
                : "•".repeat(key.length);
            setCustomApiKey(masked);
          }
        } else {
          // No preferences yet - set defaults
          setFirecrawlInfo({
            status: "pending",
            hasKey: false,
            createdAt: null,
            error: null,
          });
        }
      } catch {
        // Silently handle any exceptions
      }
      setLoading(false);
    };

    loadPreferences();
  }, [user?.id]);

  // Fetch sponsored credits on page load
  useEffect(() => {
    const fetchCredits = async () => {
      if (!user?.id) return;

      setLoadingCredits(true);
      try {
        const response = await fetch("/api/firecrawl/credits");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setSponsoredCredits({
              remainingCredits: result.data.remainingCredits,
              planCredits: result.data.planCredits,
            });
          }
        }
      } catch {
        // Silently handle errors
      }
      setLoadingCredits(false);
    };

    fetchCredits();
  }, [user?.id]);

  // Cooldown timer for regenerate button
  useEffect(() => {
    if (regenerateCooldown <= 0) return;

    const timer = setInterval(() => {
      setRegenerateCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [regenerateCooldown]);

  // Cooldown timer for test email button
  useEffect(() => {
    if (testEmailCooldown <= 0) return;

    const timer = setInterval(() => {
      setTestEmailCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [testEmailCooldown]);

  const sendTestEmail = async () => {
    if (testEmailCooldown > 0) return;

    setSendingTest(true);
    setTestStatus("idle");
    setTestMessage("");

    try {
      // Get fresh session from supabase client to ensure we have a valid token
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!currentSession?.access_token) {
        setTestStatus("error");
        setTestMessage(t("dashboard.settings.sections.notifications.send.mustBeLoggedIn"));
        setSendingTest(false);
        return;
      }

      const response = await fetch("/api/send-test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setTestStatus("error");
        setTestMessage(
          data.error || t("dashboard.settings.sections.notifications.send.failed"),
        );

        // Handle rate limiting (429)
        if (response.status === 429 && data.cooldownRemaining) {
          setTestEmailCooldown(data.cooldownRemaining);
        }
      } else {
        setTestStatus("success");
        setTestMessage(t("dashboard.settings.sections.notifications.send.success"));
        // Set cooldown after successful send (2 minutes)
        setTestEmailCooldown(120);

        // PostHog: Track test email sent
        posthog.capture("test_email_sent", {
          status: "success",
        });

        setTimeout(() => {
          setTestStatus("idle");
          setTestMessage("");
        }, 5000);
      }
    } catch (error) {
      setTestStatus("error");
      setTestMessage(
        error instanceof Error
          ? error.message
          : t("dashboard.settings.sections.notifications.send.failed"),
      );
    }

    setSendingTest(false);
  };

  const regenerateFirecrawlKey = async () => {
    if (!user?.id || !user?.email || regenerateCooldown > 0) return;

    setRegeneratingKey(true);
    setRegenerateMessage("");
    setRegenerateStatus("idle");

    try {
      const response = await fetch("/api/firecrawl/regenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setRegenerateMessage(data.error || t("dashboard.tryAgain"));
        setRegenerateStatus("error");

        // If rate limited (429), extract wait time and set cooldown
        if (response.status === 429) {
          const match = data.error?.match(/wait (\d+) seconds/);
          if (match) {
            setRegenerateCooldown(parseInt(match[1], 10));
          } else {
            setRegenerateCooldown(60); // Default cooldown
          }
        }
      } else {
        setRegenerateMessage(t("dashboard.settings.sections.firecrawl.actions.connectNow"));
        setRegenerateStatus("success");
        // Set cooldown after successful regeneration
        setRegenerateCooldown(60);
        // Refresh the Firecrawl info
        setFirecrawlInfo({
          status: "active",
          hasKey: true,
          createdAt: new Date().toISOString(),
          error: null,
        });

        // PostHog: Track Firecrawl key regeneration
        posthog.capture("firecrawl_key_regenerated", {
          status: "success",
        });

        setTimeout(() => setRegenerateMessage(""), 5000);
      }
    } catch (error) {
      setRegenerateMessage(
        error instanceof Error ? error.message : t("dashboard.tryAgain"),
      );
      setRegenerateStatus("error");
    }

    setRegeneratingKey(false);
  };

  const saveLocation = async (location: UserLocation | null) => {
    if (!user?.id) return;

    setSavingLocation(true);
    setLocationMessage("");
    setLocationStatus("idle");

    try {
      // Check if user_preferences row exists
      const { data: existing } = await supabase
        .from("user_preferences")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("user_preferences")
          .update({ location })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("user_preferences")
          .insert({ user_id: user.id, location });

        if (error) throw error;
      }

      setUserLocation(location);
      setLocationMessage(t("dashboard.settings.sections.location.saved"));
      setLocationStatus("success");

      // PostHog: Track location update
      posthog.capture("location_updated", {
        city: location?.city,
        country: location?.country,
        has_coordinates: !!(location?.latitude && location?.longitude),
      });

      setTimeout(() => setLocationMessage(""), 3000);
    } catch (error) {
      setLocationMessage(
        error instanceof Error
          ? error.message
          : t("dashboard.settings.sections.location.saveFailed"),
      );
      setLocationStatus("error");
    }

    setSavingLocation(false);
  };

  const saveCustomApiKey = async () => {
    if (!user?.id) return;

    // Don't save if it's the masked placeholder
    if (customApiKey.includes("•")) {
      setApiKeyMessage(t("dashboard.settings.sections.firecrawl.customKey.enterNewKey"));
      setApiKeyStatus("error");
      return;
    }

    // Validate format
    if (customApiKey && !customApiKey.startsWith("fc-")) {
      setApiKeyMessage(t("dashboard.settings.sections.firecrawl.customKey.invalidPrefix"));
      setApiKeyStatus("error");
      return;
    }

    setSavingApiKey(true);
    setApiKeyMessage("");
    setApiKeyStatus("idle");

    try {
      // Check if user_preferences row exists
      const { data: existing } = await supabase
        .from("user_preferences")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      const updateData = {
        firecrawl_custom_api_key: customApiKey || null,
        // If setting a custom key, mark status as active
        ...(customApiKey && { firecrawl_key_status: "active" }),
      };

      if (existing) {
        const { error } = await supabase
          .from("user_preferences")
          .update(updateData)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_preferences")
          .insert({ user_id: user.id, ...updateData });

        if (error) throw error;
      }

      if (customApiKey) {
        setHasCustomKey(true);
        setApiKeyMessage(t("dashboard.settings.sections.firecrawl.customKey.saveKey"));
        setApiKeyStatus("success");
        setFirecrawlInfo((prev) =>
          prev ? { ...prev, status: "active", error: null } : prev,
        );
        // Mask the key after saving with first 3 and last 3 characters
        const masked =
          customApiKey.length > 6
            ? customApiKey.slice(0, 3) +
              "•".repeat(customApiKey.length - 6) +
              customApiKey.slice(-3)
            : "•".repeat(customApiKey.length);
        setCustomApiKey(masked);
      } else {
        setHasCustomKey(false);
        setApiKeyMessage(t("dashboard.settings.sections.firecrawl.customKey.removed"));
        setApiKeyStatus("success");
      }

      posthog.capture("firecrawl_custom_key_saved", {
        has_key: !!customApiKey,
      });

      setTimeout(() => setApiKeyMessage(""), 3000);
    } catch (error) {
      setApiKeyMessage(
        error instanceof Error ? error.message : t("dashboard.tryAgain"),
      );
      setApiKeyStatus("error");
    }

    setSavingApiKey(false);
  };

  const clearCustomApiKey = async () => {
    setCustomApiKey("");
    setHasCustomKey(false);
    await saveCustomApiKey();
  };

  const getStatusDisplay = (status: FirecrawlKeyStatus) => {
    switch (status) {
      case "active":
        return {
          icon: <CheckCircle2 className="w-16 h-16" />,
          text: "Connected",
          color: "text-accent-forest",
          bgColor: "bg-accent-forest/10",
          borderColor: "border-accent-forest/20",
        };
      case "pending":
        return {
          icon: <Clock className="w-16 h-16" />,
          text: "Pending",
          color: "text-accent-honey",
          bgColor: "bg-accent-honey/10",
          borderColor: "border-accent-honey/20",
        };
      case "fallback":
        return {
          icon: <AlertTriangle className="w-16 h-16" />,
          text: "Using Shared Key",
          color: "text-accent-honey",
          bgColor: "bg-accent-honey/10",
          borderColor: "border-accent-honey/20",
        };
      case "failed":
      case "invalid":
        return {
          icon: <XCircle className="w-16 h-16" />,
          text: status === "failed" ? "Setup Failed" : "Key Invalid",
          color: "text-accent-crimson",
          bgColor: "bg-accent-crimson/10",
          borderColor: "border-accent-crimson/20",
        };
      default:
        return {
          icon: <Clock className="w-16 h-16" />,
          text: "Unknown",
          color: "text-black-alpha-48",
          bgColor: "bg-black-alpha-4",
          borderColor: "border-border-muted",
        };
    }
  };

  // Show loading while checking auth
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-2 border-heat-100 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-base">
      {/* Top border line */}
      <div className="h-1 w-full bg-border-faint" />

      <div className="container relative">
        {/* Corner connectors */}
        <Connector className="absolute -top-10 -start-[10.5px]" />
        <Connector className="absolute -top-10 -end-[10.5px]" />

        {/* Header Section */}
        <div className="py-48 lg:py-64 relative">
          {/* Bottom border */}
          <div className="h-1 bottom-0 absolute w-screen start-[calc(50%-50vw)] bg-border-faint" />
          <Connector className="absolute -bottom-10 -start-[10.5px]" />
          <Connector className="absolute -bottom-10 -end-[10.5px]" />

          <div className="px-24">
            <h1 className="text-title-h3 lg:text-title-h2 font-semibold text-accent-black">
              {t("dashboard.settings.title")}
            </h1>
            <p className="text-body-large text-black-alpha-56 mt-4">
              {t("dashboard.settings.subtitle")}
            </p>
          </div>
        </div>

        {/* Firecrawl Integration Section */}
        <div className="py-24 lg:py-32 relative">
          <div className="h-1 bottom-0 absolute w-screen start-[calc(50%-50vw)] bg-border-faint" />

          <div className="flex items-center gap-16">
            <div className="w-2 h-16 bg-heat-100" />
            <div className="flex gap-12 items-center text-mono-x-small text-black-alpha-32 font-mono">
              <Flame className="w-14 h-14" />
              <span className="uppercase tracking-wider">
                {t("dashboard.settings.sections.firecrawl.label")}
              </span>
            </div>
          </div>
        </div>

        {/* Firecrawl Content */}
        <div className="pb-32">
          {loading ? (
            <div className="bg-white rounded-12 border border-border-faint p-24 max-w-600">
              <div className="space-y-16">
                <Skeleton className="h-16 w-128" />
                <Skeleton className="h-40 w-full rounded-8" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-12 border border-border-faint overflow-hidden max-w-600">
              <div className="p-24 space-y-16">
                <div>
                  <h3 className="text-label-medium font-semibold text-accent-black mb-8">
                    {t("dashboard.settings.sections.firecrawl.sponsoredTitle")}
                  </h3>
                  <p className="text-body-small text-black-alpha-48 mb-16">
                    {t(
                      "dashboard.settings.sections.firecrawl.sponsoredDescription",
                    )}
                  </p>

                  {/* Status Badge */}
                  {firecrawlInfo && (
                    <div className="space-y-12">
                      {(() => {
                        // Check if the error is about insufficient credits (402)
                        const isInsufficientCredits =
                          firecrawlInfo.error?.includes("402") ||
                          firecrawlInfo.error
                            ?.toLowerCase()
                            .includes("insufficient credits");

                        // If insufficient credits, show as "Connected" but with credits exhausted message
                        const displayStatus = isInsufficientCredits
                          ? "active"
                          : firecrawlInfo.status;
                        const display = getStatusDisplay(displayStatus);

                        return (
                          <>
                            <div className="flex items-center gap-12">
                              <span className="text-body-small text-black-alpha-56">
                                {t("dashboard.settings.sections.firecrawl.statusLabel")}
                              </span>
                              <div
                                className={`inline-flex items-center gap-8 px-12 py-6 rounded-6 ${display.bgColor} ${display.color} border ${display.borderColor}`}
                              >
                                {display.icon}
                                <span className="text-label-small font-medium">
                                  {display.text}
                                </span>
                              </div>
                            </div>

                            {/* Created At */}
                            {firecrawlInfo.createdAt &&
                              (firecrawlInfo.status === "active" ||
                                isInsufficientCredits) && (
                                <p className="text-body-small text-black-alpha-48">
                                  {t(
                                    "dashboard.settings.sections.firecrawl.connectedSince",
                                    {
                                      date: new Date(
                                        firecrawlInfo.createdAt,
                                      ).toLocaleDateString(),
                                    },
                                  )}
                                </p>
                              )}

                            {/* Credits Display */}
                            {(firecrawlInfo.status === "active" ||
                              isInsufficientCredits) && (
                              <div className="flex items-center gap-8">
                                <span className="text-body-small text-black-alpha-56">
                                  {t("dashboard.settings.sections.firecrawl.creditsLabel")}
                                </span>
                                {loadingCredits ? (
                                  <span className="text-body-small text-black-alpha-48">
                                    {t("dashboard.settings.sections.firecrawl.loading")}
                                  </span>
                                ) : sponsoredCredits?.remainingCredits !==
                                    null &&
                                  sponsoredCredits?.remainingCredits !==
                                    undefined ? (
                                  <span
                                    className={`text-label-small font-medium ${
                                      sponsoredCredits.remainingCredits === 0
                                        ? "text-accent-crimson"
                                        : sponsoredCredits.remainingCredits < 100
                                          ? "text-heat-100"
                                          : "text-accent-forest"
                                    }`}
                                  >
                                    {sponsoredCredits.remainingCredits.toLocaleString()}
                                    {sponsoredCredits.planCredits
                                      ? ` / ${sponsoredCredits.planCredits.toLocaleString()}`
                                      : ""}{" "}
                                    {t("dashboard.settings.sections.firecrawl.remaining")}
                                  </span>
                                ) : (
                                  <span className="text-body-small text-black-alpha-48">
                                    {t("dashboard.settings.sections.firecrawl.unableToFetch")}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Insufficient Credits Message */}
                            {isInsufficientCredits && (
                              <div className="flex items-start gap-8 p-12 rounded-8 bg-heat-100/10 border border-heat-100/20">
                                <AlertTriangle className="w-16 h-16 text-heat-100 mt-2 shrink-0" />
                                <span className="text-body-small text-heat-100">
                                  {t(
                                    "dashboard.settings.sections.firecrawl.creditsExhausted",
                                  )}
                                </span>
                              </div>
                            )}

                            {/* Error Message - only show for non-credit errors */}
                            {firecrawlInfo.error &&
                              !isInsufficientCredits &&
                              (firecrawlInfo.status === "failed" ||
                                firecrawlInfo.status === "invalid") && (
                                <div className="flex items-start gap-8 p-12 rounded-8 bg-accent-crimson/10 border border-accent-crimson/20">
                                  <AlertCircle className="w-16 h-16 text-accent-crimson mt-2 shrink-0" />
                                  <span className="text-body-small text-accent-crimson">
                                    {firecrawlInfo.error}
                                  </span>
                                </div>
                              )}

                            {/* Regenerate Button - show for failed, invalid, or pending states, but NOT for insufficient credits */}
                            {!isInsufficientCredits &&
                              (firecrawlInfo.status === "failed" ||
                                firecrawlInfo.status === "invalid" ||
                                firecrawlInfo.status === "pending") && (
                                <div className="pt-8">
                                  <Button
                                    onClick={regenerateFirecrawlKey}
                                    disabled={
                                      regeneratingKey || regenerateCooldown > 0
                                    }
                                    variant="secondary"
                                    className="flex items-center gap-8"
                                  >
                                    {regeneratingKey ? (
                                      <>
                                        <div className="animate-spin rounded-full h-16 w-16 border-2 border-black-alpha-32 border-t-transparent" />
                                        {t(
                                          "dashboard.settings.sections.firecrawl.actions.connecting",
                                        )}
                                      </>
                                    ) : regenerateCooldown > 0 ? (
                                      <>
                                        <Clock className="w-16 h-16" />
                                        {t(
                                          "dashboard.settings.sections.firecrawl.actions.waitSeconds",
                                          { seconds: regenerateCooldown },
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <RefreshCw className="w-16 h-16" />
                                        {firecrawlInfo.status === "pending"
                                          ? t(
                                              "dashboard.settings.sections.firecrawl.actions.connectNow",
                                            )
                                          : t(
                                              "dashboard.settings.sections.firecrawl.actions.reconnect",
                                            )}
                                      </>
                                    )}
                                  </Button>

                                  {regenerateMessage && (
                                    <div
                                      className={`flex items-start gap-8 mt-12 p-12 rounded-8 ${
                                        regenerateStatus === "success"
                                          ? "bg-accent-forest/10 text-accent-forest border border-accent-forest/20"
                                          : "bg-accent-crimson/10 text-accent-crimson border border-accent-crimson/20"
                                      }`}
                                    >
                                      {regenerateStatus === "success" ? (
                                        <Check className="w-16 h-16 mt-2 shrink-0" />
                                      ) : (
                                        <AlertCircle className="w-16 h-16 mt-2 shrink-0" />
                                      )}
                                      <span className="text-body-small">
                                        {regenerateMessage}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Custom API Key Section */}
                <div className="pt-16 border-t border-border-faint">
                  <div className="flex items-center gap-8 mb-8">
                    <Key className="w-16 h-16 text-black-alpha-48" />
                    <h3 className="text-label-medium font-semibold text-accent-black">
                      {t("dashboard.settings.sections.firecrawl.customKey.title")}
                    </h3>
                    {hasCustomKey && (
                      <span className="text-mono-x-small text-accent-forest bg-accent-forest/10 px-8 py-2 rounded-4">
                        {t("dashboard.settings.sections.firecrawl.customKey.active")}
                      </span>
                    )}
                  </div>
                  <p className="text-body-small text-black-alpha-48 mb-16">
                    {t("dashboard.settings.sections.firecrawl.customKey.description")}{" "}
                    <a
                      href="https://www.firecrawl.dev/app/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-heat-100 hover:underline inline-flex items-center gap-4"
                    >
                      {t("dashboard.settings.sections.firecrawl.customKey.getKeyHere")}
                      <ExternalLink className="w-12 h-12" />
                    </a>
                  </p>

                  <div className="space-y-12">
                    <div className="relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={customApiKey}
                        onChange={(e) => {
                          setCustomApiKey(e.target.value);
                          setApiKeyMessage("");
                        }}
                        onFocus={() => {
                          // Clear masked placeholder on focus
                          if (customApiKey.includes("•")) {
                            setCustomApiKey("");
                          }
                        }}
                        placeholder={t(
                          "dashboard.settings.sections.firecrawl.customKey.placeholder",
                        )}
                        className="w-full h-44 px-16 pe-44 rounded-8 border border-border-muted bg-background-base text-body-medium font-mono focus:outline-none focus:border-heat-100 focus:ring-1 focus:ring-heat-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute end-12 top-1/2 -translate-y-1/2 text-black-alpha-48 hover:text-black-alpha-72"
                      >
                        {showApiKey ? (
                          <EyeOff className="w-18 h-18" />
                        ) : (
                          <Eye className="w-18 h-18" />
                        )}
                      </button>
                    </div>

                    <div className="flex gap-8">
                      <Button
                        onClick={saveCustomApiKey}
                        disabled={savingApiKey || !customApiKey}
                        variant="secondary"
                        className="flex items-center gap-8"
                      >
                        {savingApiKey ? (
                          <>
                            <div className="animate-spin rounded-full h-16 w-16 border-2 border-black-alpha-32 border-t-transparent" />
                            {t("dashboard.settings.sections.firecrawl.customKey.saving")}
                          </>
                        ) : (
                          <>
                            <Check className="w-16 h-16" />
                            {t("dashboard.settings.sections.firecrawl.customKey.saveKey")}
                          </>
                        )}
                      </Button>

                      {hasCustomKey && (
                        <button
                          onClick={() => {
                            setCustomApiKey("");
                            setSavingApiKey(true);
                            supabase
                              .from("user_preferences")
                              .update({ firecrawl_custom_api_key: null })
                              .eq("user_id", user?.id)
                              .then(() => {
                                setHasCustomKey(false);
                                setApiKeyMessage(
                                  t(
                                    "dashboard.settings.sections.firecrawl.customKey.removed",
                                  ),
                                );
                                setApiKeyStatus("success");
                                setSavingApiKey(false);
                                setTimeout(() => setApiKeyMessage(""), 3000);
                              });
                          }}
                          disabled={savingApiKey}
                          className="px-16 py-8 rounded-6 text-label-medium text-accent-crimson hover:bg-accent-crimson/10 transition-colors disabled:opacity-50"
                        >
                          {t("dashboard.settings.sections.firecrawl.customKey.remove")}
                        </button>
                      )}
                    </div>

                    {apiKeyMessage && (
                      <div
                        className={`flex items-start gap-8 p-12 rounded-8 ${
                          apiKeyStatus === "success"
                            ? "bg-accent-forest/10 text-accent-forest border border-accent-forest/20"
                            : "bg-accent-crimson/10 text-accent-crimson border border-accent-crimson/20"
                        }`}
                      >
                        {apiKeyStatus === "success" ? (
                          <Check className="w-16 h-16 mt-2 shrink-0" />
                        ) : (
                          <AlertCircle className="w-16 h-16 mt-2 shrink-0" />
                        )}
                        <span className="text-body-small">{apiKeyMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Footer */}
              <div className="px-24 py-16 border-t border-border-faint bg-background-base">
                <p className="text-mono-x-small font-mono text-black-alpha-32">
                  {t("dashboard.settings.sections.firecrawl.footer")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Location Section Label */}
        <div className="py-24 lg:py-32 relative">
          <div className="h-1 bottom-0 absolute w-screen start-[calc(50%-50vw)] bg-border-faint" />

          <div className="flex items-center gap-16">
            <div className="w-2 h-16 bg-heat-100" />
            <div className="flex gap-12 items-center text-mono-x-small text-black-alpha-32 font-mono">
              <MapPin className="w-14 h-14" />
              <span className="uppercase tracking-wider">
                {t("dashboard.settings.sections.location.label")}
              </span>
            </div>
          </div>
        </div>

        {/* Location Content */}
        <div className="pb-32">
          {loading ? (
            <div className="bg-white rounded-12 border border-border-faint p-24 max-w-600">
              <div className="space-y-16">
                <Skeleton className="h-16 w-128" />
                <Skeleton className="h-48 w-full rounded-8" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-12 border border-border-faint overflow-hidden max-w-600">
              <div className="p-24 space-y-16">
                <div>
                  <h3 className="text-label-medium font-semibold text-accent-black mb-8">
                    {t("dashboard.settings.sections.location.title")}
                  </h3>
                  <p className="text-body-small text-black-alpha-48 mb-16">
                    {t("dashboard.settings.sections.location.description")}
                  </p>

                  <LocationSelector
                    value={userLocation}
                    onChange={saveLocation}
                    disabled={savingLocation}
                  />

                  {locationMessage && (
                    <div
                      className={`flex items-start gap-8 mt-12 p-12 rounded-8 ${
                        locationStatus === "success"
                          ? "bg-accent-forest/10 text-accent-forest border border-accent-forest/20"
                          : "bg-accent-crimson/10 text-accent-crimson border border-accent-crimson/20"
                      }`}
                    >
                      {locationStatus === "success" ? (
                        <Check className="w-16 h-16 mt-2 shrink-0" />
                      ) : (
                        <AlertCircle className="w-16 h-16 mt-2 shrink-0" />
                      )}
                      <span className="text-body-small">{locationMessage}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Footer */}
              <div className="px-24 py-16 border-t border-border-faint bg-background-base">
                <p className="text-mono-x-small font-mono text-black-alpha-32">
                  {t("dashboard.settings.sections.location.footer")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Section Label */}
        <div className="py-24 lg:py-32 relative">
          <div className="h-1 bottom-0 absolute w-screen start-[calc(50%-50vw)] bg-border-faint" />

          <div className="flex items-center gap-16">
            <div className="w-2 h-16 bg-heat-100" />
            <div className="flex gap-12 items-center text-mono-x-small text-black-alpha-32 font-mono">
              <Bell className="w-14 h-14" />
              <span className="uppercase tracking-wider">
                {t("dashboard.settings.sections.notifications.label")}
              </span>
            </div>
          </div>
        </div>

        {/* Notifications Content */}
        <div className="pb-64">
          {loading ? (
            <div className="bg-white rounded-12 border border-border-faint p-24 max-w-600">
              <div className="space-y-24">
                <div>
                  <Skeleton className="h-16 w-128 mb-12" />
                  <Skeleton className="h-20 w-256" />
                  <Skeleton className="h-14 w-full mt-8" />
                </div>
                <Skeleton className="h-40 w-140 rounded-8" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-12 border border-border-faint overflow-hidden max-w-600">
              <div className="p-24 space-y-24">
                {/* Email Notification Section */}
                <div>
                  <h3 className="text-label-medium font-semibold text-accent-black mb-8">
                    {t("dashboard.settings.sections.notifications.emailTitle")}
                  </h3>
                  <div className="flex items-center gap-8 mb-8">
                    <Mail className="w-16 h-16 text-black-alpha-48" />
                    <span className="text-body-medium text-accent-black">
                      {user?.email}
                    </span>
                  </div>
                  <p className="text-body-small text-black-alpha-48">
                    {t("dashboard.settings.sections.notifications.emailDescription")}
                  </p>

                  {/* Test Email Button */}
                  <div className="mt-16">
                    <Button
                      onClick={sendTestEmail}
                      disabled={sendingTest || testEmailCooldown > 0}
                      variant="secondary"
                      className="flex items-center gap-8"
                    >
                      {sendingTest ? (
                        <>
                          <div className="animate-spin rounded-full h-16 w-16 border-2 border-black-alpha-32 border-t-transparent" />
                          {t("dashboard.settings.sections.notifications.send.sending")}
                        </>
                      ) : testEmailCooldown > 0 ? (
                        <>
                          <Clock className="w-16 h-16" />
                          {t(
                            "dashboard.settings.sections.notifications.send.waitSeconds",
                            { seconds: testEmailCooldown },
                          )}
                        </>
                      ) : (
                        <>
                          <Mail className="w-16 h-16" />
                          {t("dashboard.settings.sections.notifications.send.sendTest")}
                        </>
                      )}
                    </Button>

                    {testMessage && (
                      <div
                        className={`flex items-start gap-8 mt-12 p-12 rounded-8 ${
                          testStatus === "success"
                            ? "bg-accent-forest/10 text-accent-forest border border-accent-forest/20"
                            : "bg-accent-crimson/10 text-accent-crimson border border-accent-crimson/20"
                        }`}
                      >
                        {testStatus === "success" ? (
                          <Check className="w-16 h-16 mt-2 shrink-0" />
                        ) : (
                          <AlertCircle className="w-16 h-16 mt-2 shrink-0" />
                        )}
                        <span className="text-body-small leading-relaxed">
                          {testMessage}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Future Settings Placeholder */}
              <div className="px-24 py-16 border-t border-border-faint bg-background-base">
                <p className="text-mono-x-small font-mono text-black-alpha-32">
                  {t("dashboard.settings.sections.notifications.footer")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
