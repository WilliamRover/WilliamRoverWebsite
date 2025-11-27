// Load file
export function loadFile(file, id) {
    // gonna be honest chatGPT write this line
    fetch(file).then(response => response.text()).then(html => {
            // 1. Insert the HTML
            document.getElementById(id).innerHTML = html;

            // 2. THEN load and run the JS
            const script = document.createElement("script");
            script.src = file.replace("html", "js");
            script.type = "module";

            document.body.appendChild(script);
        });
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
