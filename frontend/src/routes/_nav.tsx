import { UserNavbar } from "@/components/UserNavbar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_nav")({
  component: () => (
    <div className="flex flex-col w-full bg-bg min-h-dvh">
      <UserNavbar />
    </div>
  )
});
