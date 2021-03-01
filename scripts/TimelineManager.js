import { Item } from "./Item.js";
import { PreviewManager } from "./PreviewManager.js";

class _TimelineManager {
    constructor () {
        this.items = new Map();
    }

    init () {
        this.container = document.querySelector("#timeline");
        this.gridElement = document.querySelector("#grid");

        this.grid = new Muuri(this.gridElement, {
            dragEnabled: true,
            items: ".item",
            dragPlaceholder: {
                enabled: true
            },
            layout: {
                horizontal: true
            }
        });

        this.container.addEventListener("wheel", evt => {
            if (!evt.deltaY) {
                return;
              }

              evt.currentTarget.scrollLeft += evt.deltaY + evt.deltaX;
              evt.preventDefault();
        })
    }

    addItem (data) {
        const item = new Item(data.content, data.name);
        this.items.set(item.id, item);



        item.loaded.promise.then(() => {
            const frames = Array.from(this.items.values())
                .filter(item => item.loaded.isFulfilled)
                .map(item => item.ctx);

            PreviewManager.render(frames);
        })

        this.grid.add(item.domRef, {});
    }
}

export const TimelineManager = new _TimelineManager();
