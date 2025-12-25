"use client";

import CurvyRect from "@/components/shared/layout/curvy-rect";
import SectionHead from "@/components/shared/section-head/SectionHead";
import { Connector } from "@/components/shared/layout/curvy-rect";
import { useI18n } from "@/contexts/I18nContext";

import ScoutAgent from "./ScoutAgent/ScoutAgent";
import AiFlame from "../ai/Flame/Flame";

// Badge Icon - Radar/continuous search icon
function BadgeIcon() {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="2" fill="var(--heat-100)" />
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

// Search/Scout Icon
function ScoutIcon() {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.875 16.875L13.4388 13.4388M13.4388 13.4388C14.5321 12.3454 15.2083 10.835 15.2083 9.16667C15.2083 5.82995 12.5034 3.125 9.16667 3.125C5.82995 3.125 3.125 5.82995 3.125 9.16667C3.125 12.5034 5.82995 15.2083 9.16667 15.2083C10.835 15.2083 12.3454 14.5321 13.4388 13.4388Z"
        stroke="#262626"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.56"
        strokeWidth="1.25"
      />
    </svg>
  );
}

// Card component
function ScoutCard({
  title,
  subtitle,
  description,
  icon,
  children,
  id,
}: {
  title: string;
  subtitle: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="relative lg:flex lg:h-400" id={id}>
      <div className="p-32 lg:px-64 lg:py-60 z-[2] lg:w-454 relative flex flex-col h-full">
        <CurvyRect
          className="absolute -top-1 h-[calc(100%+1px)] start-0 w-full"
          allSides
        />

        <div className="flex gap-8 items-center text-label-small text-black-alpha-64 mb-16">
          {icon}
          {subtitle}
        </div>

        <div className="text-title-h4 max-w-350 mb-12">{title}</div>

        <div className="text-body-large">{description}</div>

        <div className="flex-1 mb-24" />
      </div>

      <div className="flex-1 -mt-1 lg:-ms-1 relative">
        <div className="absolute lg-max:w-full lg-max:h-1 start-0 h-full w-1 bg-border-faint top-0" />
        <CurvyRect className="absolute top-0 h-full start-0 w-full" allSides />

        {children}
      </div>
    </div>
  );
}

export default function AlwaysSearching() {
  const { t } = useI18n();

  return (
    <>
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
                [ <span className="text-heat-100">03</span> / 03 ]
              </div>

              <div className="w-8 text-center">·</div>

              <div className="uppercase text-black-alpha-32">
                {t("common.homeSections.alwaysSearching.kicker")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="container -mt-1">
        <SectionHead
          badgeContent={
            <>
              <BadgeIcon />
              <span>{t("common.homeSections.alwaysSearching.badge")}</span>
            </>
          }
          className="lg-max:!py-64"
          description={t("common.homeSections.alwaysSearching.description")}
          descriptionClassName="lg-max:px-24"
          title={
            <>
              {t("common.homeSections.alwaysSearching.titlePrefix")} <br className="lg:hidden" />
              <span className="text-heat-100">
                {t("common.homeSections.alwaysSearching.titleAccent")}
              </span>
            </>
          }
          titleClassName="max-w-650"
        >
          <AiFlame />
        </SectionHead>

        <ScoutCard
          title={t("common.homeSections.alwaysSearching.card.title")}
          subtitle={t("common.homeSections.alwaysSearching.card.subtitle")}
          description={
            <>
              {t("common.homeSections.alwaysSearching.card.line1")}
              <br />
              {t("common.homeSections.alwaysSearching.card.line2")}
            </>
          }
          icon={<ScoutIcon />}
          id="scout-agent"
        >
          <ScoutAgent />
        </ScoutCard>
      </section>

      {/* Bottom spacing with connectors */}
      <div className="h-92 lg:h-160 -mt-1 relative container">
        <div className="h-1 top-0 absolute w-screen start-[calc(50%-50vw)] bg-border-faint" />
        <div className="h-1 bottom-0 absolute w-screen start-[calc(50%-50vw)] bg-border-faint" />
        <Connector className="absolute -top-[10px] -start-[10.5px]" />
        <Connector className="absolute -top-[10px] -end-[10.5px]" />
        <Connector className="absolute -bottom-[10px] -start-[10.5px]" />
        <Connector className="absolute -bottom-[10px] -end-[10.5px]" />
      </div>
    </>
  );
}
