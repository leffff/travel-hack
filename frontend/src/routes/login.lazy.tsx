import { LoginStore } from "@/stores/login.store";
import { createFileRoute } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const Login = observer(() => {
  const { redirect } = Route.useSearch();
  const [vm] = useState(() => new LoginStore(redirect));

  return <div className="w-full h-full flex items-center justify-center">в</div>;
});

interface LoginSearch {
  redirect: string;
}

export const Route = createFileRoute("/login")({
  component: Login,
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: search.redirect ? String(search.redirect) : "/"
    };
  }
});
