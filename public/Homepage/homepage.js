import {loadFile} from "../Reuse/shared.js";
// Load navbar
loadFile("../Reuse/Navbar/navbar.html", "navbar");
// Load footer
loadFile("../Reuse/Footer/footer.html", "footer");
// Main
// import {checkTime} from "../Reuse/shared.js";
var banner = document.getElementById("banner")
var light = localStorage.getItem("light")
console.log(light)
if (light == "true") {
    banner.innerHTML = "<img src=\".\\img\\bannerLight.webp\">"
} else if (light == "false") {
    banner.innerHTML = "<img src=\".\\img\\bannerDark.webp\">"
}

window.onclick = function() {
    var light = window.getComputedStyle(document.body).getPropertyValue('--light');
    if (light == "true") {
        banner.innerHTML = "<img src=\".\\img\\bannerLight.webp\">"
    } else if (light == "false") {
        banner.innerHTML = "<img src=\".\\img\\bannerDark.webp\">"
    }
}
