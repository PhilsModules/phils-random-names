<div align="center">

# Phil's Random Names

![Foundry v12 Compatible](https://img.shields.io/badge/Foundry-v12-green)
![Foundry v13 Compatible](https://img.shields.io/badge/Foundry-v13-brightgreen)
![System](https://img.shields.io/badge/System-PF2e-blue)
![License](https://img.shields.io/badge/License-GPLv3-blue)
[![Version](https://img.shields.io/badge/version-v1.6.0-blue)](https://github.com/PhilsModules/phils-pf2e-ai-translator/releases)
[![Patreon](https://img.shields.io/badge/SUPPORT-Patreon-ff424d?logo=patreon)](https://www.patreon.com/PhilsModules)

<br>

**Ein einfaches Modul, um zufällige Namen aus Journalen zu ziehen.**
<br>
*A simple module to pull random names from journals.*

</div>

<div align="center">
<br>
<img src="https://github.com/PhilsModules/phils-random-names/blob/main/cover.png" alt="Cover" width="800">

</div>
<br>

> [!TIP]
> ### 💡 Support
> Dieses Modul ist kostenlos und Open Source. Wenn es dir gefällt, freue ich mich über Feedback!


# <img src="https://flagcdn.com/48x36/de.png" width="28" height="21" alt="DE"> Deutsche Anleitung

**Phil's Random Names** ist mehr als nur ein Namensgenerator. Es ist eine komplette Toolbox für SLs, um spontan Inhalte zu erstellen – von NPCs über Snacks bis hin zu Schätzen. Alles basierend auf einfachen Text-Journalen, die du selbst anpassen kannst!

## ✨ Hauptfunktionen

### 1. 🧙‍♂️ NPC Generator
Erstelle per Klick passende Namen für deine Welt.
*   **Völker:** Menschen (Mwangi, Inner Sea), Elfen, Zwerge, Gnome, Goblins, Halblinge, Orks, Leshys.
*   **Optionen:** Wähle Geschlecht (Männlich/Weiblich/Zufall) und ob ein Nachname generiert werden soll.
*   **Lore-Akkurat:** Die Namenslisten wurden sorgfältig kuratiert, um zur Pathfinder-Lore zu passen (z.B. Clannamen für Zwerge, obsessive Nachnamen für Gnome).

### 2. 🎒 Echte Item-Generierung
Aus den Listen "Food", "Drinks", "Trinkets", "Gemstones" und "Plants" werden nicht nur Namen gezogen. 
*   **Drag & Drop:** Das Modul erstellt **echte Foundry Items** (Consumables oder Loot), die du direkt in Charakterbögen ziehen kannst.
*   **System Support:**
    *   **Pathfinder 2e:** Erstellt `Treasure` (Edelsteine, Plunder) oder `Consumable` (Essen, Tranken, Pflanzen) mit korrekter Preisaufteilung (GP/SP/CP).
    *   **D&D 5e:** Erstellt `Loot` oder `Consumable` Items.
    *   **Andere Systeme:** Erstellt generische Items.

### 3. 💰 Realistische Preise & Beschreibungen (v1.5.0)
Alle Gegenstände kommen jetzt mit immersiven Beschreibungen und Preisen!
*   **Flavor-Text:** *"Banshee's Bell | A pale flower that screams when picked."*
*   **Smart Pricing:** Preise basieren auf einer realistischen Ökonomie ("Bier-Index"). Im Chat werden Preise lesbar dargestellt (z.B. `1gp 5sp` statt `150cp`).

### 4. 🎲 Einfache Bedienung
*   **Clean UI:** Ein eigenes Fenster für alle Generatoren, erreichbar über das Würfel-Icon in der Token-Leiste.
*   **Anpassbar:** Du willst eigene Listen? Erstelle einfach ein neues Journal im Ordner "Phils Random Names". 
    *   **Tipp:** Wenn du Preise in Klammern dahinter schreibst `[10gp]`, erstellt das Modul daraus automatisch Items!
    *   **Pro-Tipp:** Wenn der Name der Liste "Food", "Drink" oder "Plant" enthält (z.B. "Magische Pilze (Plants)"), werden die Items als *Consumables* erstellt!

## 📚 Enthaltene Daten (13.000+ Einträge)


*   **NPC Namen (Kombinationen):**
    *   🧝‍♀️ **Elfen:** ~2.000.000
    *   🛡️ **Menschen (Inner Sea):** ~1.300.000
    *   🌴 **Menschen (Mwangi):** ~1.000.000
    *   👹 **Goblins:** ~320.000
    *   🦶 **Halblinge:** ~280.000
    *   🌆 **Menschen (Absalom):** ~25.000
    *   ⚙️ **Gnome:** ~120.000
    *   ⛏️ **Zwerge:** ~85.000
    *   🟢 **Orks:** ~45.000
    *   🌱 **Leshys:** ~28.000

*   **Thematische Listen (Mit Preisen & Beschreibung):**
    *   🍺 **Fantasy Drinks:** ~430 Getränke
    *   � **Fantasy Food:** ~560 Gerichte
    *   🗝️ **Fantasy Trinkets:** ~540 Plunder & kleine Schätze
    *   💎 **Fantasy Gemstones:** ~390 Edelsteine
    *   🌿 **Fantasy Plants:** ~500 magische & normale Pflanzen
    *   🏪 **Shops:** ~500 Geschäftsnamen
*   **Gerüchte:** 500+ Plot-Hooks für die Taverne.

---

## 📦 Installation
1.  In Foundry VTT auf **Add-on Modules** -> **Install Module**.
2.  Manifest URL eingeben: `https://github.com/PhilsModules/phils-random-names/releases/latest/download/module.json`
3.  Installieren & Aktivieren.

## 📖 Erste Schritte
1.  Öffne das Modul über das **Makro "Phil's Random Names"** (im Makro-Verzeichnis).
2.  Klicke einmalig auf **"Ordner & Beispiele erstellen"**, um die Datenbank zu laden.
3.  Viel Spaß beim Würfeln!

---

# <img src="https://flagcdn.com/48x36/gb.png" width="28" height="21" alt="EN"> English Description

**Phil's Random Names** is more than just a name generator. It's a complete toolbox for GMs to improvise content on the fly – from NPCs to snacks to treasures. All based on simple text journals that you can edit yourself!

## ✨ Key Features

### 1. 🧙‍♂️ NPC Generator
Create fitting names for your world with a click.
*   **Ancestries:** Humans (Mwangi, Inner Sea), Elves, Dwarves, Gnomes, Goblins, Halflings, Orcs, Leshys.
*   **Options:** Select Gender (Male/Female/Any) and optional Surnames.
*   **Lore-Accurate:** Name lists are curated to fit Pathfinder lore (e.g. Clan names for Dwarves).

### 2. 🎒 Real Item Generation
Generating from "Food", "Drinks", "Trinkets", "Gemstones", and "Plants" lists does more than just post text.
*   **Drag & Drop:** The module creates **real Foundry Items** (Consumables or Loot) that can be dragged directly onto character sheets.
*   **System Support:**
    *   **Pathfinder 2e:** Creates `Treasure` or `Consumable` items with correct price breakdown (GP/SP/CP).
    *   **D&D 5e:** Creates `Loot` or `Consumable` items.
    *   **Generic:** Creates standard Items with description.

### 3. 💰 Realistic Prices & Descriptions (v1.5.0)
All items now come with immersive flavor text and realistic prices!
*   **Flavor:** *"Banshee's Bell | A pale flower that screams when picked."*
*   **Smart Pricing:** Prices are based on a realistic economy ("Beer Index"). Automation simplifies price display in chat (e.g. `1gp 5sp`).

### 4. 🎲 Easy to Use
*   **Clean UI:** A dedicated window for all generators, accessible via the Dice Icon in the Token controls.
*   **Customizable:** Want your own lists? Just create a new Journal in the "Phils Random Names" folder.
    *   **Tip:** If you add prices in brackets `[10gp]`, the module will automatically turn them into items!
    *   **Pro-Tip:** If the list name contains "Food", "Drink", or "Plant" (e.g. "Magic Mushrooms (Plants)"), items will be created as *Consumables*!

## 📚 Included Content (13,000+ Entries)


*   **NPC Names (Combinations):**
    *   🧝‍♀️ **Elves:** ~2,000,000
    *   🛡️ **Humans (Inner Sea):** ~1,300,000
    *   🌴 **Humans (Mwangi):** ~1,000,000
    *   👹 **Goblins:** ~320,000
    *   🦶 **Halflings:** ~280,000
    *   🌆 **Humans (Absalom):** ~25,000
    *   ⚙️ **Gnomes:** ~120,000
    *   ⛏️ **Dwarves:** ~85,000
    *   🟢 **Orcs:** ~45,000
    *   🌱 **Leshys:** ~28,000

*   **Thematic Lists (With Prices & Descriptions):**
    *   🍺 **Fantasy Drinks:** ~430 items
    *   🍖 **Fantasy Food:** ~560 items
    *   🗝️ **Fantasy Trinkets:** ~540 items
    *   💎 **Fantasy Gemstones:** ~390 items
    *   🌿 **Fantasy Plants:** ~500 magical & mundane plants
    *   🏪 **Shops:** ~500 shop names
*   **Rumors:** 500+ plot hooks.

## ⚖️ License
**Phil's Random Names** is licensed under the [GPL-3.0 License](LICENSE).

<div align="center">
    <h2>❤️ Support the Development</h2>
    <p>If you enjoy this module and want to support open-source development for Foundry VTT, check out my Patreon!</p>
    <p>Gefällt dir das Modul? Unterstütze die Weiterentwicklung auf Patreon!</p>
    <a href="https://www.patreon.com/PhilsModules">
        <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron" width="200" />
    </a>
    <br><br>
    <p><i>Made with ❤️ for the Foundry VTT Community</i></p>
</div>






