import { initImport } from "./importFile.js";
import { initOptions } from "./options.js";
import { PreviewManager } from "./PreviewManager.js";
import { TimelineManager } from "./TimelineManager.js";

export function init () {
    TimelineManager.init();
    PreviewManager.init();
    initImport();
    initOptions();

    // debugging
    globalThis.TimelineManager = TimelineManager;
    globalThis.PreviewManager = PreviewManager;
}
