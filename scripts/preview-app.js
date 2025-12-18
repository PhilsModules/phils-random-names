const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
import { RandomNameAPI } from "./api.js";

export class GeneratorPreviewApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "phils-random-names-preview",
        tag: "form",
        window: {
            title: "Result Preview",
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
            post: GeneratorPreviewApp.prototype._onPost
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
        return {
            items: this.data.items,
            title: this.type === "menu" ? "Tavern Menu" : "Loot Pouch"
        };
    }

    async _onReroll(event, target) {
        const index = target.closest(".preview-item").dataset.index;
        const item = this.data.items[index];

        if (item && item.source) {
            // Re-fetch from API
            // We need a new method in API for single item fetch
            const newItem = await RandomNameAPI.getSingleItem(item.source, item.subType);
            if (newItem) {
                // Update Data
                this.data.items[index].text = newItem.text;
                this.data.items[index].fullData = newItem.fullData;
                this.render();
            }
        }
    }

    async _onPost(event, target) {
        await RandomNameAPI.postToChat(this.type, this.data.items);
        this.close();
    }
}
