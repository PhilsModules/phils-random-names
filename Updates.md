
## Version 1.9.1 - The German Polish Update 🇩🇪
### Improvements
*   **Linguistic Polish:** A comprehensive stylistic review of all German lists (`Fantasy_x_De.md`).
    *   **Catalog Style:** Removed leading articles ("Ein", "Der", "Die") for concise, professional descriptions.
    *   **Terminology:** Standardized Pathfinder 2e terms (e.g. *Würfe* instead of *Checks*).
    *   **Atmosphere:** Refined descriptions for a more immersive, atmospheric tone.
*   **UI Tweaks:**
    *   **Sorting:** The Generator UI now lists "Fantasy" item lists at the top for quicker access.
    *   **Translations:** The "Fantasy" lists now have immersive names in both English (e.g. *Brews and Elixirs*) and German (e.g. *Getränke und Elixiere*).
*   **Renaming:** "Fantasy" prefix removed from display names for a cleaner look.

## Version 1.9.0 - The Treasure Update 💎
### Features
*   **Update Notification:** The module now checks for updates on startup. If a new version is detected, a message with an "Update Lists" button is posted to the chat, streamlining the update process.
*   **Generator UI Update:** The "Treasure Pouch" generator has been upgraded! You can now specifically choose how many **Treasures**, **Trinkets**, and **Gemstones** you want to generate.
*   **New Content:**
    *   **Fantasy Treasures:** Added `Fantasy_Treasures.md` (and German `_De`) with **300 new entries**! These are higher-value items like art objects, minor magic items, and curiosities.
    *   **New Assets:** Added new, dedicated images for all lists (Books, Foods, Drinks, Gems, Plants, Treasures, Trinkets, Fungi).

### Improvements
*   **Assets:** All lists now have their own dedicated cover image in the loot generator.
*   **Localization:** Full English and German support for the new Treasure list and UI.

## Version 1.8.1 - The Currency Fix 💸
### Bug Fixes
*   **Deutsches Währungssystem:** Fixed a bug where currency abbreviations in German lists (gm, sm, km, pm) were parsed as "Free" because the system only understood English terms. The module now correctly detects and calculates German prices.
*   **Chat Display:** The Chat Output will now also display German abbreviations (e.g. `5gm` instead of `5gp`) if the Foundry language is set to German.
*   **Verification:** Verified with new German gemstone lists.

## Version 1.8.0 - The German Edition 🇩🇪
### Features
*   **Volle Deutsche Übersetzung:** Alle 7 Fantasy-Listen (**Essen, Getränke, Bücher, Kuriositäten, Pflanzen, Pilze, Edelsteine**) sind nun vollständig und qualitätsgesichert auf Deutsch verfügbar!
    *   **Inhalt:** Über **3.000 Gegenstände** sind nun auf Deutsch verfügbar.
    *   **Qualität:** Alle Texte wurden einem "Deep Review" unterzogen, um korrekte Pathfinder 2e Terminologie (z.B. *Benommen*, *Entkräftet*) und natürliche Phrasierung sicherzustellen.
    *   **Format:** Alle Einträge behalten ihre GM-Geheimnisse, Marktpreise und Beschreibungen bei.
*   **Intelligente Spracherkennung:**
    *   Das Modul prüft nun automatisch die Sprache deiner Foundry VTT Installation (`game.i18n.lang`).
    *   Ist die Sprache auf **Deutsch** eingestellt, werden automatisch die deutschen Listen (`_De.md`) geladen.
    *   Ist die Sprache auf **Englisch** (oder anders) eingestellt, bleiben die englischen Originale erhalten.

## Version 1.7.0 - The GM Secret Update 🤫
### Features
*   **GM Secrets for Everything:** I have manually updated **every single item** across all thematic lists (Drinks, Food, Trinkets, Gemstones, Plants, Books, Fungi) with a hidden "GM Secret" field!
    *   **Mechanics:** Items now have concrete stats like `Heals 1d4 HP`, `Sickened 1`, `Worth 500gp`, or `+1 Lore (History)`.
    *   **Secrets:** Some items are cursed, some are disguised treasures, and some have plot hooks for your campaign.
    *   **Immersion:** Over **2,700 items** detailed by hand to be adventure-ready.
*   **Expanded Lists:**
    *   **Fantasy Books:** ~305 titles, each with a specific Lore or Skill bonus for reading.
    *   **Fantasy Drinks:** ~436 beverages, from common ales to magical elixirs.
    *   **Fantasy Food:** ~565 dishes, including regional specialties and monster-based meals.
    *   **Fantasy Fungi:** ~305 mushrooms, clearly labeled as Edible, Poisonous, or Magical.


## Version 1.6.4 - The Fungus Among Us 🍄
### Content
*   **New List:** Added `Fantasy_Fungi.md` with over **300 new items**! Includes:
    *   **Edible:** Delicious forest snacks like *King Bolete* and *Golden Chanterelle*.
    *   **Poisonous:** Deadly traps like *Death Angel* and *Wolf Fart* (puffballs).
    *   **Magical:** Useful adventure items like *Glow Bulb* (light) and *Cloud Puff* (levitation).



## Version 1.6.3 - Bug Fixes 🐛
### Bug Fixes
*   **Preview Window:** Fixed an issue where the Result Preview window was not scrollable, cutting off the "Post" button for long lists.
*   **Generator Logic:** Fixed a bug where setting a quantity to "0" (e.g. for Drinks) would incorrectly default to 5.

## Version 1.6.1 - The Ownership Fix 🔒
### Bug Fixes
*   **Item Permissions:** Fixed a bug where generated items (Food, Drinks, Loot) were created with ownership `None`, preventing players from interacting with them. Items are now correctly created with `Owner` permission for all players.

### Content
*   **Refined Descriptions**: Approx 300 books, 435 drinks, 564 food items, 390 gemstones (including a second polish pass), 500 plants, and 540 trinkets have been updated with flavorful descriptions and price ranges.

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
