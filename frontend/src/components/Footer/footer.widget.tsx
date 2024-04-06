import { Link } from "@tanstack/react-router";
import { Button } from "../ui/Button";
import ProfileIcon from "@/assets/icons/profile.svg";
import LogoBigIcon from "@/assets/logo-big.svg";
import TgIcon from "@/assets/icons/tg.svg";
import VkIcon from "@/assets/icons/vk.svg";

export const Footer = () => {
  return (
    <div className="flex rounded-t-[20px] bg-bg text-white pt-6 pb-4">
      <div className="sm:hidden flex-col w-full flex max-w-7xl mx-auto px-6">
        <div className="flex gap-4 font-medium w-full justify-between">
          <div className="flex flex-col gap-2">
            <h2>О нас</h2>
            <Link className="text-sm text-text-secondary">Партнеры</Link>
            <Link className="text-sm text-text-secondary">Обратная связь</Link>
            <Link className="text-sm text-text-secondary">FAQ</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link>
              Проекты
              <wbr /> и мероприятия
            </Link>
            <Link>
              Аналитика
              <wbr /> и тренды
            </Link>
            <Link>Журнал</Link>
            <Link>
              Меры
              <wbr /> поддержки
            </Link>
          </div>
        </div>
        <span className="mt-6">
          Больше возможностей
          <br />в личном кабинете
        </span>
        <Button className="mt-4 text-text">
          <ProfileIcon className="size-6" />
          Профиль
        </Button>
        <div className="flex items-center mt-6">
          <LogoBigIcon />
          <VkIcon className="ml-auto" />
          <TgIcon />
        </div>
        <span className="w-full h-px bg-natural2 my-4" />
        <p className="text-xs text-text-secondary leading-5">
          © 2023, АНО «Проектный офис по развитию туризма и гостеприимства Москвы»
          <br />
          Политика конфиденциальности
          <br />
          Политика обработки персональных данных
          <br />
          Пользовательское соглашение
        </p>
      </div>
      <div
        className="sm:flex hidden flex-col w-full max-w-7xl mx-auto px-2"
        style={{ paddingInline: 30 }}>
        <div className="flex gap-4 font-medium w-full justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl">О нас</h2>
            <Link className="text-text-secondary">Партнеры</Link>
            <Link className="text-text-secondary">Обратная связь</Link>
            <Link className="text-text-secondary">FAQ</Link>
          </div>
          <div className="flex flex-col gap-2 text-xl">
            <Link>
              Проекты
              <wbr /> и мероприятия
            </Link>
            <Link>
              Аналитика
              <wbr /> и тренды
            </Link>
          </div>
          <div className="flex flex-col gap-2 text-text-secondary">
            <Link>Журнал</Link>
            <Link>
              Меры
              <wbr /> поддержки
            </Link>
          </div>
          <div className="flex flex-col">
            <span>
              Больше возможностей
              <br />в личном кабинете
            </span>
            <Button className="mt-4 text-text">
              <ProfileIcon className="size-6" />
              Профиль
            </Button>
          </div>
        </div>
        <div className="flex items-center mt-6">
          <LogoBigIcon />
          <VkIcon className="ml-auto" />
          <TgIcon />
        </div>
        <span className="w-full h-px bg-natural2 my-4" />
        <p className="text-xs text-text-secondary leading-5">
          © 2023, АНО «Проектный офис по развитию туризма и гостеприимства Москвы»
        </p>
      </div>
    </div>
  );
};
