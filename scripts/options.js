import { importImage } from "./importFile.js";
import { exportBlob } from "./exportFile.js";
import { PreviewManager } from "./PreviewManager.js";
import { TimelineManager } from "./TimelineManager.js";

let colorPicker = null;

function initPicker () {
    colorPicker = new ColorPickerControl({
        container: document.querySelector("#colorPicker"),
        theme: 'dark'
    });

    colorPicker.color.fromRGBa(255,0,255);
    colorPicker.update();
}

export function initOptions () {
    initPicker();

    document.querySelector("#addImage").addEventListener("click", async evt => {
        const images = await importImage(true);
        const promises = images.map(data => {
            return TimelineManager.addItem(data);
        })
        await Promise.all(promises);
        PreviewManager.render();
    });

    document.querySelector("#downloadGif").addEventListener("click", async evt => {
        const blob = PreviewManager.currentBlob;
        exportBlob(blob, "image.gif");
    });
}

