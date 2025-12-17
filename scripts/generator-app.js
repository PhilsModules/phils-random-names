import { RandomNameAPI } from "./api.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class RandomNameGeneratorApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "phils-random-names-generator",
        tag: "form",
        window: {
            title: "PRN.Generator.Title",
            icon: "fas fa-cogs",
            resizable: true,
            controls: []
        },
        classes: ["phils-random-names-dialog"],
        position: {
            width: 400,
            height: "auto"
        }
    };

    static PARTS = {
        main: {
            template: "modules/phils-random-names/templates/generator.hbs"
        }
    };

    _onRender(context, options) {
        super._onRender(context, options);
        // Bind Select
        const html = this.element;
        const select = html.querySelector("#gen-type");
        const configMenu = html.querySelector("#config-menu");
        const configLoot = html.querySelector("#config-loot");

        if (select) {
            select.addEventListener("change", () => {
                if (select.value === "menu") {
                    configMenu.style.display = "block";
                    configLoot.style.display = "none";
                } else {
                    configMenu.style.display = "none";
                    configLoot.style.display = "block";
                }
            });
        }

        // Bind Button
        const btn = html.querySelector("#btn-generate-combined");
        if (btn) {
            btn.addEventListener("click", () => this._onGenerateCombined());
        }
    }

    async _onGenerateCombined() {
        const html = this.element;
        const type = html.querySelector("#gen-type").value;
        const config = {};

        if (type === "menu") {
            config.count1 = parseInt(html.querySelector("#menu-food-count").value) || 10;
            config.count2 = parseInt(html.querySelector("#menu-drink-count").value) || 5;
        } else {
            config.count1 = parseInt(html.querySelector("#loot-trinket-count").value) || 5;
            config.count2 = parseInt(html.querySelector("#loot-gem-count").value) || 2;
        }

        await RandomNameAPI.generateCombined(type, config);
        ui.notifications.info(game.i18n.localize("PRN.Generator.SuccessMessage"));
    }
}
