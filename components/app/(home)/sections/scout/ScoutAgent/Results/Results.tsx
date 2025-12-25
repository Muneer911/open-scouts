"use client";

import { motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";

import { encryptText } from "@/components/app/(home)/sections/hero/Title/Title";
import { setIntervalOnVisible } from "@/utils/set-timeout-on-visible";
import { useI18n } from "@/contexts/I18nContext";

export default function ScoutAgentResults({
  step,
  setStep,
}: {
  step: number;
  setStep: (step: number) => void;
}) {
  const itemCount = Math.max(step, 0);

  return (
    <div
      className="lg:absolute lg-max:h-244 overflow-hidden lg:inset-y-24 lg-max:mt-16 lg:end-24 bg-white-alpha-72 backdrop-blur-4 rounded-20 w-[calc(100%-32px)] lg-max:mx-auto relative lg:w-272"
      style={{
        boxShadow:
          "0px 40px 48px -20px rgba(0, 0, 0, 0.02), 0px 32px 32px -20px rgba(0, 0, 0, 0.03), 0px 16px 24px -12px rgba(0, 0, 0, 0.03), 0px 0px 0px 1px rgba(0, 0, 0, 0.03)",
      }}
    >
      <Input setStep={setStep} step={step} />

      <div className="h-300 overflow-hidden">
        <motion.div
          animate={{ y: step >= 1 ? data.length * -129 : 0 }}
          className="h-max -mt-1"
          transition={{
            duration: 50,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {Array.from({ length: 2 }, (_, groupIndex) => {
            const itemCountLocal =
              groupIndex === 0 ? itemCount : itemCount === data.length ? 3 : 0;

            return (
              <Fragment key={groupIndex}>
                {data.slice(0, itemCountLocal).map((item) => {
                  return (
                    <motion.div
                      animate={{ opacity: 1 }}
                      className="px-20 py-16 border-t border-black-alpha-5"
                      initial={{ opacity: 0 }}
                      key={item.title}
                      transition={{
                        type: "spring",
                        stiffness: 50,
                        damping: 20,
                      }}
                    >
                      <div className="text-label-small h-20 mb-4 truncate">
                        <Field index={0} value={item.title} />
                      </div>

                      <div className="text-body-small h-40 text-black-alpha-64 mb-12 line-clamp-2">
                        <Field index={1} value={item.description} />
                      </div>

                      <div className="flex gap-8 items-center">
                        <div className="size-16 rounded-full bg-heat-12 flex-center">
                          <div className="size-6 rounded-full bg-heat-100" />
                        </div>

                        <div className="text-body-small text-black-alpha-40">
                          {item.url}
                        </div>

                        <div className="ms-auto text-label-small text-heat-100">
                          {item.price}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </Fragment>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

const QUERY_FALLBACK = "Taylor Swift LA";

const Input = ({
  step,
  setStep,
}: {
  step: number;
  setStep: (step: number) => void;
}) => {
  const { t } = useI18n();
  const [inputText, setInputText] = useState("");
  const indexRef = useRef(0);

  const query = t("common.homeSections.scoutAgent.results.query") || QUERY_FALLBACK;

  useEffect(() => {
    if (step === -1) return;

    if (step >= data.length) return;

    if (step >= 4) {
      const timeout = setTimeout(() => {
        setStep(step + 1);
      }, 500);

      return () => clearTimeout(timeout);
    }

    let timeout = 0;

    const tick = () => {
      timeout = window.setTimeout(
        () => {
          setInputText(query.slice(0, indexRef.current + 1));
          indexRef.current++;

          const nextStep = Math.floor(
            Math.min(indexRef.current / query.length, 1) * 4,
          );

          setStep(nextStep);

          if (indexRef.current >= query.length) {
            return;
          }

          tick();
        },
        100 + Math.random() * 100,
      );
    };

    if (step === 0) {
      timeout = window.setTimeout(tick, 500);
    } else {
      tick();
    }

    return () => clearTimeout(timeout);
  }, [step, setStep]);

  return (
    <div className="p-16 flex relative gap-12 items-center text-body-medium">
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
          strokeOpacity="0.4"
          strokeWidth="1.25"
        />
      </svg>

      {(() => {
        if (step === -1)
          return (
            <div className="text-black-alpha-48">
              {t("common.homeSections.scoutAgent.results.searching")}
            </div>
          );

        return (
          <div>
            {inputText}
            {step < 1 && <span className="cursor">|</span>}
          </div>
        );
      })()}

      <div className="h-1 w-full bg-border-faint absolute bottom-0 start-0" />
    </div>
  );
};

const Field = ({ index, value: _value }: { index: number; value: string }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    let i = index * -0.5;

    const stopInterval = setIntervalOnVisible({
      element: document.getElementById("scout-agent"),
      callback: () => {
        i += 0.2;

        setValue(
          encryptText(_value, Math.max(i, 0), {
            randomizeChance: 0.4,
          }),
        );

        if (i >= 1) {
          stopInterval?.();
        }
      },
      interval: 100,
    });

    return () => {
      stopInterval?.();
    };
  }, [_value, index]);

  return value;
};

export const data = [
  {
    title: "Taylor Swift | The Eras Tour - SoFi Stadium",
    description:
      "Section 234, Row 15, Seats 8-9. Official resale tickets available.",
    url: "ticketmaster.com",
    price: "$485",
  },
  {
    title: "Eras Tour LA - Floor Seats Available",
    description:
      "Premium floor seats, Section A, Row 12. Verified seller with instant transfer.",
    url: "stubhub.com",
    price: "$1,250",
  },
  {
    title: "Taylor Swift Concert Tickets - Los Angeles",
    description:
      "Upper level seats with great view. Section 312, Row 8. Best value option.",
    url: "vividseats.com",
    price: "$325",
  },
  {
    title: "VIP Package - Eras Tour SoFi Stadium",
    description:
      "Includes early entry, exclusive merch, and premium seating in Section 112.",
    url: "ticketmaster.com",
    price: "$2,100",
  },
  {
    title: "Last Minute Eras Tour Tickets",
    description:
      "Verified resale, Section 118, Row 22. Mobile tickets, instant delivery.",
    url: "seatgeek.com",
    price: "$590",
  },
  {
    title: "Taylor Swift LA Night 2 - Great Seats",
    description:
      "Section 134, Row 5. Close to stage with excellent sightlines.",
    url: "stubhub.com",
    price: "$875",
  },
];
