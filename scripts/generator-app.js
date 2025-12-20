import { RandomNameAPI } from "./api.js";
import { GeneratorPreviewApp } from "./preview-app.js";

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
            const c1 = parseInt(html.querySelector("#menu-food-count").value);
            config.count1 = isNaN(c1) ? 10 : c1;

            const c2 = parseInt(html.querySelector("#menu-drink-count").value);
            config.count2 = isNaN(c2) ? 5 : c2;
        } else {
            const c1 = parseInt(html.querySelector("#loot-trinket-count").value);
            config.count1 = isNaN(c1) ? 5 : c1;

            const c2 = parseInt(html.querySelector("#loot-gem-count").value);
            config.count2 = isNaN(c2) ? 2 : c2;
        }

        const result = await RandomNameAPI.generateCombined(type, config);

        // Open Preview
        new GeneratorPreviewApp(result, type).render(true);
    }
}
