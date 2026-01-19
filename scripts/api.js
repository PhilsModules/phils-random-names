export class RandomNameAPI {
    static getFolder() {
        return game.journal.folders.find(f => f.name === "Phils Random Names" && !f.folder);
    }

    static getJournals() {
        const root = this.getFolder();
        if (!root) return [];

        const getSubfolderIds = (folder) => {
            let ids = [folder.id];
            const children = folder.children || [];
            for (const child of children) {
                // Compatibility for V10+ folder structure where children are FolderNodes
                const childFolder = child.folder || child; 
                ids = ids.concat(getSubfolderIds(childFolder));
            }
            return ids;
        };

        const allFolderIds = new Set(getSubfolderIds(root));
        return game.journal.filter(j => j.folder && allFolderIds.has(j.folder.id));
    }

    static getNames(journalEntry) {
        if (!journalEntry) return [];
        const page = journalEntry.pages.contents[0];
        if (!page) return [];

        let content = "";
        if (page.type === "text") {
            content = page.text.content;
        } else {
            return [];
        }

        const plainText = content
            .replace(/<(br|p|li|div)[^>]*>/gi, "\n")
            .replace(/<[^>]+>/g, "");

        return plainText
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);
    }

    static getRandomName(journalEntry) {
        const names = this.getNames(journalEntry);
        if (names.length === 0) return null;
        return names[Math.floor(Math.random() * names.length)];
    }

    // Localization Helper
    static getTranslationMap() {
        return {
            "Fantasy Food": { en: "Provisions and Travel Fare", de: "Speisen und Reiseproviant" },
            "Fantasy Drinks": { en: "Brews and Elixirs", de: "Getränke und Elixiere" },
            "Fantasy Trinkets": { en: "Curiosities and Oddities", de: "Kuriositäten und Fundstücke" },
            "Fantasy Gemstones": { en: "Precious Gemstones", de: "Kostbare Edelsteine" },
            "Fantasy Treasures": { en: "Treasures and Riches", de: "Schätze und Reichtümer" },
            "Fantasy Plants": { en: "Flora and Wild Plants", de: "Flora und Wildpflanzen" },
            "Fantasy Fungi": { en: "Fungi and Spores", de: "Pilze und Sporen" },
            "Fantasy Books": { en: "Legendary Books and Manuscripts", de: "Sagenhafte Bücher und Schriften" },
            "Shops": { en: "Shops and Establishments", de: "Geschäfte und Läden" },
            "Rumors": { en: "Rumors and Legends", de: "Gerüchte und Legenden" }
        };
    }

    static getLocalizedLabel(key) {
        const map = this.getTranslationMap();
        const lang = game.i18n.lang;
        if (map[key]) {
            return (lang === "de") ? map[key].de : map[key].en;
        }
        return key;
    }

    // New: Smart Structure Parsing
    static getStructure() {
        const journals = this.getJournals();
        const structure = new Map();
        const regex = /^(.*) (Vornamen Männlich|Vornamen Weiblich|Nachnamen|First Names Male|First Names Female|Surnames)$/;

        for (const journal of journals) {
            const match = journal.name.match(regex);

            if (match) {
                // Complex Category
                const categoryName = match[1];
                const type = match[2];

                if (!structure.has(categoryName)) {
                    structure.set(categoryName, { id: categoryName, name: categoryName, isComplex: true, parts: {} });
                }
                const cat = structure.get(categoryName);

                // Map suffix to internal key
                if (type === "Vornamen Männlich" || type === "First Names Male") cat.parts.male = journal;
                if (type === "Vornamen Weiblich" || type === "First Names Female") cat.parts.female = journal;
                if (type === "Nachnamen" || type === "Surnames") cat.parts.surnames = journal;

            } else {
                // Simple Category
                structure.set(journal.name, { id: journal.name, name: journal.name, isComplex: false, journal: journal });
            }
        }

        // Localization / Renaming from Map
        for (const item of structure.values()) {
            item.name = this.getLocalizedLabel(item.id);
        }

        return Array.from(structure.values()).sort((a, b) => {
            // Sort by Original ID to keep "Fantasy" items at top
            const aIsFantasy = a.id.startsWith("Fantasy");
            const bIsFantasy = b.id.startsWith("Fantasy");

            if (aIsFantasy && !bIsFantasy) return -1;
            if (!aIsFantasy && bIsFantasy) return 1;

            return a.name.localeCompare(b.name);
        });
    }

    static getGroupedStructure() {
        const sorted = this.getStructure();
        const groups = {
            items: [],   // Fantasy ...
            general: [], // Shops, Rumors, etc.
            names: []    // Complex generators
        };

        for (const item of sorted) {
            if (item.id.startsWith("Fantasy")) {
                groups.items.push(item);
            } else if (item.isComplex) {
                groups.names.push(item);
            } else {
                groups.general.push(item);
            }
        }

        return groups;
    }

    static generateComplex(categoryData, gender, withSurname) {
        let firstName = "";
        let surname = "";

        // Resolve Gender
        let targetGender = gender;
        if (targetGender === "any") {
            targetGender = Math.random() < 0.5 ? "male" : "female";
        }

        // Get First Name
        const firstNameJournal = targetGender === "male" ? categoryData.parts.male : categoryData.parts.female;

        if (firstNameJournal) {
            firstName = this.getRandomName(firstNameJournal);
        }

        // Get Surname
        if (withSurname && categoryData.parts.surnames) {
            surname = this.getRandomName(categoryData.parts.surnames);
        }

        let fullName = "";
        // Combine
        if (firstName && surname) fullName = `${firstName} ${surname}`;
        else if (firstName) fullName = firstName;
        else if (surname) fullName = `(Only Surname) ${surname}`;
        
        return {
            text: fullName,
            source: categoryData.name,
            subType: "complex",
            config: { gender, withSurname } 
        };
    }

    // New: Standardized generator for Simple items
    static async generateSimple(journalId) {
        const journal = game.journal.get(journalId);
        if (!journal) return null;

        const rawName = this.getRandomName(journal);
        const data = this.processItemWithPrice(rawName);

        let displayText = data.name;
        let realItemUuid = null;
        let typeContext = "generic";

        // Determine context
        if (journal.name.includes("Food")) typeContext = "food";
        else if (journal.name.includes("Drinks")) typeContext = "drink";
        else if (journal.name.includes("Trinkets")) typeContext = "trinket";
        else if (journal.name.includes("Gemstones")) typeContext = "gem";
        else if (journal.name.includes("Plants")) typeContext = "plant";
        else if (journal.name.includes("Books")) typeContext = "book";
        else if (journal.name.includes("Fungi")) typeContext = "fungus";

        // Try to create real item
        if (game.user.isGM && data.hasPrice) {
            if (typeContext) {
                try {
                    const item = await this.createItem(data.name, data, typeContext);
                    if (item) {
                        displayText = `@UUID[${item.uuid}]{${data.name}}`;
                        realItemUuid = item.uuid;
                    }
                } catch (e) {
                    console.error("PRN | Failed to create item", e);
                }
            }
        }

        return {
            text: displayText,
            fullData: data,
            priceString: data.hasPrice ? data.priceString : "",
            source: journalId, // using ID for simple lookups
            subType: "simple",
            realItemUuid: realItemUuid,
            typeContext: typeContext,
            label: this.getLocalizedLabel(journal.name) // Localized Label
        };
    }

    // --- New Generator Logic (Menu / Loot) ---

    static processItemWithPrice(rawLine) {
        if (!rawLine) return { name: "Error", priceCp: 0, priceString: "", hasPrice: false };
        
        // Formats: "Name [Price]" or "Name | Description [Price]" or "Name | Description | GM Secret [Price]"
        const match = rawLine.match(/(.*?)\[(.*?)\]/);

        let namePart = rawLine;
        let priceCp = 0;
        let hasPrice = false;

        if (match) {
            namePart = match[1].trim();
            const priceReq = match[2].trim();
            priceCp = this.resolvePrice(priceReq);
            hasPrice = true;
        }

        // Check for Description (Separator "|")
        let name = namePart;
        let description = "";
        let gmDescription = "";

        if (namePart.includes("|")) {
            const parts = namePart.split("|").map(p => p.trim());
            name = parts[0];

            if (parts.length === 2) {
                // Name | Description
                description = parts[1];
            } else if (parts.length >= 3) {
                // Name | Description | GM Secret
                description = parts[1];
                gmDescription = parts.slice(2).join(" | "); // Join remaining just in case
            }
        }

        const simplified = this.simplifyPrice(priceCp);

        return {
            name: name,
            description: description,
            gmDescription: gmDescription,
            priceCp: simplified.cp,
            priceString: simplified.string,
            hasPrice: hasPrice
        };
    }

    static resolvePrice(priceStr) {
        const parts = priceStr.split("-");
        if (parts.length === 2) {
            const min = this.parseCurrency(parts[0]);
            const max = this.parseCurrency(parts[1]);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } else {
            return this.parseCurrency(parts[0]);
        }
    }

    static parseCurrency(str) {
        let totalCp = 0;
        // Supports English (pp, gp, sp, cp) and German (pm, gm, sm, km)
        const regex = /(\d+)\s*(pp|gp|sp|cp|pm|gm|sm|km)/gi;
        let match;
        while ((match = regex.exec(str)) !== null) {
            const val = parseInt(match[1]);
            const unit = match[2].toLowerCase();

            if (unit === "pp" || unit === "pm") totalCp += val * 1000;
            if (unit === "gp" || unit === "gm") totalCp += val * 100;
            if (unit === "sp" || unit === "sm") totalCp += val * 10;
            if (unit === "cp" || unit === "km") totalCp += val;
        }
        return totalCp;
    }

    static simplifyPrice(totalCp) {
        if (totalCp === 0) return { cp: 0, string: "Free" };

        const isPf2e = game.system.id === "pf2e";
        const isStandalone = game.system.id === "generic";

        // Standalone Upgrade: Show GP, SP, CP (No PP)
        if (isStandalone) {
            let remain = totalCp;

            // 1 gp = 100 cp. 1 pp = 10 gp = 1000 cp.
            // We want to merge PP into GP.
            const gp = Math.floor(remain / 100);
            remain %= 100;

            const sp = Math.floor(remain / 10);
            const cp = remain % 10;

            // Localization
            const isGerman = game.i18n.lang === "de";
            const tx = { gp: isGerman ? "gm" : "gp", sp: isGerman ? "sm" : "sp", cp: isGerman ? "km" : "cp" };

            let parts = [];
            if (gp > 0) parts.push(`${gp}${tx.gp}`);
            if (sp > 0) parts.push(`${sp}${tx.sp}`);
            if (cp > 0) parts.push(`${cp}${tx.cp}`);

            if (parts.length === 0) return { cp: 0, string: "0" + tx.cp }; // Fallback for 0

            return { cp: totalCp, string: parts.join(" ") };
        }

        let remain = totalCp;
        let pp = 0;
        let gp = 0;

        if (isPf2e) {
            gp = Math.floor(remain / 100);
            remain %= 100;
        } else {
            pp = Math.floor(remain / 1000);
            remain %= 1000;
            gp = Math.floor(remain / 100);
            remain %= 100;
        }

        const sp = Math.floor(remain / 10); remain %= 10;
        const cp = remain;

        // Localize Suffixes
        const isGerman = game.i18n.lang === "de";
        const tx = {
            pp: isGerman ? "pm" : "pp",
            gp: isGerman ? "gm" : "gp",
            sp: isGerman ? "sm" : "sp",
            cp: isGerman ? "km" : "cp"
        };

        let newCp = 0;
        let parts = [];

        if (pp > 0) {
            parts.push(`${pp}${tx.pp}`);
            newCp += pp * 1000;
            if (gp > 0) { parts.push(`${gp}${tx.gp}`); newCp += gp * 100; }
        } else if (gp > 0) {
            parts.push(`${gp}${tx.gp}`);
            newCp += gp * 100;
            if (sp > 0) { parts.push(`${sp}${tx.sp}`); newCp += sp * 10; }
        } else if (sp > 0) {
            parts.push(`${sp}${tx.sp}`);
            newCp += sp * 10;
            if (cp > 0) { parts.push(`${cp}${tx.cp}`); newCp += cp; }
        } else {
            parts.push(`${cp}${tx.cp}`);
            newCp += cp;
        }

        return { cp: newCp, string: parts.join(" ") };
    }

    static formatPrice(cp) {
        return this.simplifyPrice(cp).string;
    }

    static async getOrCreateLootFolder() {
        const folderName = "Phils Generated Loot";
        let folder = game.folders.find(f => f.name === folderName && f.type === "Item");
        if (!folder) {
            folder = await Folder.create({
                name: folderName,
                type: "Item"
            });
        }
        return folder;
    }

    static async createItem(name, priceData, typeContext) {
        const folder = await this.getOrCreateLootFolder();
        
        // 1. Deduplication Check: Reuse Item if it exists in the folder with the exact same name
        const existingItem = folder.contents.find(i => i.name === name);
        if (existingItem) {
            // Optional: We could update the price here if we wanted strict consistency, 
            // but reusing the existing instance is safer to preserve GM edits.
            return existingItem;
        }

        const systemId = game.system.id;

        // Custom Icons from User
        let img = "modules/phils-random-names/assets/treasures.jpg"; // Default

        switch (typeContext) {
            case "food":
                img = "modules/phils-random-names/assets/foods.jpg";
                break;
            case "drink":
                img = "modules/phils-random-names/assets/drinks.jpg";
                break;
            case "trinket":
                img = "modules/phils-random-names/assets/trinkets.jpg";
                break;
            case "gem":
                img = "modules/phils-random-names/assets/gems.jpg";
                break;
            case "plant":
                img = "modules/phils-random-names/assets/plants.jpg";
                break;
            case "book":
                img = "modules/phils-random-names/assets/books.jpg";
                break;
            case "fungus":
                img = "modules/phils-random-names/assets/shrooms.jpg";
                break;
            case "treasure":
                img = "modules/phils-random-names/assets/treasures.jpg";
                break;
            default:
                img = "modules/phils-random-names/assets/treasures.jpg";
                break;
        }

        let itemData = {
            name: name,
            folder: folder.id,
            img: img,
            ownership: { default: 3 },
            system: {}
        };

        if (priceData.description || priceData.gmDescription) {
            itemData.system.description = {};
            if (priceData.description) itemData.system.description.value = `<p>${priceData.description}</p>`;
            if (priceData.gmDescription) itemData.system.description.gm = `<p>${priceData.gmDescription}</p>`;
        }


        let totalCp = priceData.priceCp;
        let pp = 0; let gp = 0; let sp = 0; let cp = 0;

        if (systemId === "pf2e") {
            gp = Math.floor(totalCp / 100); totalCp %= 100;
            sp = Math.floor(totalCp / 10); totalCp %= 10;
            cp = totalCp;
        } else {
            pp = Math.floor(totalCp / 1000); totalCp %= 1000;
            gp = Math.floor(totalCp / 100); totalCp %= 100;
            sp = Math.floor(totalCp / 10); totalCp %= 10;
            cp = totalCp;
        }

        const priceObject = (systemId === "pf2e") ?
            { value: { pp, gp, sp, cp } } :
            { value: priceData.priceCp / 100, denomination: "gp" };

        if (systemId === "pf2e") {
            if (["food", "drink", "plant", "fungus"].includes(typeContext)) {
                itemData.type = "consumable";
                foundry.utils.mergeObject(itemData.system, {
                    category: "other",
                    price: priceObject,
                    uses: { value: 1, max: 1, autoDestroy: true },
                    stackGroup: null
                });
            } else {
                itemData.type = "treasure";
                foundry.utils.mergeObject(itemData.system, {
                    price: priceObject,
                    stackGroup: null,
                    size: "med"
                });
            }
        } else if (systemId === "dnd5e") {
            if (["food", "drink", "plant", "fungus"].includes(typeContext)) {
                itemData.type = "consumable";
                foundry.utils.mergeObject(itemData.system, {
                    type: { value: "food", subtype: "" },
                    price: priceObject,
                    quantity: 1
                });
            } else {
                itemData.type = "loot";
                foundry.utils.mergeObject(itemData.system, {
                    price: priceObject,
                    quantity: 1
                });
            }
        } else {
            itemData.type = "item";
            itemData.system = {
                price: priceData.priceCp / 100,
                description: `Value: ${priceData.priceString}`
            };
        }

        return await Item.create(itemData);
    }

    // --- Reroll Support ---

    static async getSingleItem(sourceName, subType) {
        const journals = this.getJournals();
        const journal = journals.find(j => j.name === sourceName);
        if (!journal) return null;

        const raw = this.getRandomName(journal);
        if (!raw) return null;

        const data = this.processItemWithPrice(raw);
        return {
            text: `<b>${data.name}</b> <span style="float:right; opacity:0.8">${data.priceString}</span>`,
            fullData: data,
            source: sourceName,
            subType: subType
        };
    }

    static async generateCombined(type, config) {
        const items = [];
        const sources = [];

        // Helper to find journal by name (loose match)
        const journals = this.getJournals();
        const findJournalName = (namePart) => {
            const j = journals.find(j => j.name.includes(namePart));
            return j ? j.name : null;
        };

        if (type === "menu") {
            const fName = findJournalName("Fantasy Food");
            const dName = findJournalName("Fantasy Drinks");
            if (fName) sources.push({ name: fName, count: config.count1 ?? 10, label: game.i18n.localize("PRN.Generator.FoodItems"), subType: "menu", typeContext: "food" });
            if (dName) sources.push({ name: dName, count: config.count2 ?? 5, label: game.i18n.localize("PRN.Generator.Drinks"), subType: "menu", typeContext: "drink" });
        } else if (type === "loot") {
            const tName = findJournalName("Fantasy Trinkets");
            const gName = findJournalName("Fantasy Gemstones");
            const trName = findJournalName("Fantasy Treasures");
            if (tName) sources.push({ name: tName, count: config.count1 ?? 5, label: game.i18n.localize("PRN.Generator.Trinkets"), subType: "loot", typeContext: "trinket" });
            if (gName) sources.push({ name: gName, count: config.count2 ?? 2, label: game.i18n.localize("PRN.Generator.Gems"), subType: "loot", typeContext: "gem" });
            if (trName) sources.push({ name: trName, count: config.count3 ?? 1, label: game.i18n.localize("PRN.Generator.Treasures"), subType: "loot", typeContext: "treasure" });
        }

        for (const source of sources) {
            const journal = journals.find(j => j.name === source.name);
            if (!journal) continue;

            const allNames = this.getNames(journal);
            const pool = [...allNames];

            for (let i = 0; i < source.count; i++) {
                if (pool.length === 0) break;
                const idx = Math.floor(Math.random() * pool.length);
                const raw = pool[idx];
                pool.splice(idx, 1);

                const data = this.processItemWithPrice(raw);
                items.push({
                    text: `<b>${data.name}</b> <span style="float:right; opacity:0.8">${data.priceString}</span>`,
                    label: source.label,
                    source: source.name,
                    subType: source.subType,
                    typeContext: source.typeContext,
                    fullData: data
                });
            }
        }

        return { type, items };
    }

    static async postToChat(type, items) {
        // dynamic Title
        let title = game.i18n.localize("PRN.Preview.Title");
        if (type === "menu") title = game.i18n.localize("PRN.Generator.TavernMenu");
        else if (type === "loot") title = game.i18n.localize("PRN.Generator.TreasurePouch");
        else if (type === "custom") title = game.i18n.localize("PRN.Generator.Custom");
        else {
             // Try to infer from first item label if possible, or just "Result"
             if(items.length > 0 && items[0].subType === "complex") title = game.i18n.localize("PRN.Generator.RandomName");
             else if (items.length > 0 && items[0].label) title = items[0].label;
        }

        let outputHtml = `<h3>${title}</h3><hr>`;

        // Group by label (Food, Drinks, etc.)
        // Map<Label, Item[]>
        const grouped = new Map();
        for (const item of items) {
            const label = item.label || "Items";
            if (!grouped.has(label)) grouped.set(label, []);
            grouped.get(label).push(item);
        }

        // Iterate Groups
        for (const [label, groupItems] of grouped) {
            // Only show label if it's not "Items" or if we have multiple groups
            if(label !== "Items" || grouped.size > 1) {
                outputHtml += `<h3>${label}</h3>`;
            }
            outputHtml += `<ul style="list-style:none; padding:0; margin-bottom: 10px;">`;

            for (const item of groupItems) {
                let displayHtml = "";

                if (game.user.isGM && item.fullData && (item.realItemUuid || ["loot", "menu", "simple"].includes(item.subType))) {
                     // Prefer real item uuid if we have it created
                     if(item.realItemUuid) {
                        displayHtml = `<div style="display: flex; align-items: center; width: 100%;">
                                <div style="flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; padding-right: 5px;">
                                    @UUID[${item.realItemUuid}]{${item.fullData.name}}
                                </div>
                                <div style="flex: 0 0 auto; margin-left: auto; text-align: right; white-space: nowrap; opacity: 0.8;">
                                    ${item.fullData.priceString}
                                </div>
                            </div>`;
                     } else {
                        // Create it specifically now if it wasn't valid before? 
                        // Actually generateSimple/generateCombined tries to create it.
                        // If it failed, falling back to text is fine.
                        
                        // But wait, if text was passed in item.text, we might want to use that.
                        // Let's rely on item.text as the display source since it might contain price HTML.
                        displayHtml = item.text;
                     }
                } else {
                    // Fallback purely text based
                   displayHtml = item.text;
                }

                outputHtml += `<li style="margin-bottom: 4px; border-bottom: none; padding-bottom:0;">${displayHtml}</li>`;
            }
            outputHtml += `</ul>`;
        }
        
        // Use ChatMessage.create
        ChatMessage.create({
            content: outputHtml,
            speaker: { alias: "Generator" }
        });
    }

    // --- Content Creation ---

    static getFolder() {
        // Root Folder
        return game.journal.folders.find(f => f.name === "Phils Random Names" && !f.folder); // Ensure it's a root folder
    }

    static getJournals() {
        const root = this.getFolder();
        if (!root) return [];

        // Recursive helper to get all folder IDs
        const getSubfolderIds = (folder) => {
            let ids = [folder.id];
            // folder.children is array of {folder: Folder, ...} in V10+
            const children = folder.children || []; 
            for (const child of children) {
                if (child.folder) ids = ids.concat(getSubfolderIds(child.folder));
            }
            return ids;
        };

        const allFolderIds = new Set(getSubfolderIds(root));
        return game.journal.filter(j => j.folder && allFolderIds.has(j.folder.id));
    }

    // ... (rest of methods like getStructure, createItem, etc. - unchanged until createOneClickContent)
    // NOTE: For brevity in replace_file_content, assuming intermediate functions are preserved if I target correctly. Always be careful.
    // Actually, replace_file_content replaces a block. I need to be careful not to delete getStructure etc.
    // I should probably target specific blocks.

    // Let's override getJournals first, then createOneClickContent separately?
    // No, I'll do a large replacement if the context allows, or targeted.
    // I'll target getFolder and getJournals first.
    
    // ... wait, I will split this into two calls for safety.
    
    static async createOneClickContent() {
        let rootFolder = this.getFolder();
        if (!rootFolder) {
            rootFolder = await Folder.create({
                name: "Phils Random Names",
                type: "JournalEntry"
            });
        }

        // Create/Get "Core Lists" subfolder
        let coreFolder = game.journal.folders.find(f => f.name === "Core Lists" && f.folder?.id === rootFolder.id);
        if (!coreFolder) {
            coreFolder = await Folder.create({
                name: "Core Lists",
                type: "JournalEntry",
                folder: rootFolder.id,
                sorting: "m"
            });
        }

        // Localization Suffixes
        const isGerman = game.i18n.lang === "de";
        const suffixMale = isGerman ? "Vornamen Männlich" : "First Names Male";
        const suffixFemale = isGerman ? "Vornamen Weiblich" : "First Names Female";
        const suffixSurname = isGerman ? "Nachnamen" : "Surnames";

        // Example Files to Load
        let examples = [];
        try {
            const result = await FilePicker.browse("data", "modules/phils-random-names/examples");
            examples = result.files.filter(file => file.endsWith(".md")).map(file => file.split("/").pop());
        } catch (err) {
            console.warn("Phils Random Names | Could not browse examples via FilePicker. Falling back to default list.", err);
            examples = [
                "Absalom_Names.md", "Dwarf.md", "Elf.md",
                "Fantasy_Books.md", "Fantasy_Books_De.md",
                "Fantasy_Drinks.md", "Fantasy_Drinks_De.md",
                "Fantasy_Food.md", "Fantasy_Food_De.md",
                "Fantasy_Fungi.md", "Fantasy_Fungi_De.md",
                "Fantasy_Gemstones.md", "Fantasy_Gemstones_De.md",
                "Fantasy_Plants.md", "Fantasy_Plants_De.md",
                "Fantasy_Treasures.md", "Fantasy_Treasures_De.md",
                "Fantasy_Trinkets.md", "Fantasy_Trinkets_De.md",
                "Gnome.md", "Goblin.md", "Halfling.md", "Human.md", 
                "Leshy.md", "Mwangi_Names.md", "Orc.md",
                "Rumors.md", "Rumors_De.md", 
                "Shops.md", "Shops_De.md"
            ];
        }

        // Group files by Base Name
        const fileMap = new Map();
        for (const filename of examples) {
            let baseKey = filename.replace(".md", "");
            let lang = "en";
            if (baseKey.toLowerCase().endsWith("_de")) {
                baseKey = baseKey.substring(0, baseKey.length - 3);
                lang = "de";
            }
            if (!fileMap.has(baseKey)) fileMap.set(baseKey, {});
            fileMap.get(baseKey)[lang] = filename;
        }

        const filesToLoad = [];
        for (const [baseKey, variants] of fileMap) {
            if (isGerman && variants.de) {
                filesToLoad.push({ filename: variants.de, displayBase: baseKey });
            } else if (variants.en) {
                filesToLoad.push({ filename: variants.en, displayBase: baseKey });
            }
        }

        for (const entry of filesToLoad) {
            const filename = entry.filename;
            try {
                const response = await fetch(`modules/phils-random-names/examples/${filename}`);
                if (!response.ok) continue;
                const text = await response.text();

                const cleanName = decodeURIComponent(entry.displayBase);
                let baseName = cleanName.replace(/_/g, " ");
                baseName = baseName.charAt(0).toUpperCase() + baseName.slice(1);

                const lines = text.split("\n").map(l => l.trim()).filter(l => l);
                const data = { male: [], female: [], surnames: [], list: [] };
                let currentSection = "list";

                for (const line of lines) {
                    if (line.match(/^Male:?$/i)) { currentSection = "male"; continue; }
                    if (line.match(/^Female:?$/i)) { currentSection = "female"; continue; }
                    if (line.match(/^Surnames?:?$/i)) { currentSection = "surnames"; continue; }
                    if (line.match(/^List:?$/i)) { currentSection = "list"; continue; }
                    data[currentSection].push(line);
                }

                // Helper to create or Migrate
                const migrateOrCreate = async (name, content) => {
                     await this.createJournal(coreFolder, name, content, rootFolder);
                };

                if (data.male.length > 0 || data.female.length > 0 || data.surnames.length > 0) {
                    if (data.male.length) await migrateOrCreate(`${baseName} ${suffixMale}`, data.male);
                    if (data.female.length) await migrateOrCreate(`${baseName} ${suffixFemale}`, data.female);
                    if (data.surnames.length) await migrateOrCreate(`${baseName} ${suffixSurname}`, data.surnames);
                } else if (data.list.length > 0) {
                    await migrateOrCreate(baseName, data.list);
                }

            } catch (e) {
                console.error("Phils Random Names | Error loading example:", filename, e);
            }
        }
    }

    static async createJournal(targetFolder, name, contentList, checkSourceFolder = null) {
        const html = contentList.map(n => `<p>${n}</p>`).join("");
        
        // 1. Check Target Folder
        let existing = targetFolder.contents.find(j => j.name === name);
        
        // 2. Check Source Folder (Migration)
        if (!existing && checkSourceFolder) {
            const legacy = checkSourceFolder.contents.find(j => j.name === name);
            if (legacy) {
                // Move it!
                await legacy.update({ folder: targetFolder.id });
                existing = legacy;
                console.log(`Phils Random Names | Migrated ${name} to Core Lists.`);
            }
        }

        if (existing) {
            const page = existing.pages.contents[0];
            if (page) {
                await page.update({ "text.content": html });
                console.log(`Phils Random Names | Updated ${name}`);
            }
            return;
        }

        await JournalEntry.create({
            name: name,
            folder: targetFolder.id,
            pages: [{ name: "List", type: "text", text: { content: html, format: 1 } }]
        });
    }

    // Keep createComplexTemplate and createSimpleTemplate in Root (User created)
    static async createComplexTemplate(baseName) {
        let folder = this.getFolder();
        if (!folder) {
            folder = await Folder.create({ name: "Phils Random Names", type: "JournalEntry" });
        }
         // ... (localized suffixes) ...
         // Note: I need to redefine suffixes here as they are local scope
        const isGerman = game.i18n.lang === "de";
        const suffixMale = isGerman ? "Vornamen Männlich" : "First Names Male";
        const suffixFemale = isGerman ? "Vornamen Weiblich" : "First Names Female";
        const suffixSurname = isGerman ? "Nachnamen" : "Surnames";

        await this.createJournal(folder, `${baseName} ${suffixMale}`, [""]);
        await this.createJournal(folder, `${baseName} ${suffixFemale}`, [""]);
        await this.createJournal(folder, `${baseName} ${suffixSurname}`, [""]);
    }
    
    static async createSimpleTemplate(baseName) {
         let folder = this.getFolder();
         if (!folder) await Folder.create({ name: "Phils Random Names", type: "JournalEntry" });
         await this.createJournal(folder, baseName, [""]);
    }
}
