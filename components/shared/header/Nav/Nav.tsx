"use client";

import HeaderNavItem from "./Item/Item";
import { useI18n } from "@/contexts/I18nContext";
import { NAV_ITEMS } from "./items";

export default function HeaderNav() {
  const { t } = useI18n();
  return (
    <div className="flex gap-8 relative lg-max:hidden select-none">
      {NAV_ITEMS.map((item) => (
        <HeaderNavItem
          key={item.labelKey}
          href={item.href}
          label={t(item.labelKey)}
        />
      ))}
    </div>
  );
}
