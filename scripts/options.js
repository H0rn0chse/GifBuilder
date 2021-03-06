import { importDroppedImages, importImage } from "./importFile.js";
import { exportBlob } from "./exportFile.js";
import { PreviewManager } from "./PreviewManager.js";
import { TimelineManager } from "./TimelineManager.js";
import { FileDropArea } from "./FileDropArea.js";

let colorPicker = null;

function initPicker () {
    colorPicker = new ColorPickerControl({
        container: document.querySelector("#colorPicker"),
        theme: "dark",
        use_alpha: false
    });

    colorPicker.color.fromRGBa(255,0,255);
    colorPicker.update();

    colorPicker.on("change", () => {
        PreviewManager.render();
    });
}

export function getTransparentKeyColor () {
    return colorPicker.color.toHEX();
}

export function initFileDragDrop () {
    const dropArea = document.querySelector("#timeline");
    const handler = new FileDropArea(dropArea, async (evt) => {
        const images = await importDroppedImages(evt);

        const promises = images.map(data => {
            return TimelineManager.addItem(data);
        })
        await Promise.all(promises);
        PreviewManager.render();
    });
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
    }, { passive: true });

    document.querySelector("#clearImages").addEventListener("click", evt => {
        TimelineManager.removeAllItems();
    }, { passive: true });

    document.querySelector("#downloadGif").addEventListener("click", async evt => {
        const blob = PreviewManager.currentBlob;
        if (blob) {
            exportBlob(blob, "image.gif");
        }
    }, { passive: true });

    const inputs = [
        document.querySelector("#imageWidth"),
        document.querySelector("#imageHeight"),
        document.querySelector("#keepDimensions"),
        document.querySelector("#framesPerSecond"),
        document.querySelector("#imageQuality"),
        document.querySelector("#imageDither"),
        document.querySelector("#alphaHandling"),
        document.querySelector("#imageSmoothing"),
        document.querySelector("#colorUsage"),
    ];

    inputs.forEach(elem => {
        elem.addEventListener("change", evt => {
            PreviewManager.render();
        }, { passive: true });
    });
}

export function setInputDimensions (width, height, force = false) {
    const widthInput = document.querySelector("#imageWidth");
    const heightInput = document.querySelector("#imageHeight");

    if (widthInput.valueAsNumber === 0 || force) {
        widthInput.value = width;
    }
    if (heightInput.valueAsNumber === 0 || force) {
        heightInput.value = height;
    }
}

export function getWidth () {
    const input = document.querySelector("#imageWidth");
    return input.valueAsNumber;
}

export function getHeight () {
    const input = document.querySelector("#imageHeight");
    return input.valueAsNumber;
}

export function getKeepDimensions () {
    const checkbox = document.querySelector("#keepDimensions");
    return checkbox.checked;
}

export function getFramesPerSecond () {
    const input = document.querySelector("#framesPerSecond");
    return input.valueAsNumber;
}

export function getQuality () {
    const input = document.querySelector("#imageQuality");
    return (parseInt(input.max, 10) + 1) - input.valueAsNumber;
}

export function getDither () {
    const select = document.querySelector("#imageDither");
    const value = select.value;
    if (value === "none") {
        return false;
    }
    return value;
}

export function getAlphaHandling () {
    const select = document.querySelector("#alphaHandling");
    return select.value;
}

export function getImageSmoothing () {
    const checkbox = document.querySelector("#imageSmoothing");
    return checkbox.checked;
}

export function getColorUsage () {
    const select = document.querySelector("#colorUsage");
    return select.value;
}
