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

        this.grid.on('layoutEnd', item => {
            PreviewManager.render();
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
        const muuriItem = this.grid.add(item.domRef, {})[0];
        this.items.set(muuriItem, item);
        return item.loaded.promise;
    }

    removeItem (item) {
        const muuriItem = this.grid.getItem(item.domRef);
        if (muuriItem) {
            this.items.delete(muuriItem);
            this.grid.remove([muuriItem], { removeElements: true });
        }
    }

    getItems () {
        return this.grid.getItems()
            .map(muuriItem => this.items.get(muuriItem))
            .filter(item => item.loaded.isFulfilled)
            .map(item => item.ctx);
    }
}

export const TimelineManager = new _TimelineManager();
