import { Deferred } from "./Deferred.js";

let fileHandler = null

export function initImport () {
	fileHandler = addLoadFile()
}

function addLoadFile () {
	const fileHandler = document.createElement("input")
	fileHandler.setAttribute("id", "FileHandler")
	fileHandler.setAttribute("type", "file")

	document.querySelector("#hidden").appendChild(fileHandler)

	return fileHandler
}

export function checkFileExtension (fileName) {
	const extensions = [
		".png",
		".jpg",
		".jpeg",
		".bmp"
	];
	return extensions.reduce((acc, ext) => {
		return acc || fileName.endsWith(ext);
	}, false);
}

export async function importImage (multiple = false) {
	const deferred = new Deferred()
	fileHandler.value = ""
	fileHandler.setAttribute("accept", ".png, .jpg, .jpeg, .bmp")
	if (multiple) {
		fileHandler.setAttribute("multiple", true)
	} else {
		fileHandler.removeAttribute("multiple")
	}
	fileHandler.onchange = importDataURL.bind(null, deferred.resolve, deferred.reject)
	fileHandler.click()

	return deferred.promise
}

export async function importDroppedImages (evt) {
	const files = evt.target.files;
	for (const fileIndex in files) {
		const file = files[fileIndex];
		if (!checkFileExtension(file.name)) {
			delete files[fileIndex];
		}
	}
	const deferred = new Deferred();
	importDataURL(deferred.resolve, deferred.reject, evt);
	return deferred.promise;
}

function importDataURL (resolve, reject, event) {
	const files = Object.values(event.target.files || {})
	const promises = files.map(file => {
		const deferred = new Deferred()
		const fileName = file.name
		const reader = new FileReader()
		reader.onload = evt => {
			deferred.resolve({
				content: evt.target.result,
				name: fileName
			})
		}
		reader.readAsDataURL(file)
		return deferred.promise
	})
	resolve(Promise.all(promises))
}