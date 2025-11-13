// Lan button
var lanbtn = document.getElementById("lanbtnID");
var lanShow = false;
var r = document.querySelector(':root');
lanbtn.onclick = function() {
    if (lanShow == false) {
        lanShow = true;
        r.style.setProperty('--lan-show', "block");
        console.log(lanShow);
    } else {
        lanShow = false;
        r.style.setProperty('--lan-show', "none");
        console.log(lanShow)
    }
}

// theme button 
var time = new Date();
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
    if (l == true) {
        switchTheme("#E9F2FF", "#132235", "#13223526", "/Reuse/Navbar/lightMode.png", "Light mode");
    } else {
        switchTheme("#132235", "#E9F2FF", "#E9F2FF26", "/Reuse/Navbar/darkSwitch.png", "Dark mode");
    }
}
if (time.getHours() >= 6 && time.getHours() < 18) {
    var light = true
    themeBool();
} else if (time.getHours() >= 18 || time.getHours() < 6) {
    var light = false
    themeBool(false);
}
lida.onclick = function() {
    light = !light;
    themeBool(light);
    console.log(light);
}