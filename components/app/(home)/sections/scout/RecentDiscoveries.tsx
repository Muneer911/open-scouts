"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import CurvyRect from "@/components/shared/layout/curvy-rect";
import SectionHead from "@/components/shared/section-head/SectionHead";
import { CurvyRect as CurvyRectUI } from "@/components/shared/ui";
import { Connector } from "@/components/shared/layout/curvy-rect";
import { supabase } from "@/lib/supabase/client";
import { setIntervalOnVisible } from "@/utils/set-timeout-on-visible";
import { encryptText } from "@/components/app/(home)/sections/hero/Title/Title";
import { useI18n } from "@/contexts/I18nContext";

import AiFlame from "../ai/Flame/Flame";

type Execution = {
  id: string;
  scout_id: string;
  summary_text: string;
  created_at: string;
  scouts: {
    title: string;
  };
};

// Badge Icon - Radar/Signal icon for live discoveries
function BadgeIcon() {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="2.5" fill="var(--heat-100)" />
      <path
        d="M10 5C7.23858 5 5 7.23858 5 10C5 12.7614 7.23858 15 10 15"
        stroke="var(--heat-100)"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5"
        stroke="var(--heat-100)"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// Helper function to get relative time
const getRelativeTime = (dateString: string, t: (k: string, v?: any) => string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return t("common.homeSections.time.secondsAgo", { count: diffInSeconds });
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return t("common.homeSections.time.minutesAgo", { count: minutes });
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return t("common.homeSections.time.hoursAgo", { count: hours });
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return t("common.homeSections.time.daysAgo", { count: days });
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return t("common.homeSections.time.weeksAgo", { count: weeks });
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return t("common.homeSections.time.monthsAgo", { count: months });
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return t("common.homeSections.time.yearsAgo", { count: years });
  }
};

function EncryptedSummary({ text }: { text: string }) {
  const [display, setDisplay] = useState("");
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let progress = 0;
    const stop = setIntervalOnVisible({
      element: ref.current,
      callback: () => {
        progress += 0.02;
        if (progress >= 1) {
          progress = 1;
          stop?.();
        }
        setDisplay(encryptText(text, progress));
      },
      interval: 30,
      threshold: 0.1,
    });
    return () => stop?.();
  }, [text]);

  return (
    <p
      ref={ref}
      className="text-body-medium leading-relaxed text-black-alpha-72 mb-12 group-hover:text-heat-100 transition-colors duration-200 line-clamp-2"
    >
      {display || <span className="opacity-0">{text}</span>}
    </p>
  );
}

// Preview data for when there are no real discoveries
const previewDiscoveries = [
  {
    id: "preview-1",
    scout_id: "preview",
    summary_text:
      "Found 3 Taylor Swift concert tickets under $500 for the LA show on March 15th. Section 234, Row 12.",
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    scouts: { title: "Taylor Swift Tickets LA" },
  },
  {
    id: "preview-2",
    scout_id: "preview",
    summary_text:
      "New PS5 restock detected at Best Buy downtown location. Limited quantities available, bundle deals included.",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    scouts: { title: "PS5 Restock Alerts" },
  },
  {
    id: "preview-3",
    scout_id: "preview",
    summary_text:
      "Highly-rated new ramen restaurant opened 2 miles from you. 4.8 stars with 50+ reviews. Reservations available.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    scouts: { title: "New Restaurants Near Me" },
  },
];

