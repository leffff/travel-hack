import { useBreadcrumb } from "@/components/Breadcrumbs/Breadcrumbs";
import { UserHeader } from "@/components/UserHeader";
import { EventsViewModel } from "@/stores/events.store";
import { Outlet, createFileRoute } from "@tanstack/react-router";

const Page = () => {
  useBreadcrumb("Проекты и мероприятия", "/events", 1);

  return (
    <>
      <UserHeader
        title="Фотографии"
        body="Наш портал предлагает огромный выбор фотографий высокого качества, подходящих для любых проектов. Найдите идеальное изображение для вашего сайта или рекламной кампании с нами."
      />
      <div className="bg-bg-content rounded-t-[40px] pt-10 flex-1">
        <Outlet />
      </div>
    </>
  );
};

export const Route = createFileRoute("/_nav/_events")({
  component: () => <Page />
});
