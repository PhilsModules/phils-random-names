import { RandomNameApp } from "./app.js";
import { RandomNameAPI } from "./api.js";

Hooks.once("init", () => {
    console.log("Phils Random Names | Initializing");
    // Expose API for Macro use
    game.modules.get("phils-random-names").api = {
        RandomNameApp,
        RandomNameAPI
    };
});

Hooks.once("ready", async () => {
    // Check if Macro exists
    const macroName = "Phil's Random Names";
    const existing = game.macros.find(m => m.name === macroName);

    if (!existing) {
        await Macro.create({
            name: macroName,
            type: "script",
            scope: "global",
            img: "icons/sundries/gaming/dice-runed-brown.webp",
            command: `const { RandomNameApp } = game.modules.get("phils-random-names").api;\nnew RandomNameApp().render(true);`
        });
        ui.notifications.info("Phils Random Names: Macro created in your Macro Directory!");
    }
});
