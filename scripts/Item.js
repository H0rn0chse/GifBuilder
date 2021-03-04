import { Deferred } from "./Deferred.js";
import { setInputDimensions } from "./options.js";
import { TimelineManager } from "./TimelineManager.js";

let guid = 0;

export class Item {
    constructor (src, name) {
        guid += 1
        this.id = guid;
        this.loaded = new Deferred();

        this.src = src;
        this.name = name;

        this.domRef = null;
        this._createItem();

        this.imageRef = null;
        this.contentRef = null;
        this._createContent();

        this.canvasRef = null;
    }

    _createItem () {
        this.domRef = document.createElement("div");
        this.domRef.classList.add("item");
    }

    _createContent () {
        this.contentRef = document.createElement("div");
        this.contentRef.classList.add("item-content");

        this.imageRef = document.createElement("img");
        this.imageRef.src = this.src;
        this.imageRef.onload = this._onImageLoad.bind(this)
        this.contentRef.appendChild(this.imageRef);

        //======= imageInfo =============
        const imageInfo = document.createElement("div");
        imageInfo.classList.add("imageInfo")

        const name = document.createElement("div")
        name.innerText = this.name;
        imageInfo.appendChild(name);

        this.size = document.createElement("div")
        imageInfo.appendChild(this.size);

        this.contentRef.appendChild(imageInfo);


        //======= imageInfo =============
        const buttonRow = document.createElement("div");
        buttonRow.classList.add("buttonRow", "flexRow");

        const duplicateButton = document.createElement("div");
        duplicateButton.innerHTML = feather.icons["copy"].toSvg({ color: "#0074d9" })
        duplicateButton.classList.add("itemDuplicate");
        duplicateButton.addEventListener("click", evt => {
            TimelineManager.addItem({ content: this.src, name: this.name });
        }, { passive: true });
        buttonRow.appendChild(duplicateButton);

        const deleteButton = document.createElement("div");
        deleteButton.innerHTML = feather.icons["x"].toSvg({ color: "red" })
        deleteButton.classList.add("itemDelete");
        deleteButton.addEventListener("click", evt => {
            TimelineManager.removeItem(this);
        }, { passive: true });
        buttonRow.appendChild(deleteButton);

        this.contentRef.appendChild(buttonRow);


        this.domRef.appendChild(this.contentRef);
    }

    _onImageLoad () {
        const height = this.imageRef.naturalHeight
        const width = this.imageRef.naturalWidth
        if (height > width) {
            this.imageRef.style.height = "calc(var(--blockSize) - 3.5em)";
        } else {
            this.imageRef.style.width = "calc(var(--blockSize) - 3.5em)";
        }
        this.size.innerText = `(${width}x${height})`;
        setInputDimensions(width, height);

        this._createCanvas();
    }

    _createCanvas () {
        this.canvasRef = document.createElement("canvas");
        this.canvasRef.width = this.imageRef.naturalWidth;
        this.canvasRef.height = this.imageRef.naturalHeight;
        this.ctx = this.canvasRef.getContext("2d");

        this.ctx.drawImage(this.imageRef, 0, 0);

        this.loaded.resolve();
    }
}