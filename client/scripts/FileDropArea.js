export class FileDropArea {
    constructor (area, onFileDrop) {
        this.area = area
        this.onFileDrop = onFileDrop;

        area.addEventListener("dragleave", this.setHoverClass.bind(this, false))
        area.addEventListener("dragend", this.setHoverClass.bind(this, false))
        area.addEventListener("drop", this.setHoverClass.bind(this, false))

        area.addEventListener("dragover", this.setHoverClass.bind(this, true))
        area.addEventListener("dragenter", this.setHoverClass.bind(this, true))

        area.addEventListener("drop", this.handleDrop.bind(this))
        area.addEventListener("dragover", this.handleDragOver.bind(this))

        this.lastHover = {};
    }

    setHoverClass (isHovered) {
        // keep own timeout running
        if (this.lastHover.wasHovered === isHovered) {
            return
        }

        // clear enemy timeout
        if (this.lastHover.timeoutId && this.area.classList.contains("hover") === isHovered && this.lastHover.wasHovered !== isHovered) {
            clearTimeout(this.lastHover.timeoutId)
            this.lastHover.timeoutId = null
            this.lastHover.wasHovered = isHovered
        }

        if (this.area.classList.contains("hover") !== isHovered) {
            this.lastHover.wasHovered = isHovered
            this.lastHover.timeoutId = setTimeout(() => {
                this.lastHover.timeoutId = null

                if (isHovered) {
                    this.area.classList.add("hover")
                } else {
                    this.area.classList.remove("hover")
                }
            }, 200)
        }
    }

    handleDragOver (evt) {
        evt.preventDefault()
        evt.stopPropagation()

        this.setHoverClass(true)
    }

    handleDrop (evt) {
        evt.stopPropagation()
        evt.preventDefault()

        const eventOut = {
            target: {
                files: {}
            }
        }

        if (evt.dataTransfer.items) {
            for (var i = 0; i < evt.dataTransfer.items.length; i++) {
                if (evt.dataTransfer.items[i].kind === 'file') {
                    eventOut.target.files[i] = evt.dataTransfer.items[i].getAsFile();
                }
              }
        } else {
            for (var i = 0; i < evt.dataTransfer.files.length; i++) {
                eventOut.target.files[i] = evt.dataTransfer.files[i];
            }
        }

        this.onFileDrop(eventOut);
    }
}