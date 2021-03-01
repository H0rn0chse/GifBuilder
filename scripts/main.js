import { initImport, importImage } from "./importFile.js";
import { PreviewManager } from "./PreviewManager.js";
import { TimelineManager } from "./TimelineManager.js";

export function init () {
    initImport();
    TimelineManager.init();
    addOptionEvents();

    // debugging
    globalThis.TimelineManager = TimelineManager;
    globalThis.PreviewManager = PreviewManager;
}

function addOptionEvents () {
    document.querySelector("#addImage").addEventListener("click", async evt => {
        const images = await importImage(true);
        images.forEach(data => {
            TimelineManager.addItem(data);
        })
    })
}
