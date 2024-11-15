import { Plugin, Editor, MarkdownView, Notice } from "obsidian";
import { applyReplacements } from "./replacementHelper";

// Remember to rename these classes and interfaces!

interface ReplaceOnPasteSettings {
	replacements: { [key: string]: string };
}

const DEFAULT_SETTINGS: ReplaceOnPasteSettings = {
	replacements: {" (pg\d+)":"#books/atomic-habits/$1" } 
}

export default class ReplaceOnPacePlugin extends Plugin {
	settings: ReplaceOnPasteSettings;

	async onload() {
		// this.addSettingTab(new PacerPlanSettingsTab(this.app, this));

		console.log("loading ReplaceOnPaste plugin");
		await this.loadSettings();

		// command that ones on text paste
		this.registerEvent(
			this.app.workspace.on("editor-paste", this.onEditorPaste.bind(this))
		);
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private async onEditorPaste(
		clipboard: ClipboardEvent,
		editor: Editor
	): Promise<void> {
		if (clipboard.defaultPrevented) return;
		if (!navigator.onLine) return;

		const clipboardData = clipboard.clipboardData?.getData("text/plain");

		console.log("clipboardData", clipboardData);

		if (!clipboardData) return;

		clipboard.stopPropagation();
		clipboard.preventDefault();

		try {
			const postReplacementText = applyReplacements(clipboardData, this.settings.replacements);

			console.log("postReplacementText", postReplacementText);
			if (postReplacementText) {
				editor.replaceSelection(postReplacementText);
			} else {
				throw new Error();
			}
		} catch (error) {
			const failureMessage = "Failed to retrieve study block from pasted content.";
			new Notice(`${failureMessage}: ${error}`);
			console.error(error);
			editor.replaceSelection(clipboardData);
		}
	}
}


