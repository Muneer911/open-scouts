"use client";

import CurvyRect from "@/components/shared/layout/curvy-rect";
import SectionHead from "@/components/shared/section-head/SectionHead";
import { Connector } from "@/components/shared/layout/curvy-rect";
import { useI18n } from "@/contexts/I18nContext";

import ScoutChats from "./ScoutChats/ScoutChats";
import AiFlame from "../ai/Flame/Flame";

// Badge Icon
function BadgeIcon() {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 21 20"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M8.92219 9.15934C8.54015 9.40424 8.41665 9.66698 8.41665 9.86078C8.41665 10.0546 8.54015 10.3173 8.92219 10.5622C9.29734 10.8027 9.85347 10.9719 10.5 10.9719C11.1465 10.9719 11.7026 10.8027 12.0778 10.5622C12.4598 10.3173 12.5833 10.0546 12.5833 9.86078C12.5833 9.66698 12.4598 9.40424 12.0778 9.15934C11.7026 8.91886 11.1465 8.74967 10.5 8.74967C9.85347 8.74967 9.29734 8.91886 8.92219 9.15934ZM12.5833 11.7158C12.0023 12.0404 11.2723 12.2219 10.5 12.2219C9.72763 12.2219 8.99765 12.0404 8.41665 11.7158V15.0691C8.41665 15.2629 8.54015 15.5257 8.92219 15.7706C9.29734 16.011 9.85347 16.1802 10.5 16.1802C11.1465 16.1802 11.7026 16.011 12.0778 15.7706C12.4598 15.5257 12.5833 15.2629 12.5833 15.0691V11.7158ZM13.8333 9.86078C13.8333 9.09576 13.3505 8.49045 12.7524 8.10699C12.1473 7.71913 11.3492 7.49967 10.5 7.49967C9.65072 7.49967 8.85268 7.71913 8.24761 8.10699C7.64942 8.49045 7.16665 9.09576 7.16665 9.86078V18.5413C7.16665 18.8865 7.44557 19.1663 7.79075 19.1663C9.3151 19.1663 11.6849 19.1663 13.2092 19.1663C13.5544 19.1663 13.8333 18.8865 13.8333 18.5413V9.86078Z"
        fill="var(--heat-100)"
        fillRule="evenodd"
      />
      <path
        d="M4.36866 4.34669C4.49144 4.10128 4.84184 4.10128 4.96462 4.34669C5.59325 5.60325 5.72883 5.73858 6.98573 6.36667C7.23128 6.48938 7.23128 6.83959 6.98573 6.96229C5.72883 7.59039 5.59325 7.72572 4.96462 8.98228C4.84184 9.22769 4.49144 9.22769 4.36866 8.98228C3.74003 7.72572 3.60445 7.59039 2.34755 6.96229C2.102 6.83959 2.102 6.48938 2.34755 6.36667C3.60445 5.73858 3.74003 5.60325 4.36866 4.34669Z"
        fill="var(--heat-100)"
      />
      <path
        d="M10.1987 1.01706C10.3215 0.771655 10.6719 0.771656 10.7947 1.01707C11.4233 2.27363 11.5589 2.40895 12.8158 3.03705C13.0614 3.15976 13.0614 3.50997 12.8158 3.63267C11.5589 4.26077 11.4233 4.3961 10.7947 5.65266C10.6719 5.89807 10.3215 5.89807 10.1987 5.65266C9.57012 4.3961 9.43453 4.26077 8.17763 3.63267C7.93209 3.50997 7.93209 3.15976 8.17764 3.03705C9.43453 2.40895 9.57012 2.27363 10.1987 1.01706Z"
        fill="var(--heat-100)"
      />
      <path
        d="M16.0288 4.34669C16.1516 4.10128 16.502 4.10128 16.6248 4.34669C17.2534 5.60325 17.389 5.73858 18.6459 6.36667C18.8914 6.48938 18.8914 6.83959 18.6459 6.96229C17.389 7.59039 17.2534 7.72572 16.6248 8.98228C16.502 9.22769 16.1516 9.22769 16.0288 8.98228C15.4002 7.72572 15.2646 7.59039 14.0077 6.96229C13.7622 6.83959 13.7622 6.48938 14.0077 6.36667C15.2646 5.73858 15.4002 5.60325 16.0288 4.34669Z"
        fill="var(--heat-100)"
      />
    </svg>
  );
}

// Chat Icon for scout configuration
function ChatIcon() {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M1.45834 7.50065C5.65395 7.50065 7.50001 5.65459 7.50001 1.45898C7.50001 5.65459 9.34607 7.50065 13.5417 7.50065C9.34607 7.50065 7.50001 9.34672 7.50001 13.5423C7.50001 9.34672 5.65395 7.50065 1.45834 7.50065Z"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
      <path
        clipRule="evenodd"
        d="M10.625 14.584C13.3739 14.584 14.5833 13.3745 14.5833 10.6257C14.5833 13.3745 15.7928 14.584 18.5417 14.584C15.7928 14.584 14.5833 15.7935 14.5833 18.5423C14.5833 15.7935 13.3739 14.584 10.625 14.584Z"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}

// Card component adapted from AiCard
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

const card = {
  title: "AI-powered configuration",
  subtitle: "Chat to configure",
  description: (
    <>
      Tell our AI assistant what you want to scout.
      <br />
      It will help you set up the perfect search criteria.
    </>
  ),
  icon: <ChatIcon />,
  children: <ScoutChats />,
  id: "scout-chats",
};

export default function HowItWorks() {
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
                [ <span className="text-heat-100">02</span> / 03 ]
              </div>

              <div className="w-8 text-center">·</div>

              <div className="uppercase text-black-alpha-32">
                {t("common.homeSections.howItWorks.kicker")}
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
              <span>{t("common.homeSections.howItWorks.badge")}</span>
            </>
          }
          className="lg-max:!py-64"
          description={t("common.homeSections.howItWorks.description")}
          descriptionClassName="lg-max:px-24"
          title={
            <>
              {t("common.homeSections.howItWorks.titlePrefix")} <br className="lg:hidden" />
              <span className="text-heat-100">
                {t("common.homeSections.howItWorks.titleAccent")}
              </span>{" "}
              {t("common.homeSections.howItWorks.titleSuffix")}
            </>
          }
          titleClassName="max-w-650"
        >
          <AiFlame />
        </SectionHead>

        <ScoutCard
          title={t("common.homeSections.howItWorks.card.title")}
          subtitle={t("common.homeSections.howItWorks.card.subtitle")}
          description={
            <>
              {t("common.homeSections.howItWorks.card.line1")}
              <br />
              {t("common.homeSections.howItWorks.card.line2")}
            </>
          }
          icon={<ChatIcon />}
          id="scout-chats"
        >
          <ScoutChats />
        </ScoutCard>
      </section>
    </>
  );
}
