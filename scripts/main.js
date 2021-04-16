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

const acknowledgements = document.querySelector("#acknowledgements");
acknowledgements.innerHTML = feather.icons["award"].toSvg({ color: "var(--acknowledgements)" });
acknowledgements.addEventListener("click", evt => {
    window.open("./acknowledgements/third-party-licenses.html", '_blank')
}, { passive: true });

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
