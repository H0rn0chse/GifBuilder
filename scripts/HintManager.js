import { getColorUsage } from "./options.js";

class _HintManager {
    constructor () {
        this.mixedAlpha = false;
        this.colorAmount = false;
        this.sizeDifferences = false;
        this.missingTransparent = false;

        this.firstSize = "";
        this.colors = new Map();
        this.frames = [];
    }

    init () {
        this.warningModal = document.querySelector("#warningModal");

        this.mixedAlphaWarning = document.querySelector("#mixedAlphaWarning");
        this.colorAmountWarning = document.querySelector("#colorAmountWarning");
        this.sizeDifferencesWarning = document.querySelector("#sizeDifferencesWarning");
        this.missingTransparentWarning = document.querySelector("#missingTransparentWarning");

        this.warningIcon = document.querySelector("#warningIcon");
        this.warningIcon.innerHTML = feather.icons["alert-triangle"].toSvg({ color: "var(--common-warn)" })
        this.warningIcon.style.display = "none";
        this.warningIcon.addEventListener("click", (evt) => {
            this.warningModal.checked = true;
        }, { passive: true });
    }

    frameStart () {
        this.frames.push(false);
    }

    checkPixel (pixel) {
        if (pixel.a !== 0 && pixel.a !== 255) {
            this.mixedAlpha = true;
        }

        if (pixel.a === 255) {
            const color = `${pixel.r}/${pixel.g}/${pixel.b}`;
            this.colors.set(color, true);
        }

        if (pixel.a === 0) {
            this.frames[this.frames.length - 1] = true;
        }
    }

    checkCanvas (canvas) {
        const size = `${canvas.width}/${canvas.height}`;
        if (this.firstSize === "") {
            this.firstSize = size;
        } else if (this.firstSize !== size) {
            this.sizeDifferences = true;
        }
    }

    setUi () {
        const usesKey = getColorUsage() === "key";
        this.missingTransparent = usesKey ? this.frames.includes(false) : false;
        this.colorAmount = this.colors.size > 255;

        const showWarning = this.mixedAlpha || this.colorAmount || this.sizeDifferences || this.missingTransparent;

        this.warningIcon.style.display = showWarning ? "" : "none";

        this.mixedAlphaWarning.style.display = this.mixedAlpha ? "" : "none";
        this.colorAmountWarning.style.display = this.colorAmount ? "" : "none";
        this.sizeDifferencesWarning.style.display = this.sizeDifferences ? "" : "none";
        this.missingTransparentWarning.style.display = this.missingTransparent ? "" : "none";
    }

    reset () {
        this.mixedAlpha = false;
        this.colorAmount = false;
        this.sizeDifferences = false;
        this.missingTransparent = false;

        this.firstSize = "";
        this.colors.clear();
        this.frames = [];
        this.setUi();
    }
}

export const HintManager = new _HintManager();
