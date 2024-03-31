import { makeAutoObservable } from "mobx";
import { AuthService } from "./auth.service";

export class LoginStore {
  private _tab: "login" | "register" = "login";
  get tab() {
    return this._tab;
  }
  set tab(v: "login" | "register") {
    this._tab = v;
    this.isErrored = false;
  }

  isLoading = false;
  isErrored = false;
  email = "";
  password = "";

  constructor(public redirectUrl: string) {
    makeAutoObservable(this);
  }

  async onSubmit() {
    this.isLoading = true;

    const success =
      this.tab === "login"
        ? await AuthService.login(this.email, this.password)
        : await AuthService.register(this.email, this.password);

    if (success) {
      if (this.redirectUrl && !this.redirectUrl.includes("/login")) {
        window.location.href = this.redirectUrl;
        return;
      }
      window.location.href = "/";
    } else {
      this.isErrored = true;
    }
    this.isLoading = false;
  }
}
