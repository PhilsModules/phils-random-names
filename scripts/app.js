import { RandomNameAPI } from "./api.js";
import { RandomNameGeneratorApp } from "./generator-app.js";
import { GeneratorPreviewApp } from "./preview-app.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class RandomNameApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "phils-random-names-app",
        tag: "form",
        window: {
            title: "PRN.Common.Title",
            icon: "fas fa-dice",
            resizable: true,
            controls: [
                {
                    icon: 'fas fa-sync',
                    label: "PRN.App.UpdateContent",
                    action: "create",
                }
            ]
        },
        classes: ["phils-random-names-dialog"],
        position: {
            width: 550,
            height: "auto"
        },
        actions: {
            generateSimple: RandomNameApp.prototype._onGenerateSimple,
            generateComplex: RandomNameApp.prototype._onGenerateComplex,
            create: RandomNameApp.prototype._onCreate,
            createComplexTemplate: RandomNameApp.prototype._onCreateComplexTemplate,
            createSimpleTemplate: RandomNameApp.prototype._onCreateSimpleTemplate,
            openGenerator: RandomNameApp.prototype._onOpenGenerator
        }
    };

    static PARTS = {
        main: {
            template: "modules/phils-random-names/templates/app.hbs"
        }
    };

    async _prepareContext(options) {
        const groups = RandomNameAPI.getGroupedStructure();
        const hasCategories = (groups.items.length + groups.general.length + groups.names.length) > 0;
        return {
            groups,
            hasCategories
        };
    }

    _onRender(context, options) {
        super._onRender(context, options);
    }

    _onOpenGenerator(event, target) {
        new RandomNameGeneratorApp().render({ force: true });
    }

    async _onGenerateSimple(event, target) {
        const journalId = target.dataset.journalId;
        const result = await RandomNameAPI.generateSimple(journalId);
        
        if (result) {
            new GeneratorPreviewApp({ items: [result] }, "simple").render({ force: true });
        }
    }

    async _onGenerateComplex(event, target) {
        const container = target.closest(".complex-category");
        const categoryName = container.dataset.category;

        const genderInput = container.querySelector(`input[name="gender-${categoryName}"]:checked`);
        const surnameInput = container.querySelector(`input[name="surname-${categoryName}"]`);

        const gender = genderInput ? genderInput.value : "any";
        const withSurname = surnameInput ? surnameInput.checked : false;

        const categories = RandomNameAPI.getStructure();
        const catData = categories.find(c => c.name === categoryName);

        if (!catData) return;

        const result = RandomNameAPI.generateComplex(catData, gender, withSurname);
        
        if (result) {
             new GeneratorPreviewApp({ items: [result] }, "complex").render({ force: true });
        }
    }

    // _displayResult removed as it is no longer used by generation methods.
    // Keeping check logic for safety if something else used it, but for now we replace usage.

    async _onCreate(event, target) {
        try {
            await RandomNameAPI.createOneClickContent();
            ui.notifications.info(game.i18n.localize("PRN.App.InfoCreated"));
            this.render();
        } catch (err) {
            console.error(err);
            ui.notifications.error("Error creating content: " + err.message);
        }
    }

    async _onCreateComplexTemplate(event, target) {
        const name = await this._promptName(
            game.i18n.localize("PRN.App.TitleComplex"),
            game.i18n.localize("PRN.App.LabelComplex")
        );
        if (name) {
            await RandomNameAPI.createComplexTemplate(name);
            this.render();
        }
    }

    async _onCreateSimpleTemplate(event, target) {
        const name = await this._promptName(
            game.i18n.localize("PRN.App.TitleSimple"),
            game.i18n.localize("PRN.App.LabelSimple")
        );
        if (name) {
            await RandomNameAPI.createSimpleTemplate(name);
            this.render();
        }
    }

    async _promptName(title, label) {
        return new Promise((resolve) => {
            new Dialog({
                title: title,
                content: `
                    <form>
                        <div class="form-group">
                            <label>${label}</label>
                            <input type="text" name="name" autofocus style="width: 100%; margin-top: 5px; margin-bottom: 10px;"/>
                        </div>
                    </form>
                `,
                buttons: {
                    ok: {
                        label: game.i18n.localize("PRN.App.ButtonCreate"),
                        icon: `<i class="fas fa-check"></i>`,
                        callback: (html) => resolve(html.find('[name="name"]').val())
                    },
                    cancel: {
                        label: game.i18n.localize("PRN.App.ButtonCancel"),
                        icon: `<i class="fas fa-times"></i>`,
                        callback: () => resolve(null)
                    }
                },
                default: "ok"
            }).render(true);
        });
    }
}
