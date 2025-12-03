import {loadFile} from "./Reuse/shared.js";
// Load navbar
loadFile("./Reuse/Navbar/navbar.html", "navbar");
var banner = document.getElementById("banner")
// Load footer
loadFile("./Reuse/Footer/footer.html", "footer");
// Main
import {checkTime} from "./Reuse/shared.js";
if (checkTime()) {
    banner.innerHTML = "<img src=\"./Homepage/bannerLight.png\">"
} else if (checkTime() == false) {
    banner.innerHTML = "<img src=\"./Homepage/bannerDark.png\">"
}

window.onclick = function() {
    var light = window.getComputedStyle(document.body).getPropertyValue('--light');
    if (light == 'true') {
        banner.innerHTML = "<img src=\"./Homepage/bannerLight.png\">"
    } else if (light == 'false') {
        banner.innerHTML = "<img src=\"./Homepage/bannerDark.png\">"
    }
}
