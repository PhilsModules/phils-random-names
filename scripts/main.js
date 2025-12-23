import { RandomNameApp } from "./app.js";
import { RandomNameAPI } from "./api.js";

Hooks.once("init", () => {
    console.log("Phils Random Names | Initializing");
    // Expose API for Macro use
    game.modules.get("phils-random-names").api = {
        RandomNameApp,
        RandomNameAPI
    };

    // Register Setting: Last Version
    game.settings.register("phils-random-names", "lastVersion", {
        name: "Last Version",
        scope: "world",
        config: false,
        type: String,
        default: "0.0.0"
    });
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

    // Version Check
    const currentVersion = game.modules.get("phils-random-names").version;
    const lastVersion = game.settings.get("phils-random-names", "lastVersion");

    if (foundry.utils.isNewerVersion(currentVersion, lastVersion)) {
        if (game.user.isGM) {
            ChatMessage.create({
                content: `
                    <div style="text-align: center;">
                        <h3 style="border:none; margin-bottom: 5px;">Phils Random Names Updated</h3>
                        <p style="margin-bottom: 10px;">New examples created. Please update your lists to get the latest content.</p>
                        <button class="prn-update-examples-btn" style="width:100%">Update Lists Now</button>
                    </div>
                `,
                speaker: { alias: "System" }
            });
        }
        await game.settings.set("phils-random-names", "lastVersion", currentVersion);
    }

    // Listener for Button
    // We bind to document body because chat messages are rendered dynamically
    $("body").on("click", ".prn-update-examples-btn", async (event) => {
        event.preventDefault();

        // Prevent multiple clicks if desired, or just let it run.
        // Simple feedback
        ui.notifications.info("Phils Random Names | Updating Lists...");

        try {
            const api = game.modules.get("phils-random-names").api.RandomNameAPI;
            await api.createOneClickContent();
            ui.notifications.info("Phils Random Names | Lists Updated Successfully!");
        } catch (err) {
            console.error(err);
            ui.notifications.error("Phils Random Names | Error Updating Lists. Check Console.");
        }
    });
});
