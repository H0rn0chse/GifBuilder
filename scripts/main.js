import { HintManager } from "./HintManager.js";
import { initImport } from "./importFile.js";
import { initOptions, initFileDragDrop } from "./options.js";
import { PreviewManager } from "./PreviewManager.js";
import { TimelineManager } from "./TimelineManager.js";

TimelineManager.init();
PreviewManager.init();
HintManager.init();
initImport();
initOptions();
initFileDragDrop();

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
