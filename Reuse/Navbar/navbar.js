// Lan button
var lanShow = false;
var r = document.querySelector(':root');
window.onload = function() {
    var lanbtn = document.getElementById("lanbtnID");
    lanbtn.onclick = function() {
        if (lanShow == false) {
            lanShow = true;
            r.style.setProperty('--lan-show', "block");
        } else {
            lanShow = false;
            r.style.setProperty('--lan-show', "none");
        }
    }

}

// theme button 
var lida = document.getElementById("LDbtn");
var ldStatus = document.getElementById("ldStatus");
function switchTheme(bgColor, txtColor, lanShadow, switchImg, status) {
    r.style.setProperty('--bg-color', bgColor);
    r.style.setProperty('--txt-color', txtColor);
    r.style.setProperty('--lan-shadow', lanShadow);
    lida.innerHTML = "<img src=\"".concat(switchImg, "\" width=\"37.5px\" height=\"18px\">")
    ldStatus.innerHTML = status;
}
function themeBool(l = true) {
    if (l) {
        switchTheme("#E9F2FF", "#132235", "#13223526", "./Reuse/Navbar/lightMode.png", "Light mode");
        // location.href='#light';
    } else {
        switchTheme("#132235", "#E9F2FF", "#E9F2FF26", "./Reuse/Navbar/darkSwitch.png", "Dark mode");
        // location.href='#dark';
    }
}

import {checkTime} from "../../Reuse/shared.js";
if (checkTime()) {
    var light = true
    themeBool();
} else if (checkTime() == false) {
    var light = false
    themeBool(false);
}

lida.onclick = function() {
    light = !light;
    themeBool(light);
    if (light) {
        console.log("lights on")
    } else {
        console.log("lights off")
    }
}
