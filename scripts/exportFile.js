export function exportText (content, fileName) {
    const a = document.createElement("a")
    // data string is not encoded yet
    if (!content.startsWith("data:")) {
        content = "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    }
    a.setAttribute("href", content)
    a.setAttribute("download", fileName);
    a.click()
}

export function exportBlob (content, fileName) {
    const a = document.createElement("a")
    a.setAttribute("href", URL.createObjectURL(content))
    a.setAttribute("download", fileName);
    a.click()
}