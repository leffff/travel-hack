import {
  BreadcrumbProvider,
  Breadcrumbs,
  useBreadcrumb
} from "@/components/Breadcrumbs/Breadcrumbs";
import { UserNavbar } from "@/components/UserNavbar";
import { Outlet, createFileRoute } from "@tanstack/react-router";

const Page = () => {
  useBreadcrumb("Главная", "/", 0);

  return (
    <div className="flex flex-col w-full bg-bg h-dvh overflow-auto">
      <UserNavbar />
      <div className="h-6" />
      <Breadcrumbs />
      <Outlet />
    </div>
  );
};

export const Route = createFileRoute("/_nav")({
  component: () => <Page />
});
