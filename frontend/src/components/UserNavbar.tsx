import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import Logo from "@/assets/logo-big.svg";
import { Link } from "@tanstack/react-router";
import { FC, ReactNode, useState } from "react";
import { Routes } from "@/lib/types/route";
import { Chevron } from "./ui/Chevron";
import RussianFlag from "@/assets/icons/rus.svg";
import Search from "@/assets/icons/search.svg";
import Bell from "@/assets/icons/bell.svg";
import Profile from "@/assets/icons/profile.svg";
import { cn } from "@/lib/utils/cn";
import HamburgerIcon from "@/assets/icons/hamburger.svg";
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "./ui/Drawer";

interface NavLinkProps {
  children: ReactNode;
  to?: Routes;
  className?: string;
}

const NavLink: FC<NavLinkProps> = (x) => {
  return (
    <li>
      <Link to={x.to} className={cn("flex items-center gap-1", x.className)}>
        {x.children}
      </Link>
    </li>
  );
};

const Ribbon = (x: { children: ReactNode }) => {
  return (
    <div className="absolute w-4 h-4 top-0 right-0 bg-primary text-[10px] text-bg flex items-center justify-center rounded-full pt-[2px]">
      {x.children}
    </div>
  );
};

export const UserNavbar = observer(() => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav className="text-white section gap-12 py-4">
        <Logo />
        <ul className="hidden sm:flex items-center">
          <NavLink>
            О нас
            <Chevron />
          </NavLink>
          <NavLink className="hidden lg:flex px-3">Проекты и мероприятия</NavLink>
          <NavLink className="hidden lg:flex px-3">Аналитика и тренды</NavLink>
          <NavLink className="hidden xl:flex px-3">Журнал</NavLink>
          <NavLink className="hidden xl:flex px-3">Партнеры</NavLink>
        </ul>
        <div className="flex items-center *:p-2 ml-auto">
          <button>
            <Search />
          </button>
          <button className="hidden sm:flex items-center gap-2">
            <RussianFlag />
            РУС
          </button>
          <button className="relative">
            <Ribbon>1</Ribbon>
            <Bell />
          </button>
          <button className="relative flex items-center gap-2">
            <Ribbon>1</Ribbon>
            <Profile />
            <p className="hidden sm:block">Профиль</p>
          </button>
          <Drawer open={drawerOpen} onOpenChange={(v) => setDrawerOpen(v)}>
            <DrawerTrigger className="sm:hidden">
              <HamburgerIcon />
            </DrawerTrigger>
            <DrawerContent className="min-h-96">
              <ul className="flex flex-col gap-4 px-6">
                <NavLink className="py-2">О нас</NavLink>
                <NavLink className="py-2">Проекты и мероприятия</NavLink>
                <NavLink className="py-2">Аналитика и тренды</NavLink>
                <NavLink className="py-2">Журнал</NavLink>
                <NavLink className="py-2">Партнеры</NavLink>
              </ul>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>
    </>
  );
});
