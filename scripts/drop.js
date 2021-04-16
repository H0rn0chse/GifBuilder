import { Deferred } from "./Deferred.js";
import { importDataURL, checkFileExtension } from "./importFile.js";

let dragArea;

export function initDrag (area) {
    dragArea = area
    dragArea.addEventListener("dragleave", setHoverClass.bind(this, false))
    dragArea.addEventListener("dragend", setHoverClass.bind(this, false))
    dragArea.addEventListener("drop", setHoverClass.bind(this, false))

    dragArea.addEventListener("dragover", setHoverClass.bind(this, true))
    dragArea.addEventListener("dragenter", setHoverClass.bind(this, true))

    dragArea.addEventListener("drop", handleDrop.bind(this))
    dragArea.addEventListener("dragover", handleDragOver.bind(this))
}

const lastHover = {}
function setHoverClass (isHovered) {
    // keep own timeout running
    if (lastHover.wasHovered === isHovered) {
        return
    }

    // clear enemy timeout
    if (lastHover.timeoutId && dragArea.classList.contains("hover") === isHovered && lastHover.wasHovered !== isHovered) {
        clearTimeout(lastHover.timeoutId)
        lastHover.timeoutId = null
        lastHover.wasHovered = isHovered
    }

    if (dragArea.classList.contains("hover") !== isHovered) {
        lastHover.wasHovered = isHovered
        lastHover.timeoutId = setTimeout(() => {
            lastHover.timeoutId = null

            if (isHovered) {
                dragArea.classList.add("hover")
            } else {
                dragArea.classList.remove("hover")
            }
        }, 200)
    }
}

function handleDragOver (evt) {
    evt.preventDefault()
    evt.stopPropagation()

    setHoverClass(true)
}

async function handleDrop (evt) {
    evt.stopPropagation()
    evt.preventDefault()

    const eventOut = {
        target: {
            files: {}
        }
    }

    if (evt.dataTransfer.items) {
        for (var i = 0; i < evt.dataTransfer.items.length; i++) {
            const file = evt.dataTransfer.items[i].getAsFile();
            if (evt.dataTransfer.items[i].kind === 'file' && checkFileExtension(file.name)) {
                eventOut.target.files[i] = file;
            }
          }
    } else {
        for (var i = 0; i < evt.dataTransfer.files.length; i++) {
            const file = evt.dataTransfer.files[i];
            if (checkFileExtension(file.name)) {
                eventOut.target.files[i] = file;
            }
        }
    }

    if (Object.keys(eventOut.target.files).length) {
        const deferred = new Deferred()
        importDataURL(deferred.resolve, deferred.reject, eventOut)
        const images = await deferred.promise

        const promises = images.map(data => {
            return TimelineManager.addItem(data);
        })
        await Promise.all(promises);
        PreviewManager.render();
    }
}