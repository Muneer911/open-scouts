"use client";
import {
  ConnectorToLeft,
  ConnectorToRight,
} from "@/components/shared/layout/curvy-rect";
import { NAV_ITEMS } from "@/components/shared/header/Nav/items";
import { useI18n } from "@/contexts/I18nContext";
import Link from "next/link";

export default function HeaderDropdownMobileItem({
  item,
}: {
  item: (typeof NAV_ITEMS)[number];
}) {
  const { t } = useI18n();

  return (
    <Link className="p-24 flex group relative" href={item.href}>
      <div className="h-1 bottom-0 absolute start-0 w-full bg-border-faint" />
      <ConnectorToRight className="-top-11 start-0" />
      <ConnectorToRight className="-bottom-10 start-0" />
      <ConnectorToLeft className="-top-11 end-0" />
      <ConnectorToLeft className="-bottom-10 end-0" />

      <span className="px-4 flex-1 text-label-medium text-accent-black">
        {t(item.labelKey)}
      </span>
    </Link>
  );
}
