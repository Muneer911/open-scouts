"use client";

import { useI18n } from "@/contexts/I18nContext";

export default function Logo() {
  const { t } = useI18n();
  return (
    <span className="text-lg text-accent-black">
      {t("common.header.brand.name")}
    </span>
  );
}
