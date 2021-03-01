import { Deferred } from "./Deferred.js";

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

        const name = document.createElement("div")
        name.classList.add("imageName")
        name.innerText = this.name;
        this.contentRef.appendChild(name);

        this.domRef.appendChild(this.contentRef);
    }

    _onImageLoad () {
        const height = this.imageRef.naturalHeight
        const width = this.imageRef.naturalWidth
        if (height > width) {
            this.imageRef.style.height = "calc(var(--blockSize) - 2em)";
        } else {
            this.imageRef.style.width = "calc(var(--blockSize) - 2em)";
        }
        //this.loaded.resolve();
        this._createCanvas();
    }

    _createCanvas () {
        this.canvasRef = document.createElement("canvas");
        this.canvasRef.width = this.imageRef.naturalWidth;
        this.canvasRef.height = this.imageRef.naturalHeight;

        this.ctx = this.canvasRef.getContext("2d");
        this.ctx.fillStyle = "#F0F";
        this.ctx.fillRect(0, 0, this.canvasRef.width, this.canvasRef.height);
        this.ctx.drawImage(this.imageRef, 0, 0);

        /*replaceColor(this.ctx, this.canvasRef.width, this.canvasRef.height, [0,0,0], [0,0,255]);
        replaceColor(this.ctx, this.canvasRef.width, this.canvasRef.height, [255,0,255], [0,0,0]);
        replaceColor(this.ctx, this.canvasRef.width, this.canvasRef.height, [0,0,255], [255,0,255]);*/
        //replaceColor(ctx, [255,0,255], [255,0,0]);

        document.querySelector("#options").appendChild(this.canvasRef);
        this.loaded.resolve();
    }
}

function replaceColor (ctx, width, height, oldRGB, newRGB) {
    const imageData = ctx.getImageData(0, 0, width, height);

    // examine every pixel,
    // change any old rgb to the new-rgb
    for (var i=0;i<imageData.data.length;i+=4)
    {
        // is this pixel the old rgb?
        if(imageData.data[i]==oldRGB[0] &&
            imageData.data[i+1]==oldRGB[1] &&
            imageData.data[i+2]==oldRGB[2]
        ){
            // change to your new rgb
            imageData.data[i]=newRGB[0];
            imageData.data[i+1]=newRGB[1];
            imageData.data[i+2]=newRGB[2];
        }
    }
    // put the altered data back on the canvas
    ctx.putImageData(imageData,0,0);
}