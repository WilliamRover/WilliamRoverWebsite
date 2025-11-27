// Lan button
var lanShow = false;
var r = document.querySelector(':root');
var lanbtn = document.getElementById("lanbtnID");

lanbtn.onclick = function() {
    if (lanShow == false) {
        r.style.setProperty('--lan-show', "block");
    } else {
        r.style.setProperty('--lan-show', "none");
    }
    lanShow = !lanShow;
}
document.addEventListener('click', (event => {
    if (!lanbtn.contains(event.target)) {
        lanShow = false;
        r.style.setProperty('--lan-show', "none");
    }
}))
// theme button 
var lida = document.getElementById("LDbtn");
var ldStatus = document.getElementById("ldStatus");
function switchTheme(bgColor, txtColor, lanShadow, ldFloat, ldColor, status) {
    r.style.setProperty('--bg-color', bgColor);
    r.style.setProperty('--txt-color', txtColor);
    r.style.setProperty('--lan-shadow', lanShadow);
    r.style.setProperty('--float-ld', ldFloat);
    r.style.setProperty('--ld-color', ldColor);
    ldStatus.innerHTML = status;
}
function themeBool(l = true) {
    if (l) {
        switchTheme("#E9F2FF", "#132235", "#13223526", "right", "#F7C215", "Light mode");
        // location.href='#light';
    } else {
        switchTheme("#132235", "#E9F2FF", "#E9F2FF26", "left", "#E9F2FF", "Dark mode");
        // location.href='#dark';
    }
}

import {checkTime} from "../../Reuse/shared.js";
if (checkTime()) {
    var light = true
    r.style.setProperty('--light', light);
    themeBool();
} else if (checkTime() == false) {
    var light = false
    r.style.setProperty('--light', light);
    themeBool(false);
}

lida.onclick = function() {
    light = !light;
    themeBool(light);
    r.style.setProperty('--light', light);
    if (light) {
        console.log("lights on")
    } else {
        console.log("lights off")
    }
}
