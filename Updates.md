# Update Notes

## Version 1.6.0 - The Reroll Update 🎲
### Features
*   **Preview & Reroll:** Kicking "Generate" for Food, Drinks, and Loot now opens a **Preview Window** instead of spamming the chat immediately.
    *   **Reroll:** You can reroll individual items in the list until you are satisfied.
    *   **Post:** Only post the final result to the chat when you are ready.
*   **Menu & Loot:** The module now correctly creates real, clickable items for **Food** and **Drinks** in the chat (previously only worked for Loot).
*   **Visuals:**
    *   **Custom Icons:** Chat output now uses beautiful, custom hand-picked icons for Food, Drinks, Trinkets, and Gems instead of generic placeholders.
    *   **Clean Layout:** The chat card layout has been improved. Items are grouped by category (Food/Drink) and prices are cleanly aligned to the right.

## Version 1.5.0 - The Flavor Text Update 📜

### Features
* **Creative Descriptions:** The lists for **Drinks**, **Food**, **Trinkets**, **Gemstones**, and **Plants** have been completely rewritten!
    * **Flavor:** Every item now has a creative English description to add depth to your world.
    * **Prices:** All items now have realistic price ranges based on the Pathfinder 2e economy.
* **Content:**
    * **Fantasy Drinks:** ~430 items.
    * **Fantasy Food:** ~560 items.
    * **Fantasy Trinkets:** ~540 items.
    * **Fantasy Gemstones:** ~390 items.
    * **Fantasy Plants:** ~500 items.

## Version 1.4.0 - The Loot Update ✨
### Features
* **Real Item Generation:** Items generated from "Food", "Drinks", "Trinkets" and "Gemstones" lists are now created as real items in Foundry VTT!
    * **Drag & Drop:** You can drag items directly from the chat card to character sheets.
    * **Dedicated Folder:** Generated items are stored in a new folder "Phils Generated Loot".
* **System Support:**
    * **Pathfinder 2e:** Creates `Treasure` and `Consumable` items. Prices are correctly split into GP/SP/CP (Platinum disabled for better readability).
    * **D&D 5e:** Creates `Loot` and `Consumable` items.
* **Smart Pricing:** Prices in the chat are now simplifed to show only the top 2 denominations (e.g. `11gp` instead of `10gp 8sp 20cp`) for cleaner UI.
* **Layout:** Improved Chat Card layout for long item names.

## Version 1.3.0 - The Economy Update 💰

### Content Overhaul
*   **Realistic Pricing**: Alle Gegenstände in den Listen **Trinkets**, **Food** und **Gemstones** wurden neu bewertet. Die Preise basieren nun auf dem "Bier-Index" (1 KP ≈ 1€), um besser zur Pathfinder 2e Wirtschaft zu passen.
*   **Trinkets:** Die Liste wurde auf über **500 Einträge** erweitert! Von wertlosem Plunder bis zu kleinen Schätzen.
*   **Gemstones:** Jetzt mit knapp **400 Einträgen**, inklusive magischer und verfluchter Steine. Preise angepasst (weniger Inflation!).
*   **Fantasy Food:** Über **560 Gerichte**! Komplett überarbeitet für **Pathfinder 2e Lore** (Golarion). Keine generischen "Pizzen" mehr, sondern *Chelish Devil-Wings*, *Osirion Honey-Cakes* und *Goblin Pickles*.

### Features
*   **Massive Erweiterung**: Die Beispieldatenbanken sind nun praller gefüllt denn je.


## Version 1.2.0

### Features
* **Localization**: Das Modul ist nun vollständig auf Deutsch und Englisch verfügbar! (Automatische Erkennung).
* **Generator Fenster**: Der Generator (Tavernen Menü / Schatzbeutel) hat nun ein eigenes, separates Fenster (Clean UI).
* **Makro Support**: Kein Button mehr im Journal-Header! Das Modul erstellt nun automatisch ein Makro "Phil's Random Names", um das Fenster zu öffnen.
* **Auto-Pricing**: Gegenstände aus einfachen Listen (z.B. "Fantasy Trinkets") zeigen nun automatisch Preise an, wenn diese im Journal hinterlegt sind (Format `[10gp]`).
* **Sync Button**: Neuer Button im Hauptmenü, um Inhalte/Beispiele neu zu laden, ohne den Ordner löschen zu müssen.

### Content
* Neue Listen: **Fantasy Trinkets** und **Fantasy Gemstones** (mit Preisen).
* Updates: Preise zu **Fantasy Food** und **Fantasy Drinks** hinzugefügt.

## v1.1.0 - The Lore Update 📜

This update focuses on quality and lore-accuracy. We have completely rewritten several name lists to better match Pathfinder 2e lore and removing generic filler.

### ✨ Name List Overhauls
*   **Dwarves:** ~400 New names. Surnames are now strictly **Clan Names** (e.g. *Goldhammer*), removing generic smith-spam.
*   **Gnomes:** ~400 New names. Focus on eccentric, complex names and Obsession-based surnames.
*   **Goblins:** ~300 New names. Short, punchy first names and **Tribe/Title** surnames (e.g. *Licktoad*).
*   **Halflings:** ~300 New names. Cozy, melodic first names and **Nature/Descriptive** surnames (e.g. *Tea-Leaf*).
*   **Orcs:** ~300 New names. Rough, guttural first names and **Epithet** surnames (e.g. *Bone-Snapper*).
*   **Elves:** Cleaned up formatting issues in the name list.

## v1.0.0 - The Big Release! 🎉

The module is leaving the Beta phase and is now officially version 1.0.0.
This update brings a massive expansion of the included data.

### 🆕 New Content (13,000+ Entries)
We have massively expanded the example database. The module now contains:

*   **7 Ancestry Lists:**
    *   Humans (Inner Sea & Mwangi) - *~3 Million Combos*
    *   Elves - *~2 Million Combos*
    *   Dwarves
    *   Halflings
    *   Gnomes
    *   Goblins
    *   Leshys (Plant Folk)
    *   Orcs
*   **5 Thematic Lists:**
    *   🍺 **Fantasy Drinks:** ~400 drinks (Mead, Wine, Ale).
    *   🍖 **Fantasy Food:** ~400 Tavern Dishes.
    *   🌿 **Fantasy Plants:** ~500 magical and mundane plants.
    *   🏪 **Shops:** ~500 generic shop names ("The Rusty Anchor").
    *   🗣️ **Rumors:** 500+ atmospheric rumors and plot hooks.

### 🛠️ Improvements
*   **UI Layout:** Fix for scrolling behavior in the list. The footer now remains fixed while the list scrolls.
*   **Performance:** Optimized loading of example files.

Happy generating! 🎲
