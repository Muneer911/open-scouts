import { Fragment } from "react";

import {
  ConnectorToBottom,
  ConnectorToLeft,
  ConnectorToRight,
} from "@/components/shared/layout/curvy-rect";
import HeaderGithub from "@/components/shared/header/Github/Github";
import { NAV_ITEMS } from "@/components/shared/header/Nav/items";

import HeaderDropdownMobileItem from "./Item/Item";
import UserMenu from "@/components/shared/header/UserMenu/UserMenu";
import LanguageToggle from "@/components/shared/header/LanguageToggle/LanguageToggle";

export default function HeaderDropdownMobile({
}: {} = {}) {
  return (
    <div className="container relative">
      <div className="overlay border-x pointer-events-none border-border-faint" />
      <ConnectorToBottom className="-top-1 -start-10" />
      <ConnectorToBottom className="-top-1 -end-10" />

      <div>
        {NAV_ITEMS.map((item) => (
          <Fragment key={item.labelKey}>
            <HeaderDropdownMobileItem item={item} />
          </Fragment>
        ))}
      </div>

      <div className="p-24 flex flex-col gap-12 border-b border-border-faint relative -mt-1">
        <LanguageToggle />
        <HeaderGithub />
        <UserMenu />

        <ConnectorToRight className="start-0 -bottom-11" />
        <ConnectorToLeft className="end-0 -bottom-11" />
      </div>

      <div className="h-36" />
    </div>
  );
}
