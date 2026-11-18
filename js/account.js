const themeButton = document.querySelector("#theme-toggle");
const accountLink = document.querySelector("#account-link");
const signInForm = document.querySelector("#sign-in-form");
const themeKey = "atelier-theme";
const visitorKey = "atelier-visitor";

let theme = "light";
let visitorName = "";

try {
    theme = localStorage.getItem(themeKey) === "dark" ? "dark" : "light";
    visitorName = localStorage.getItem(visitorKey) || "";
} catch {
    // Keep the default view when the browser blocks storage.
}

function showTheme() {
    document.documentElement.dataset.theme = theme;
    themeButton.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

showTheme();
themeButton.hidden = false;
themeButton.addEventListener("click", function () {
    theme = theme === "dark" ? "light" : "dark";
    showTheme();
    try {
        localStorage.setItem(themeKey, theme);
    } catch {
        // The toggle still works on the current page.
    }
});

accountLink.textContent = visitorName ? "Account" : "Sign in";

if (signInForm) {
    const signedInPanel = document.querySelector("#signed-in-panel");
    const greeting = document.querySelector("#visitor-greeting");
    const nameInput = document.querySelector("#sign-in-name");
    const signOutButton = document.querySelector("#sign-out");
    const message = document.querySelector("#sign-in-message");

    function showAccount() {
        const signedIn = Boolean(visitorName);
        signInForm.hidden = signedIn;
        signedInPanel.hidden = !signedIn;
        greeting.textContent = signedIn ? "Welcome, " + visitorName + "." : "";
        accountLink.textContent = signedIn ? "Account" : "Sign in";
    }

    showAccount();
    signInForm.querySelector("button").disabled = false;

    nameInput.addEventListener("input", function () {
        nameInput.setCustomValidity("");
    });

    signInForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = nameInput.value.trim();
        if (!name) {
            nameInput.setCustomValidity("Enter a display name.");
            nameInput.reportValidity();
            return;
        }

        try {
            localStorage.setItem(visitorKey, name);
        } catch {
            message.textContent = "Enable browser storage to sign in.";
            return;
        }

        visitorName = name;
        signInForm.reset();
        message.textContent = "";
        showAccount();
        greeting.focus();
    });

    signOutButton.addEventListener("click", function () {
        try {
            localStorage.removeItem(visitorKey);
        } catch {
            message.textContent = "The saved sign-in could not be cleared. Check browser storage settings.";
            return;
        }

        visitorName = "";
        message.textContent = "You are signed out.";
        showAccount();
        nameInput.focus();
    });
}
