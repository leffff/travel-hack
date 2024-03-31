import { useBreadcrumb } from "@/components/Breadcrumbs/Breadcrumbs";
import { ImageFeed } from "@/components/ImageFeed/image-feed.widget";
import { EventFilters } from "@/components/filters/filters.widget";
import { SearchWidget } from "@/components/Search/search.widget";
import { SelectedImages } from "@/components/SelectedImages/selected-images.widget";
import { EventsViewModel } from "@/stores/events.store";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const Page = observer(() => {
  const [vm] = useState(() => new EventsViewModel());
  useBreadcrumb("Фотографии", "/events", 2);

  return (
    <div className="flex flex-col section text-text relative">
      <SearchWidget vm={vm.searchVm} />
      <EventFilters vm={vm.filtersVm} />
      <ImageFeed vm={vm} />
      <div className="h-10" />
      <SelectedImages vm={vm} />
      <Outlet />
    </div>
  );
});

export const Route = createLazyFileRoute("/_nav/_events/events/")({
  component: () => <Page />
});
