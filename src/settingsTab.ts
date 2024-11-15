import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import ReplaceOnPastePlugin from "./main";

export class ReplaceOnPasteSettingsTab extends PluginSettingTab {
    plugin: ReplaceOnPastePlugin;

    constructor(app: App, plugin: ReplaceOnPastePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Replace on Paste Settings" });

        /// Create a table for data entry grid
        let table = containerEl.createEl("table", { cls: "replacement-table" });
        let tbody = table.createEl("tbody");

        // Function to add a row to the table
        const addRow = (searchPattern: string = "", replacementPattern: string = "") => {
            let row = tbody.createEl("tr");

            let searchCell = row.createEl("td");
            let searchInput = searchCell.createEl("input", { type: "text", value: searchPattern, placeholder: "Search Pattern" });
            searchInput.onchange = () => {
                searchPattern = searchInput.value;
            };

            let replacementCell = row.createEl("td");
            let replacementInput = replacementCell.createEl("input", { type: "text", value: replacementPattern, placeholder: "Replacement Pattern" });
            replacementInput.onchange = () => {
                replacementPattern = replacementInput.value;
            };

            let actionCell = row.createEl("td");
            if (searchPattern && replacementPattern) {
                let removeButton = actionCell.createEl("button", { text: "Remove" });
                removeButton.onclick = () => {
                    delete this.plugin.settings.replacements[searchPattern];
                    this.display();
                };
            } else {
                let addButton = actionCell.createEl("button", { text: "Add Replacement" });
                addButton.onclick = () => {
                    if (searchPattern.length > 0 && replacementPattern.length > 0) {
                        this.plugin.settings.replacements[searchPattern] = replacementPattern;
                        this.display();
                    }
                };
            }
        };

        // Add initial empty row
        addRow();

        // Add existing replacements to the table
        for (let [searchPattern, replacementPattern] of Object.entries(this.plugin.settings.replacements)) {
            addRow(searchPattern, replacementPattern);
        }

        // Add button to save settings
        let saveButton = containerEl.createEl("button", {
            text: "Save Settings",
            cls: "mod-cta"
        });
        saveButton.addEventListener("click", async () => {
            await this.plugin.saveSettings();
            new Notice("Settings saved successfully");
        });

        // Display json representation of replacements for debugging
        containerEl.createEl("pre", { text: JSON.stringify(this.plugin.settings.replacements, null, 2) });
    }
}
