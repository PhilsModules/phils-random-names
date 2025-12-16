import { RandomNameApp } from "./app.js";

Hooks.once("init", () => {
    console.log("Phils Random Names | Initializing");
});

Hooks.on("getJournalDirectoryEntryContext", (html, entryOptions) => {
    // Optional
});

// Add button to Journal Directory Header
Hooks.on("renderJournalDirectory", (app, html, data) => {
    const element = html instanceof HTMLElement ? html : html[0];

    // Check if button already exists to avoid dupes (unlikely with render hook but good practice)
    if (element.querySelector(".phils-random-names-btn")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("phils-random-names-btn");
    button.style.flex = "0 0 auto";
    button.style.width = "auto";
    button.style.minWidth = "0";
    button.innerHTML = `<i class="fas fa-dice"></i> Random Names`;

    button.addEventListener("click", event => {
        event.preventDefault();
        new RandomNameApp().render(true);
    });

    const headerActions = element.querySelector(".header-actions");
    if (headerActions) {
        headerActions.append(button);
    } else {
        element.querySelector(".directory-header")?.append(button);
    }
});