function DiscoveryCard({
  execution,
  isPreview = false,
  onClick,
  t,
}: {
  execution: Execution;
  isPreview?: boolean;
  onClick?: () => void;
  t: (k: string, v?: any) => string;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-24 rounded-16
        bg-white border border-border-faint
        transition-all duration-200 group
        ${isPreview ? "opacity-60" : "hover:border-heat-100 hover:shadow-lg cursor-pointer"}
        ${!isPreview ? "hover:bg-gray-50" : ""}
      `}
      style={{
        boxShadow:
          "0px 16px 24px -6px rgba(0, 0, 0, 0.02), 0px 8px 12px -4px rgba(0, 0, 0, 0.02), 0px 4px 8px -2px rgba(0, 0, 0, 0.01)",
      }}
    >
      {isPreview && (
        <div className="absolute top-12 end-12 px-8 py-4 rounded-full bg-black-alpha-5 text-mono-x-small font-mono text-black-alpha-40">
          {t("common.homeSections.recentDiscoveries.previewTag")}
        </div>
      )}

      <EncryptedSummary text={execution.summary_text} />

      <div className="flex items-center justify-between gap-12 flex-wrap">
        <div className="flex items-center gap-8">
          <div className="size-8 rounded-full bg-heat-100" />
          <p className="text-label-small text-black-alpha-56 truncate max-w-200">
            {execution.scouts.title}
          </p>
        </div>
        <p className="text-mono-x-small text-black-alpha-32 font-mono">
          {getRelativeTime(execution.created_at, t)}
        </p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div
      className="relative p-24 rounded-16 bg-white border border-border-faint"
      style={{
        boxShadow:
          "0px 16px 24px -6px rgba(0, 0, 0, 0.02), 0px 8px 12px -4px rgba(0, 0, 0, 0.02), 0px 4px 8px -2px rgba(0, 0, 0, 0.01)",
      }}
    >
      <div className="mb-12">
        <div className="h-20 bg-gray-200 rounded mb-8 w-full animate-pulse" />
        <div className="h-20 bg-gray-200 rounded w-[75%] animate-pulse" />
      </div>
      <div className="flex items-center justify-between gap-12">
        <div className="flex items-center gap-8">
          <div className="size-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-16 bg-gray-200 rounded w-120 animate-pulse" />
        </div>
        <div className="h-14 bg-gray-200 rounded w-48 animate-pulse" />
      </div>
    </div>
  );
}

export default function RecentDiscoveries() {
  const router = useRouter();
  const { t } = useI18n();
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loadingExecutions, setLoadingExecutions] = useState(true);
  const [, setTick] = useState(0);

  // Load recent executions (limit 3)
  const loadExecutions = async () => {
    setLoadingExecutions(true);

    const { data, error } = await supabase
      .from("scout_executions")
      .select(
        `
        id,
        scout_id,
        summary_text,
        created_at,
        scouts!inner(title)
      `,
      )
      .not("summary_text", "is", null)
      .order("created_at", { ascending: false })
      .limit(3);

    if (data && !error) {
      setExecutions(data as unknown as Execution[]);
    }
    setLoadingExecutions(false);
  };

  // Load initial executions
  useEffect(() => {
    loadExecutions();
  }, []);

  // Subscribe to realtime updates for executions
  useEffect(() => {
    const channel = supabase
      .channel("scout_executions_changes_section")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "scout_executions",
          filter: "summary_text=not.is.null",
        },
        async (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            loadExecutions();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update relative times every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const showPreview = !loadingExecutions && executions.length === 0;
  const displayData = showPreview ? previewDiscoveries : executions;

  return (
    <>
      {/* Transition from hero to this section */}

      <div className="h-1 bg-border-faint lg-max:hidden container -mt-1" />

      {/* Section Title */}
      <div className="-mt-1 pointer-events-none select-none relative container">
        <Connector className="absolute end-[-10.5px] -top-10" />
        <Connector className="absolute start-[-10.5px] -top-10" />
        <Connector className="absolute end-[-10.5px] -bottom-10" />
        <Connector className="absolute start-[-10.5px] -bottom-10" />

        <div className="relative grid lg:grid-cols-2 -mt-1">
          <div className="h-1 bottom-0 absolute w-screen start-[calc(50%-50vw)] bg-border-faint" />

          <div className="flex gap-40 py-24 lg:py-45 relative">
            <div className="h-full w-1 end-0 top-0 bg-border-faint absolute lg-max:hidden" />
            <div className="w-2 h-16 bg-heat-100" />

            <div className="flex gap-12 items-center !text-mono-x-small text-black-alpha-16 font-mono">
              <div>
                [ <span className="text-heat-100">01</span> / 03 ]
              </div>

              <div className="w-8 text-center">·</div>

              <div className="uppercase text-black-alpha-32">
                {t("common.homeSections.recentDiscoveries.kicker")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="container -mt-1">
        <SectionHead
          smallerHeader
          badgeContent={
            <>
              <BadgeIcon />
              <span>{t("common.homeSections.recentDiscoveries.badge")}</span>
            </>
          }
          description={
            showPreview
              ? t("common.homeSections.recentDiscoveries.descriptionPreview")
              : t("common.homeSections.recentDiscoveries.descriptionLive")
          }
          title={
            <>
              {showPreview ? (
                <>
                  {t("common.homeSections.recentDiscoveries.titlePreviewPrefix")}{" "}
                  <br className="lg:hidden" />
                  <span className="text-heat-100">
                    {t("common.homeSections.recentDiscoveries.titlePreviewAccent")}
                  </span>
                </>
              ) : (
                <>
                  {t("common.homeSections.recentDiscoveries.titleLivePrefix")}{" "}
                  <span className="text-heat-100">
                    {t("common.homeSections.recentDiscoveries.titleLiveAccent")}
                  </span>
                </>
              )}
            </>
          }
          titleClassName="max-w-500"
        >
          <AiFlame />
        </SectionHead>

        {/* Discovery Cards Grid */}
        <div className="relative py-32 lg:py-64">
          <CurvyRect className="overlay" allSides />
          <div className="h-1 bg-border-faint bottom-0 left-0 w-full absolute" />

          <div className="max-w-900 mx-auto px-16 lg:px-32">
            <div className="grid gap-16 lg:gap-24">
              {loadingExecutions ? (
                <>
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                  <LoadingSkeleton />
                </>
              ) : (
                displayData.map((execution) => (
                  <DiscoveryCard
                    key={execution.id}
                    execution={execution}
                    isPreview={showPreview}
                    t={t}
                    onClick={
                      !showPreview
                        ? () => router.push(`/${execution.scout_id}`)
                        : undefined
                    }
                  />
                ))
              )}
            </div>

            {showPreview && (
              <div className="mt-32 text-center">
                <p className="text-body-medium text-black-alpha-48">
                  {t("common.homeSections.recentDiscoveries.cta")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
