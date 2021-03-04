import { HintManager } from "./HintManager.js";
import { initImport } from "./importFile.js";
import { initOptions } from "./options.js";
import { PreviewManager } from "./PreviewManager.js";
import { TimelineManager } from "./TimelineManager.js";

export function init () {
    TimelineManager.init();
    PreviewManager.init();
    HintManager.init();
    initImport();
    initOptions();

    // debugging
    globalThis.HintManager = HintManager;
    globalThis.TimelineManager = TimelineManager;
    globalThis.PreviewManager = PreviewManager;

    //======================== Modal picnic.css windows ===============
    document.addEventListener("keydown", evt => {
        if (evt.key === "Escape") {
            const modalWindows = document.querySelectorAll(".modal > [type=checkbox]");
            modalWindows.forEach(modal => {
                modal.checked = false
            });
        }
    }, { passive: true });
}
