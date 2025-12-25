"use client";

import { useEffect, useRef, useState } from "react";

import useSwitchingCode from "@/hooks/useSwitchingCode";
import FirecrawlIcon from "@/components/shared/firecrawl-icon/firecrawl-icon";
import useEncryptedLoading from "@/hooks/useEncryptedLoading";
import { useI18n } from "@/contexts/I18nContext";

import ScoutAgentResults from "./Results/Results";
import onVisible from "@/utils/on-visible";

export default function ScoutAgent() {
  const { t } = useI18n();
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const element = document.getElementById("scout-agent")!;

    if (step === -1) {
      onVisible(
        element,
        () => {
          setTimeout(() => {
            setStep(0);
          }, 1000);
        },
        0.5,
      );

      return;
    }
  }, [step]);

  return (
    <>
      <div className="top-0 h-full lg-max:hidden inset-x-48 border-border-faint border-x absolute" />

      <div className="px-28 lg:px-76 py-20 flex gap-16 text-body-medium items-center relative">
        <div className="h-1 bottom-0 w-full bg-border-faint start-0 absolute" />

        <FirecrawlIcon className="size-24" />
        <Title done={step === 10} t={t} />
      </div>

      <div className="lg:px-48 text-body-medium">
        {scoutData.map((item, index) => (
          <div className="flex border-b border-border-faint" key={item.label}>
            <div className="py-20 ps-28 text-black-alpha-64 w-1/2 lg:w-172 border-e border-border-faint">
              {t(item.label)}
            </div>
            <RowValue
              done={Math.floor((step / 10) * scoutData.length) >= index}
              step={step}
              value={item.value}
              t={t}
            />
          </div>
        ))}
      </div>

      <ScoutAgentResults setStep={setStep} step={step} />

      <div className="h-16 lg:hidden" />
    </>
  );
}

function RowValue({
  done,
  value: _value,
  step,
  t,
}: {
  done: boolean;
  value: number;
  step: number;
  t: (k: string, v?: any) => string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step < 1) return;

    const interval = setInterval(() => {
      setValue((v) => {
        const val = v + Math.floor(_value / (20 + Math.random() * 40));

        if (val >= _value) {
          clearInterval(interval);

          return _value;
        }

        return val;
      });
    }, 75);

    return () => clearInterval(interval);
  }, [done, _value, step]);

  return (
    <div className="py-20 px-28 w-172" ref={ref}>
      {formatter.format(value)} {t("common.homeSections.scoutAgent.rowFoundSuffix")}
    </div>
  );
}

function Title({
  done,
  t,
}: {
  done: boolean;
  t: (k: string, v?: any) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const text = useEncryptedLoading({
    enabled: !done,
    text: "",
    ref,
  });

  const encryptedText = useSwitchingCode(
    done
      ? t("common.homeSections.scoutAgent.title.foundResults", {
          count: formatter.format(
            scoutData.reduce((acc, item) => acc + item.value, 0),
          ),
        })
      : t("common.homeSections.scoutAgent.title.inProgress"),
    50,
  );

  return (
    <div ref={ref}>
      {encryptedText}
      {done ? "" : text}
    </div>
  );
}

const formatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
  maximumFractionDigits: 0,
});

const scoutData = [
  { label: "common.homeSections.scoutAgent.metrics.websitesSearched", value: 127 },
  { label: "common.homeSections.scoutAgent.metrics.listingsFound", value: 2834 },
  { label: "common.homeSections.scoutAgent.metrics.priceMatches", value: 156 },
  { label: "common.homeSections.scoutAgent.metrics.availableSeats", value: 423 },
  { label: "common.homeSections.scoutAgent.metrics.bestDeals", value: 18 },
];
