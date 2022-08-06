import { AuthService } from "../module/auth/index";

document.addEventListener("DOMContentLoaded", async () => {
    let authService = new AuthService();
    authService.start();

    let loginButton = document.getElementById("login");
    loginButton.addEventListener("click", ()=>authService.login());
});