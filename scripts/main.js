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
    // Register Setting: Reinstall Macro
    game.settings.register("phils-random-names", "reinstallMacro", {
        name: "Re-Install Macro",
        hint: "If you accidentally deleted the macro, click this button to restore it.",
        scope: "world",
        config: true,
        type: String, // We use a dummy type, but render using a menu or just a boolean that acts as a trigger? 
        // Foundry V5/V10+ Menus are better, but for a simple clickable button in settings we often need a Menu Registration.
        // Simplified approach: Just restart/reload or use a macro.
        // Actually, let's use a Menu to be clean.
        default: "",
    });

    // Register Setting: Content Language
    game.settings.register("phils-random-names", "contentLanguage", {
        name: "Content Language",
        scope: "world",
        config: false,
        type: String,
        default: ""
    });

    game.settings.registerMenu("phils-random-names", "reinstallMacroMenu", {
        name: "Re-Install Macro",
        label: "RESTORE MACRO",
        hint: "Restores the 'Phil's Random Names' macro if missing.",
        icon: "fas fa-undo",
        type: ReinstallMacroConfig,
        restricted: true
    });
});

/**
 * Configuration Application just to trigger the action
 */
class ReinstallMacroConfig extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "prn-reinstall-macro",
            title: "Restore Macro",
            template: "templates/hud/dialog.html", // Standard valid template or empty, we just run logic
            width: 300,
            height: "auto"
        });
    }

    render() {
        // Directly trigger logic and close
        createModuleMacro().then(() => {
            ui.notifications.info("Macro check complete.");
            this.close();
        });
        return null; // Don't actually render a window
    }
}

Hooks.once("ready", async () => {
    // Only GM should create macros or check for updates
    if (!game.user.isGM) return;

    // Check & Create Macro
    await createModuleMacro();

    // Language Check (Auto-Update content if language changed)
    const currentLang = game.i18n.lang;
    const lastContentLang = game.settings.get("phils-random-names", "contentLanguage");
    const folder = game.folders.getName("Phils Random Names");

    if (folder && lastContentLang !== currentLang) {
        console.log(`Phils Random Names | Language switch detected (${lastContentLang} -> ${currentLang}). Updating content...`);
        ui.notifications.info("Phils Random Names | Updating content language...");
        await RandomNameAPI.createOneClickContent();
        await game.settings.set("phils-random-names", "contentLanguage", currentLang);
    } else if (folder && !lastContentLang) {
         // Initialize setting if missing but folder exists
         await game.settings.set("phils-random-names", "contentLanguage", currentLang);
    }

    // Version Check
    const currentVersion = game.modules.get("phils-random-names").version;
    const lastVersion = game.settings.get("phils-random-names", "lastVersion");

    if (foundry.utils.isNewerVersion(currentVersion, lastVersion)) {
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

/**
 * Checks for existing macro and creates it if missing
 * Can be called manually from Settings
 */
async function createModuleMacro() {
    const macroName = "Phil's Random Names";
    const existing = game.macros.find(m => m.name === macroName);

    if (!existing) {
        await Macro.create({
            name: macroName,
            type: "script",
            scope: "global",
            img: "icons/sundries/gaming/dice-runed-brown.webp",
            command: `const { RandomNameApp } = game.modules.get("phils-random-names").api;\nnew RandomNameApp().render({ force: true });`
        });
        ui.notifications.info("Phils Random Names: Macro created in your Macro Directory!");
    } else {
        // Optional: Notify if called manually that it already exists?
        // For auto-run we stay silent. Since this function is shared, we could return a boolean.
    }
}
