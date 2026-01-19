const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
import { RandomNameAPI } from "./api.js";

export class GeneratorPreviewApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "phils-random-names-preview",
        tag: "form",
        window: {
            title: "PRN.Preview.Title",
            icon: "fas fa-list-alt",
            resizable: true,
            controls: []
        },
        classes: ["phils-random-names-dialog"],
        position: {
            width: 500,
            height: "auto"
        },
        actions: {
            reroll: GeneratorPreviewApp.prototype._onReroll,
            post: GeneratorPreviewApp.prototype._onPost,
            inspect: GeneratorPreviewApp.prototype._onInspect
        }
    };

    static PARTS = {
        main: {
            template: "modules/phils-random-names/templates/preview.hbs"
        }
    };

    constructor(data, type) {
        super();
        this.data = data; // { items: [] }
        this.type = type; // "menu", "loot"
    }

    async _prepareContext(options) {
        let title = game.i18n.localize("PRN.Preview.Title");
        
        if (this.type === "menu") title = game.i18n.localize("PRN.Generator.TavernMenu");
        else if (this.type === "loot") title = game.i18n.localize("PRN.Generator.TreasurePouch");
        else if (this.type === "simple") title = this.data.items[0]?.label || game.i18n.localize("PRN.Generator.Title");
        else if (this.type === "complex") title = game.i18n.localize("PRN.Generator.RandomName");

        return {
            items: this.data.items,
            title: title
        };
    }

    async _onInspect(event, target) {
        const uuid = target.dataset.uuid;
        if (!uuid) return;
        const item = await fromUuid(uuid);
        if (item && item.sheet) {
            item.sheet.render(true);
        }
    }

    async _onReroll(event, target) {
        const index = target.closest(".preview-item").dataset.index;
        const item = this.data.items[index];

        if (item) {
            let newItem = null;

            if (item.subType === "simple") {
                newItem = await RandomNameAPI.generateSimple(item.source);
            } else if (item.subType === "complex") {
                // Find category data again or just pass config?
                // API.generateComplex needs structure data. 
                // We should probably finding structure by name.
                const categories = RandomNameAPI.getStructure();
                const catData = categories.find(c => c.name === item.source);
                if (catData) {
                    newItem = RandomNameAPI.generateComplex(catData, item.config?.gender || "any", item.config?.withSurname || false);
                }
            } else {
                // Legacy / combined logic for menu/loot
                newItem = await RandomNameAPI.getSingleItem(item.source, item.subType);
            }

            if (newItem) {
                // Update Data
                const merged = { ...this.data.items[index], ...newItem };
                this.data.items[index] = merged;
                this.render();
            }
        }
    }

    async _onPost(event, target) {
        await RandomNameAPI.postToChat(this.type, this.data.items);
        this.close();
    }
}
