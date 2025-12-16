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
        const examples = ["Mwangi_Commoner.md"];

        for (const filename of examples) {
            try {
                // Fetch from module directory
                const response = await fetch(`modules/phils-random-names/examples/${filename}`);
                if (!response.ok) {
                    console.warn(`Phils Random Names | Could not load ${filename}`);
                    continue;
                }
                const text = await response.text();

                // Determine Base Name: "Mwangi_Commoner.md" -> "Mwangi Commoner"
                const baseName = filename.replace(/_/g, " ").replace(".md", "");

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
