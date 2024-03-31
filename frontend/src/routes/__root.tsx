import { BreadcrumbProvider } from "@/components/Breadcrumbs/Breadcrumbs";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <BreadcrumbProvider>
      <Outlet />
    </BreadcrumbProvider>
  ),
  pendingComponent: () => <div>Загружаем!</div>
});
