import { TimelineManager } from "./TimelineManager.js";

class _PreviewManager {
    constructor () {
        this.estimatedSize = document.querySelector("#estimatedSize");
        this.imgRef = document.querySelector("#previewImage");
        this.currentBlob = null;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.gif = new GIF({
            workers: 1,
            quality: 1,
            //background: "0xFF00FF",
            width: 192,
            height: 192,
            transparent: "0xFF00FF",
            workerScript: "/libs/gif.worker.js",
        });


        this.gif.on("finished", blob => {
            this.gif.running = false;
            this.currentBlob = blob
            this.estimatedSize.innerText = (blob.size / 1024).toFixed(2);

            this.imgRef.src = URL.createObjectURL(blob);
        });
    }

    setTransparentColor (color) {
        this.gif.setOption("transparent", color); // "0xFF00FF"
    }


    render () {
        const frames = TimelineManager.getItems();
        if (this.gif.running) {
            this.gif.abort();
        }

        // remove alle frames
        this.gif.frames.splice(0, this.gif.frames.length);
        // add current frames
        frames.forEach(frame => {
            const processedFrame = this.processFrame(frame);
            this.gif.addFrame(processedFrame, {copy: true});
        });

        this.gif.render();
    }

    processFrame (ctx) {
        this.canvas.width = ctx.canvas.width;
        this.canvas.height = ctx.canvas.height;
        this.ctx.fillStyle = "#F0F";
        this.ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.ctx.drawImage(ctx.canvas, 0, 0);
        return this.ctx;
    }
}

export const PreviewManager = new _PreviewManager();
