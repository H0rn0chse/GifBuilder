import { initDrag } from "./drop.js";
import { Item } from "./Item.js";
import { PreviewManager } from "./PreviewManager.js";

class _TimelineManager {
    constructor () {
        this.items = new Map();
    }

    init () {
        this.container = document.querySelector("#timeline");

        initDrag(this.container)

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

        this.grid.on("dragStart", (item, event) => {
            item.getElement().style.cursor = "grabbing";
        });

        this.grid.on("dragEnd", (item, event) => {
            item.getElement().style.cursor = "";
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

    addItem (data, domRef) {
        let index = -1
        if (domRef) {
            index = this.grid.getItems().findIndex(item => {
                return item.getElement() === domRef;
            });
            index += index > -1 ? 1 : 0;
        }
        const item = new Item(data.content, data.name);
        const muuriItem = this.grid.add(item.domRef, { index: index })[0];
        this.items.set(muuriItem, item);
        return item.loaded.promise;
    }

    removeItem (item) {
        const muuriItem = this.grid.getItem(item.domRef);
        if (muuriItem) {
            this.items.delete(muuriItem);
            this.grid.remove([muuriItem], { removeElements: true });
        }
        if (this.items.size === 0) {
            PreviewManager.showPlaceholder();
        }
    }

    removeAllItems () {
        this.items.clear();
        this.grid.remove(this.grid.getItems(), { removeElements: true });
        PreviewManager.showPlaceholder();
    }

    getItems () {
        return this.grid.getItems()
            .map(muuriItem => this.items.get(muuriItem))
            .filter(item => item.loaded.isFulfilled)
            .map(item => item.ctx);
    }
}

export const TimelineManager = new _TimelineManager();
