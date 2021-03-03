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

    colorPicker.on("change", () => {
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
    });

    document.querySelector("#downloadGif").addEventListener("click", async evt => {
        const blob = PreviewManager.currentBlob;
        exportBlob(blob, "image.gif");
    });

    const inputs = [
        document.querySelector("#imageWidth"),
        document.querySelector("#imageHeight"),
        document.querySelector("#keepDimensions"),
        document.querySelector("#framesPerSecond"),
        document.querySelector("#imageQuality"),
        document.querySelector("#imageDithering"),
        document.querySelector("#alphaHandling"),
    ];

    inputs.forEach(elem => {
        elem.addEventListener("change", evt => {
            PreviewManager.render();
        });
    });
}

export function setInputDimensions (width, height) {
    const widthInput = document.querySelector("#imageWidth");
    const heightInput = document.querySelector("#imageHeight");

    if (widthInput.valueAsNumber === 0) {
        widthInput.value = width;
    }
    if (heightInput.valueAsNumber === 0) {
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

export function getDithering () {
    const select = document.querySelector("#imageDithering");
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

