import {loadFile} from "./Reuse/shared.js";
// Load navbar
loadFile("./Reuse/Navbar/navbar.html", "navbar");


var banner = document.getElementById("banner")
console.stdlog = console.log.bind(console);
console.logs = [];
function readConsole() {
    console.log = function(){
        console.logs.push(Array.from(arguments));
        console.stdlog.apply(console, arguments);
    }
    return console.logs
}
function light() {
    try {
        if (console.logs[0][0] == "lights on") {
            banner.innerHTML = "<img src=\"./Pages/Homepage/bannerLight.png\">"
        } else if(console.logs[0][0] == "lights off") {
            banner.innerHTML = "<img src=\"./Pages/Homepage/bannerDark.png\">"
        }
    } catch (error) {
        console.log("Nothing happened")
    }
    console.logs.length = 0;
}

import {checkTime} from "./Reuse/shared.js";
if (checkTime()) {
    banner.innerHTML = "<img src=\"./Pages/Homepage/bannerLight.png\">"
} else if (checkTime() == false) {
    banner.innerHTML = "<img src=\"./Pages/Homepage/bannerDark.png\">"
}

window.onclick = function() {
    readConsole()
    light()
}