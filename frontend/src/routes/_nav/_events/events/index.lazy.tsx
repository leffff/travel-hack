import { useBreadcrumb } from "@/components/Breadcrumbs/Breadcrumbs";
import { ImageFeed } from "@/components/events/ImageFeed/image-feed.widget";
import { EventFilters } from "@/components/events/filters/filters.widget";
import { SearchWidget } from "@/components/events/Search/search.widget";
import { SelectedImages } from "@/components/events/SelectedImages/selected-images.widget";
import { EventsViewModel } from "@/stores/events.store";
import { createLazyFileRoute } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { ImageCarousel } from "@/components/events/ImageCarousel/image-carousel.widget";
import { Footer } from "@/components/Footer/footer.widget";

const Page = observer(() => {
  const [vm] = useState(() => new EventsViewModel());
  useBreadcrumb("Фотографии", "/events", 2);

  return (
    <>
      <div className="flex flex-col section text-text relative">
        <SearchWidget vm={vm.searchVm} />
        <EventFilters vm={vm.filtersVm} />
        <ImageFeed vm={vm} />
        <div className="h-10" />
        <SelectedImages vm={vm} />
        <ImageCarousel vm={vm} />
      </div>
      <Footer />
    </>
  );
});

export const Route = createLazyFileRoute("/_nav/_events/events/")({
  component: () => <Page />
});
