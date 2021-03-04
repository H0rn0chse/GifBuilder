import { getQuality, getWidth, getHeight, getDithering, setInputDimensions, getKeepDimensions, getFramesPerSecond, getAlphaHandling, getTransparentKeyColor, getImageSmoothing } from "./options.js";
import { TimelineManager } from "./TimelineManager.js";

class _PreviewManager {
    constructor () {
        this.estimatedSize = document.querySelector("#estimatedSize");
        this.imgRef = document.querySelector("#previewImage");
        this.currentBlob = null;

        this.framesPerSecond = 5;
        this.keepDimensions = true;
        this.width = 32
        this.height = 32
        this.transparentKeyColor = "#FF00FF";
        this.imageSmoothing = false;

        this.gif = new GIF({
            workers: 4,
            quality: 1,
            background: "#FF00FF",
            width: this.width,
            height: this.height,
            transparent: this.HEXToBinary(this.transparentKeyColor),
            workerScript: "/libs/gif.worker.js",
            debug: true,
        });


        this.gif.on("finished", blob => {
            this.gif.running = false;
            this.currentBlob = blob
            this._setEstimatedSize(blob.size);

            this.imgRef.src = URL.createObjectURL(blob);
            console.log("gif done");
        });
    }

    init () {
        this.render = _.debounce(this._handleRender, 800);
    }

    HEXToBinary (hexCode) {
        return hexCode.toUpperCase().replace(/\#/, "0x");
    }

    setTransparentColor (color) {
        this.gif.setOption("transparent", color); // "0xFF00FF"
    }

    fetchOptions () {
        this.width = getWidth() || 32;
        this.gif.setOption("width", this.width);
        this.height = getHeight() || 32;
        this.gif.setOption("height", this.height);
        this.keepDimensions = getKeepDimensions();
        this.framesPerSecond = getFramesPerSecond();
        this.gif.setOption("quality", getQuality() || 1);
        this.gif.setOption("dithering", getDithering() || false);
        this.alphaHandling = getAlphaHandling();
        this.transparentKeyColor = getTransparentKeyColor();
        this.gif.setOption("transparent", `${this.HEXToBinary(this.transparentKeyColor)}`);
        this.imageSmoothing = getImageSmoothing();
    }

    showPlaceholder () {
        this.imgRef.src = "./assets/initial.png";
        setInputDimensions(0, 0, true);
    }

    _setEstimatedSize (size) {
        const kb = size / 1024;
        if (kb < 1024) {
            this.estimatedSize.innerText = `${kb.toFixed(2)} KB`;
        } else {
            const mb = kb / 1024;
            this.estimatedSize.innerText = `${mb.toFixed(2)} MB`;
        }
    }

    _handleRender () {
        const frames = TimelineManager.getItems();
        if (this.gif.running) {
            this.gif.abort();
        }

        this.fetchOptions();
        const delay = 1000 / this.framesPerSecond;

        // remove alle frames
        this.gif.frames.splice(0, this.gif.frames.length);
        // add current frames
        frames.forEach(frame => {
            const processedFrame = this._processFrame(frame);
            this.gif.addFrame(processedFrame, {delay: delay});
        });

        this.gif.render();
    }

    _processFrame (sourceCtx) {
        let ctx = this._handleSize(sourceCtx);
        ctx = this._handleAlpha(ctx);
        return ctx;
    }

    _handleSize (sourceCtx) {
        const sourceCanvas = sourceCtx.canvas;
        const targetCanvas = document.createElement("canvas");
        const targetCtx = targetCanvas.getContext("2d");
        targetCtx.imageSmoothingEnabled = this.imageSmoothing;

        // set target size
        targetCanvas.width = this.width;
        targetCanvas.height = this.height;

        // draw image to target
        if (!this.keepDimensions) {
            targetCtx.drawImage(sourceCanvas, 0, 0, this.width, this.height);
        } else {
            const widthRatio = this.width / sourceCanvas.width;
            const heightRatio = this.height / sourceCanvas.height;
            const bestRatio = Math.min(widthRatio, heightRatio);

            const targetWidth = bestRatio * sourceCtx.canvas.width;
            const targetHeight = bestRatio * sourceCtx.canvas.height;
            targetCtx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
        }

        return targetCtx;
    }

    _handleAlpha (sourceCtx) {
        const sourceCanvas = sourceCtx.canvas;
        const imageData = sourceCtx.getImageData(0, 0, this.width, this.height);
        const targetCanvas = document.createElement("canvas");
        const targetCtx = targetCanvas.getContext("2d");

        iterateImageData(imageData, (data) => {
            switch (this.alphaHandling) {
                case "alphaRemoval":
                    if (data.a > 0) {
                        data.a = 255;
                    }
                    break;
                case "pixelRemoval":
                    if (data.a < 255) {
                        data.a = 0;
                    }
                // roundAlpha
                default:
                    if (data.a > 0 && data.a < 127) {
                        data.a = 0;
                    } else if (data.a > 0) {
                        data.a = 255;
                    }
                    break;
            }
            return data;
        });
        sourceCtx.putImageData(imageData, 0, 0);

        // set target size
        targetCanvas.width = this.width;
        targetCanvas.height = this.height;

        // set transparent key color
        targetCtx.fillStyle = this.transparentKeyColor;
        targetCtx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

        // drawImage to target
        targetCtx.drawImage(sourceCanvas, 0, 0, this.width, this.height);

        return targetCtx;
    }
}

function iterateImageData (imageData, callback) {
    for (let i = 0; i < imageData.data.length; i+=4) {
        const y = Math.floor(i / (imageData.width * 4))
        const x = i - y * (imageData.width * 4);
        const data = {
            r: imageData.data[i],
            g: imageData.data[i + 1],
            b: imageData.data[i + 2],
            a: imageData.data[i + 3],
            x: x,
            y: y
        };
        const result = callback(data);
        imageData.data[i] = result.r;
        imageData.data[i + 1] = result.g;
        imageData.data[i + 2] = result.b;
        imageData.data[i + 3] = result.a;
    }

}

export const PreviewManager = new _PreviewManager();
