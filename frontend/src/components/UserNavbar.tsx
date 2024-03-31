import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import Logo from "@/assets/logo-big.svg";
import { Link } from "@tanstack/react-router";
import { FC, ReactNode } from "react";
import { Routes } from "@/lib/types/route";
import { Chevron } from "./ui/Chevron";
import RussianFlag from "@/assets/icons/rus.svg";
import Search from "@/assets/icons/search.svg";
import Bell from "@/assets/icons/bell.svg";
import Profile from "@/assets/icons/profile.svg";

interface NavLinkProps {
  children: ReactNode;
  to?: Routes;
}

const NavLink: FC<NavLinkProps> = (x) => {
  return (
    <li>
      <Link to={x.to} className="flex items-center gap-1">
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
  return (
    <nav className="text-white section gap-12 py-4">
      <Logo />
      <ul className="flex items-center gap-6">
        <NavLink>
          О нас
          <Chevron />
        </NavLink>
        <NavLink>Проекты и мероприятия</NavLink>
        <NavLink>Аналитика и тренды</NavLink>
        <NavLink>Журнал</NavLink>
        <NavLink>Партнеры</NavLink>
      </ul>
      <div className="flex items-center *:p-2 ml-auto">
        <button>
          <Search />
        </button>
        <button className="flex items-center gap-2">
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
          <p>Профиль</p>
        </button>
      </div>
    </nav>
  );
});
