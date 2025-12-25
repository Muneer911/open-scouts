import { Connector } from "../layout/curvy-rect";
import HeaderBrandKit from "./BrandKit/BrandKit";
import HeaderDropdownWrapper from "./Dropdown/Wrapper/Wrapper";
import HeaderGithub from "./Github/Github";
import HeaderNav from "./Nav/Nav";
import HeaderWrapper from "./Wrapper/Wrapper";
import HeaderToggle from "./Toggle/Toggle";
import HeaderDropdownMobile from "./Dropdown/Mobile/Mobile";
import UserMenu from "./UserMenu/UserMenu";
import LanguageToggle from "./LanguageToggle/LanguageToggle";

export default function Header() {
  return (
    <>
      <HeaderDropdownWrapper />

      <div className="sticky top-0 start-0 w-full z-[101] bg-background-base header">
        <div className="absolute top-0 cmw-container border-x border-border-faint h-full pointer-events-none" />

        <div className="h-1 bg-border-faint w-full start-0 -bottom-1 absolute" />

        <div className="cmw-container absolute h-full pointer-events-none top-0">
          <Connector className="absolute -start-[10.5px] -bottom-11" />
          <Connector className="absolute -end-[10.5px] -bottom-11" />
        </div>

        <HeaderWrapper>
          <div className="flex gap-24 items-center">
            <HeaderBrandKit />
          </div>

          <div className="flex gap-24 items-center lg-max:hidden">
            <HeaderNav />
            <div className="text-black-alpha-16 text-label-medium select-none">
              ·
            </div>
            <div className="flex gap-8 items-center">
              <LanguageToggle />
              <HeaderGithub />
              <UserMenu />
            </div>
          </div>

          <HeaderToggle
            dropdownContent={
              <HeaderDropdownMobile />
            }
          />
        </HeaderWrapper>
      </div>
    </>
  );
}
