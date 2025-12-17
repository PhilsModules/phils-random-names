export class RandomNameAPI {
    static getFolder() {
        return game.journal.folders.find(f => f.name === "Phils Random Names");
    }

    static getJournals() {
        const folder = this.getFolder();
        if (!folder) return [];
        return folder.contents;
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

    // New: Smart Structure Parsing
    static getStructure() {
        const journals = this.getJournals();
        const structure = new Map();

        // Regex to identify parts: "Category Name Suffix"
        // Suffixes: 
        // DE: "Vornamen Männlich", "Vornamen Weiblich", "Nachnamen"
        // EN: "First Names Male", "First Names Female", "Surnames"
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
                // Use Journal ID as key to avoid collision if possible, or just Name
                structure.set(journal.name, { id: journal.name, name: journal.name, isComplex: false, journal: journal });
            }
        }

        return Array.from(structure.values()).sort((a, b) => a.name.localeCompare(b.name));
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
        // Fallback: if specific gender missing, try the other? Or just empty? 
        // Let's try to get a name if the journal exists.
        if (firstNameJournal) {
            firstName = this.getRandomName(firstNameJournal);
        }

        // Get Surname
        if (withSurname && categoryData.parts.surnames) {
            surname = this.getRandomName(categoryData.parts.surnames);
        }

        // Combine
        if (firstName && surname) return `${firstName} ${surname}`;
        if (firstName) return firstName;
        if (surname) return `(Only Surname) ${surname}`;
        return null; // Failed to gen
    }

    // --- New Generator Logic (Menu / Loot) ---

    /**
     * Parsing Price Ranges from text
     * Formats: "Name [Price]" or "Name | Description [Price]"
     * Returns { name: "Item", description: "...", price: 123 (in cp), priceString: "1gp 2sp" }
     */
    static processItemWithPrice(rawLine) {
        // Formats: "Name [Price]" or "Name | Description [Price]"
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

        if (namePart.includes("|")) {
            const parts = namePart.split("|");
            name = parts[0].trim();
            description = parts.slice(1).join("|").trim();
        }

        // Simplify Price (Top 2 Units)
        const simplified = this.simplifyPrice(priceCp);

        return {
            name: name,
            description: description,
            priceCp: simplified.cp,
            priceString: simplified.string,
            hasPrice: hasPrice
        };
    }

    static resolvePrice(priceStr) {
        // Check for range "X-Y"
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
        // Parse "1gp 5sp" etc.
        let totalCp = 0;
        const regex = /(\d+)\s*(pp|gp|sp|cp)/g;
        let match;
        while ((match = regex.exec(str)) !== null) {
            const val = parseInt(match[1]);
            const unit = match[2];
            if (unit === "pp") totalCp += val * 1000;
            if (unit === "gp") totalCp += val * 100;
            if (unit === "sp") totalCp += val * 10;
            if (unit === "cp") totalCp += val;
        }
        return totalCp;
    }

    static simplifyPrice(totalCp) {
        if (totalCp === 0) return { cp: 0, string: "Free" };

        const isPf2e = game.system.id === "pf2e";

        let remain = totalCp;
        let pp = 0;
        let gp = 0;

        // Custom Logic for PF2e: Avoid Platinum, use higher Gold values
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

        let newCp = 0;
        let parts = [];

        // Logic: Keep top 2 non-zero units
        // Priority: PP > GP > SP > CP

        if (pp > 0) {
            parts.push(`${pp}pp`);
            newCp += pp * 1000;

            if (gp > 0) {
                parts.push(`${gp}gp`);
                newCp += gp * 100;
            }
        } else if (gp > 0) {
            parts.push(`${gp}gp`);
            newCp += gp * 100;

            if (sp > 0) {
                parts.push(`${sp}sp`);
                newCp += sp * 10;
            }
        } else if (sp > 0) {
            parts.push(`${sp}sp`);
            newCp += sp * 10;

            if (cp > 0) {
                parts.push(`${cp}cp`);
                newCp += cp;
            }
        } else {
            parts.push(`${cp}cp`);
            newCp += cp;
        }

        return { cp: newCp, string: parts.join(" ") };
    }

    static formatPrice(cp) {
        // Legacy wrapper if needed, but we use simplifyPrice now upstream
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
        const systemId = game.system.id;

        // Default image fallback
        let img = "icons/svg/item-bag.svg";

        let itemData = {
            name: name,
            folder: folder.id,
            img: img,
            system: {}
        };

        // Assign Description if present
        if (priceData.description) {
            if (systemId === "pf2e") {
                itemData.system.description = { value: `<p>${priceData.description}</p>` };
            } else if (systemId === "dnd5e") {
                itemData.system.description = { value: `<p>${priceData.description}</p>` };
            }
        }

        // Price breakdown
        let totalCp = priceData.priceCp;
        let pp = 0;
        let gp = 0;
        let sp = 0;
        let cp = 0;

        if (systemId === "pf2e") {
            // PF2e: Aggregate into GP, ignore PP
            gp = Math.floor(totalCp / 100); totalCp %= 100;
            sp = Math.floor(totalCp / 10); totalCp %= 10;
            cp = totalCp;
            // pp remains 0
        } else {
            // Standard/D&D5e: Use PP if applicable
            pp = Math.floor(totalCp / 1000); totalCp %= 1000;
            gp = Math.floor(totalCp / 100); totalCp %= 100;
            sp = Math.floor(totalCp / 10); totalCp %= 10;
            cp = totalCp;
        }

        const priceObject = (systemId === "pf2e") ?
            { value: { pp, gp, sp, cp } } :
            { value: priceData.priceCp / 100, denomination: "gp" };

        if (systemId === "pf2e") {
            // PF2e Logic
            if (typeContext === "food" || typeContext === "drink" || typeContext === "plant") {
                itemData.type = "consumable";
                itemData.img = "systems/pf2e/icons/default-icons/consumable.svg";
                // Merge into existing system object (description might be there)
                foundry.utils.mergeObject(itemData.system, {
                    category: "other",
                    price: priceObject,
                    uses: { value: 1, max: 1, autoDestroy: true },
                    stackGroup: null
                });
            } else {
                // Default to Treasure for Trinkets/Gems
                itemData.type = "treasure";
                itemData.img = "systems/pf2e/icons/default-icons/treasure.svg";
                foundry.utils.mergeObject(itemData.system, {
                    price: priceObject,
                    stackGroup: null,
                    size: "med"
                });
            }
        } else if (systemId === "dnd5e") {
            // D&D5e Logic
            if (typeContext === "food" || typeContext === "drink" || typeContext === "plant") {
                itemData.type = "consumable";
                itemData.img = "systems/dnd5e/icons/svg/items/consumable.svg";
                foundry.utils.mergeObject(itemData.system, {
                    type: { value: "food", subtype: "" },
                    price: priceObject,
                    quantity: 1
                });
            } else {
                // Default to Loot
                itemData.type = "loot";
                itemData.img = "systems/dnd5e/icons/svg/items/loot.svg";
                foundry.utils.mergeObject(itemData.system, {
                    price: priceObject,
                    quantity: 1
                });
            }
        } else {
            // Generic Fallback
            itemData.type = "item";
            itemData.system = {
                price: priceData.priceCp / 100,
                description: `Value: ${priceData.priceString}`
            };
        }

        return await Item.create(itemData);
    }

    static async generateCombined(type, config) {
        // Identify source categories
        const sources = [];

        // Helper to find journal by name (loose match)
        const journals = this.getJournals();
        const findJournal = (namePart) => journals.find(j => j.name.includes(namePart));

        if (type === "menu") {
            const foods = findJournal("Fantasy Food");
            const drinks = findJournal("Fantasy Drinks");
            if (foods) sources.push({ journal: foods, count: config.count1 || 10, label: "Food", type: "food" });
            if (drinks) sources.push({ journal: drinks, count: config.count2 || 5, label: "Drinks", type: "drink" });
        } else if (type === "loot") {
            const trinkets = findJournal("Fantasy Trinkets");
            const gems = findJournal("Fantasy Gemstones");
            if (trinkets) sources.push({ journal: trinkets, count: config.count1 || 5, label: "Trinkets", type: "trinket" });
            if (gems) sources.push({ journal: gems, count: config.count2 || 2, label: "Gemstones", type: "gem" });
        }

        let outputHtml = `<h3>${type === "menu" ? "Tavern Menu" : "Treasure Pouch"}</h3><hr>`;

        for (const source of sources) {
            const allItems = this.getNames(source.journal);
            if (!allItems.length) continue;

            const selected = [];
            // Random pick unique
            const pool = [...allItems];
            for (let i = 0; i < source.count; i++) {
                if (pool.length === 0) break;
                const idx = Math.floor(Math.random() * pool.length);
                selected.push(pool[idx]);
                pool.splice(idx, 1);
            }

            if (selected.length > 0) {
                outputHtml += `<h4>${source.label}</h4><ul>`;
                for (const raw of selected) {
                    const data = this.processItemWithPrice(raw);

                    // Create Real Item
                    let displayHtml = `<b>${data.name}</b>`;
                    if (game.user.isGM) {
                        try {
                            const item = await this.createItem(data.name, data, source.type);
                            if (item) {
                                // Use Content Link
                                displayHtml = `@UUID[${item.uuid}]{${data.name}}`;
                            }
                        } catch (err) {
                            console.error("Phils Random Names | Failed to create item:", err);
                        }
                    }

                    // Flex layout for list item to handle long names
                    outputHtml += `<li style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px;">
                        <span style="flex: 1; margin-right: 5px;">${displayHtml}</span>
                        <span style="white-space: nowrap; opacity:0.8; margin-top: 1px;">${data.priceString}</span>
                    </li>`;
                }
                outputHtml += `</ul>`;
            }
        }

        // Create Chat Message
        ChatMessage.create({
            content: outputHtml,
            speaker: { alias: "Generator" }
        });
    }

    static async createOneClickContent() {
        let folder = this.getFolder();
        if (!folder) {
            folder = await Folder.create({
                name: "Phils Random Names",
                type: "JournalEntry"
            });
        }

        // Localization Suffixes
        const isGerman = game.i18n.lang === "de";
        const suffixMale = isGerman ? "Vornamen Männlich" : "First Names Male";
        const suffixFemale = isGerman ? "Vornamen Weiblich" : "First Names Female";
        const suffixSurname = isGerman ? "Nachnamen" : "Surnames";

        // Example Files to Load
        // Dynamic Example Loading using FilePicker
        let examples = [];
        try {
            // Attempt to browse the module directory
            const result = await FilePicker.browse("data", "modules/phils-random-names/examples");
            examples = result.files
                .filter(file => file.endsWith(".md"))
                .map(file => file.split("/").pop()); // Extract filename
        } catch (err) {
            console.warn("Phils Random Names | Could not browse examples via FilePicker. Falling back to default list.", err);
            // Fallback if FilePicker fails (e.g. strict permissions)
            examples = ["Mwangi_Commoner.md"];
        }

        for (const filename of examples) {
            try {
                // Fetch from module directory
                const response = await fetch(`modules/phils-random-names/examples/${filename}`);
                if (!response.ok) {
                    // console.warn(`Phils Random Names | Could not load ${filename}`);
                    continue;
                }
                const text = await response.text();

                // Determine Base Name: "Mwangi_Commoner.md" -> "Mwangi Commoner"
                // Remove encoded spaces if needed, generally filenames are clean
                const cleanName = decodeURIComponent(filename);
                let baseName = cleanName.replace(/_/g, " ").replace(".md", "");

                // Auto-Capitalize first letter (e.g. "elf" -> "Elf")
                baseName = baseName.charAt(0).toUpperCase() + baseName.slice(1);

                // Parse Data
                const lines = text.split("\n").map(l => l.trim()).filter(l => l);
                const data = { male: [], female: [], surnames: [], list: [] };
                let currentSection = "list";

                for (const line of lines) {
                    // Detect Headers (flexible matching)
                    if (line.match(/^Male:?$/i)) { currentSection = "male"; continue; }
                    if (line.match(/^Female:?$/i)) { currentSection = "female"; continue; }
                    if (line.match(/^Surnames?:?$/i)) { currentSection = "surnames"; continue; }
                    if (line.match(/^List:?$/i)) { currentSection = "list"; continue; }

                    data[currentSection].push(line);
                }

                // Check Category Type & Create
                if (data.male.length > 0 || data.female.length > 0 || data.surnames.length > 0) {
                    // Complex Category
                    if (data.male.length) await this.createJournal(folder, `${baseName} ${suffixMale}`, data.male);
                    if (data.female.length) await this.createJournal(folder, `${baseName} ${suffixFemale}`, data.female);
                    if (data.surnames.length) await this.createJournal(folder, `${baseName} ${suffixSurname}`, data.surnames);
                } else if (data.list.length > 0) {
                    // Simple Category
                    await this.createJournal(folder, baseName, data.list);
                }

            } catch (e) {
                console.error("Phils Random Names | Error loading example:", filename, e);
            }
        }
    }

    static async createJournal(folder, name, contentList) {
        const html = contentList.map(n => `<p>${n}</p>`).join("");

        const existing = folder.contents.find(j => j.name === name);
        if (existing) {
            // Update existing
            const page = existing.pages.contents[0];
            if (page) {
                await page.update({ "text.content": html });
                console.log(`Phils Random Names | Updated ${name}`);
            }
            return;
        }

        await JournalEntry.create({
            name: name,
            folder: folder.id,
            pages: [{ name: "List", type: "text", text: { content: html, format: 1 } }]
        });
    }
    static async createComplexTemplate(baseName) {
        let folder = this.getFolder();
        if (!folder) {
            folder = await Folder.create({ name: "Phils Random Names", type: "JournalEntry" });
        }

        const isGerman = game.i18n.lang === "de";
        const suffixMale = isGerman ? "Vornamen Männlich" : "First Names Male";
        const suffixFemale = isGerman ? "Vornamen Weiblich" : "First Names Female";
        const suffixSurname = isGerman ? "Nachnamen" : "Surnames";

        // Create 3 Empty Journals
        await this.createJournal(folder, `${baseName} ${suffixMale}`, [""]);
        await this.createJournal(folder, `${baseName} ${suffixFemale}`, [""]);
        await this.createJournal(folder, `${baseName} ${suffixSurname}`, [""]);
    }

    static async createSimpleTemplate(baseName) {
        let folder = this.getFolder();
        if (!folder) {
            folder = await Folder.create({ name: "Phils Random Names", type: "JournalEntry" });
        }

        // Create 1 Empty Journal
        await this.createJournal(folder, baseName, [""]);
    }
}
