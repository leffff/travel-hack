import { createFileRoute } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";

const Index = observer(() => {
  return (
    <div className="pb-10">
      <div className="section mt-8 mb-7">
        <h3 className="font-semibold text-2xl">Похожие запросы в соц. сетях</h3>
      </div>
    </div>
  );
});

export const Route = createFileRoute("/_nav/")({
  component: () => <Index />
});
