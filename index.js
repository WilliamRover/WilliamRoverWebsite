import {loadFile} from "./Reuse/shared.js";
// Load navbar
loadFile("./Reuse/Navbar/navbar.html", "navbar");
var banner = document.getElementById("banner")

import {checkTime} from "./Reuse/shared.js";
if (checkTime()) {
    banner.innerHTML = "<img src=\"./Pages/Homepage/bannerLight.png\">"
} else if (checkTime() == false) {
    banner.innerHTML = "<img src=\"./Pages/Homepage/bannerDark.png\">"
}

window.onclick = function() {
    var light = window.getComputedStyle(document.body).getPropertyValue('--light');
    if (light == 'true') {
        banner.innerHTML = "<img src=\"./Pages/Homepage/bannerLight.png\">"
    } else if (light == 'false') {
        banner.innerHTML = "<img src=\"./Pages/Homepage/bannerDark.png\">"
    }
}