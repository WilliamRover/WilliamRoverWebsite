// Load file
export function loadFile(file, id) {
    // fetch(file).then(response => response.text()).then(html => {document.getElementById(id).innerHTML = html;});
    var getFile = fetch(file);
    var html = getFile.then(conversion => conversion.text());
    html.then(html => {document.getElementById(id).innerHTML = html;})

    // Run .js file
    var script = document.createElement("script");
    script.src = file.replace("html", "js");
    script.type = "module";
    document.body.appendChild(script);
}
// Check time
var time = new Date();
export function checkTime() {
    if (time.getHours() >= 6 && time.getHours() < 18) {
        return true
    } else if (time.getHours() >= 18 || time.getHours() < 6) {
        return false
    }
}
