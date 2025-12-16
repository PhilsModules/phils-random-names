import { RandomNameAPI } from "./api.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class RandomNameApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "phils-random-names-app",
        tag: "form",
        window: {
            title: "Phil's Random Names",
            icon: "fas fa-dice",
            resizable: true,
            controls: []
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
            createSimpleTemplate: RandomNameApp.prototype._onCreateSimpleTemplate
        }
    };

    static PARTS = {
        main: {
            template: "modules/phils-random-names/templates/app.hbs"
        }
    };

    async _prepareContext(options) {
        const categories = RandomNameAPI.getStructure();
        return {
            categories,
            hasCategories: categories.length > 0
        };
    }

    async _onGenerateSimple(event, target) {
        // Simple generation: just pick from the journal
        // The ID of the category for simple ones is the journal ID or Name? 
        // In getStructure I set it to Name because simple journals don't have parts.
        // Wait, for simple I passed the journal object. Let's look at getStructure again.
        // structure.set(journal.name, { ..., journal: journal })
        // We need lookup.

        // Actually, let's pass the ID in the dataset.
        // But getStructure creates ad-hoc objects.
        // Let's rely on re-fetching or passing the journal ID.

        const journalId = target.dataset.journalId;
        const journal = game.journal.get(journalId);
        if (!journal) return;

        const name = RandomNameAPI.getRandomName(journal);
        this._displayResult(journal.name, name);
    }

    async _onGenerateComplex(event, target) {
        // Complex generation: read form inputs relative to this container
        const container = target.closest(".complex-category");
        const categoryName = container.dataset.category;

        // Find inputs
        const genderInput = container.querySelector(`input[name="gender-${categoryName}"]:checked`);
        const surnameInput = container.querySelector(`input[name="surname-${categoryName}"]`);

        const gender = genderInput ? genderInput.value : "any"; // male, female, any
        const withSurname = surnameInput ? surnameInput.checked : false;

        // Re-fetch structure to get journals (efficient enough)
        const categories = RandomNameAPI.getStructure();
        const catData = categories.find(c => c.name === categoryName);

        if (!catData) return;

        const name = RandomNameAPI.generateComplex(catData, gender, withSurname);
        this._displayResult(categoryName, name);
    }

    _displayResult(title, name) {
        if (name) {
            ChatMessage.create({
                content: `<div class="phils-random-name-card">
                    <p style="font-size: 1.5em; font-weight: bold; text-align: center; margin: 0;">${name}</p>
                </div>`
            });
            ui.notifications.info(`Generated: ${name}`);
        } else {
            ui.notifications.warn(`Could not generate name for ${title}`);
        }
    }


    async _onCreate(event, target) {
        try {
            await RandomNameAPI.createOneClickContent();
            ui.notifications.info("Phils Random Names: Folder and samples created!");
            this.render();
        } catch (err) {
            console.error(err);
            ui.notifications.error("Error creating content: " + err.message);
        }
    }

    async _onCreateComplexTemplate(event, target) {
        const name = await this._promptName("Neuer NPC Generator", "Name des NPCs (z.B. 'Zwerg', 'Goblin'):");
        if (name) {
            await RandomNameAPI.createComplexTemplate(name);
            this.render();
        }
    }

    async _onCreateSimpleTemplate(event, target) {
        const name = await this._promptName("Neue Liste", "Name der Liste (z.B. 'Orte', 'Tavernen'):");
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
                        label: "Erstellen",
                        icon: `<i class="fas fa-check"></i>`,
                        callback: (html) => resolve(html.find('[name="name"]').val())
                    },
                    cancel: {
                        label: "Abbrechen",
                        icon: `<i class="fas fa-times"></i>`,
                        callback: () => resolve(null)
                    }
                },
                default: "ok"
            }).render(true);
        });
    }
}
