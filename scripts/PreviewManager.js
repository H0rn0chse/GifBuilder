class _PreviewManager {
    constructor () {
        this.imgRef = document.querySelector("#previewImage");

        this.gif = new GIF({
            workers: 1,
            quality: 1,
            //background: "0xFF00FF",
            width: 64,
            height: 64,
            transparent: "0xFF00FF",
            workerScript: "/libs/gif.worker.js",
        });

        this.gif.on("finished", blob => {
            this.gif.running = false;
            console.log("done")
            this.imgRef.src = URL.createObjectURL(blob);
        });
    }

    render (frames) {
        if (this.gif.running) {
            this.gif.abort();
        }
        frames.forEach(frame => {
            this.gif.addFrame(frame, {copy: true});
        });
        //this.gif.setOption("transparent", "0xFF00FF");
        this.gif.render();
        /*const imageData = frames.map(frame => {
            return {
                src: frame.src
            };
        })
        gifshot.createGIF({
            "images": frames
          }, (obj) => {
            if(!obj.error) {
              this.imgRef.src = obj.image;
            }
          });*/
    }
}

export const PreviewManager = new _PreviewManager();
