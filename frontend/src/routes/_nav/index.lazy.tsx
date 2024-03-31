import { Navigate, createFileRoute } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";

const Index = observer(() => {
  return <Navigate to="/events" />;
});

export const Route = createFileRoute("/_nav/")({
  component: () => <Index />
});
