var opacity = 0;
var time = new Date();
var r = document.querySelector(':root');
console.log(time.getHours());

function fadeOutEffect() {
    var fadeTarget = document.getElementById("location");
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.05;
        } else {
            clearInterval(fadeEffect);
        }
    }, 200);
}
fadeOutEffect();

if (time.getHours() >= 6 && time.getHours() < 12) {
    opacity = 1;
    r.style.setProperty('--opacityDAY', 1);
} else if (time.getHours() >= 12 && time.getHours() < 18) {
    opacity = 2;
    r.style.setProperty('--opacityDAY', 0);
    r.style.setProperty('--opacityDAWN', 1);
} else if (time.getHours() >= 18 || time.getHours() < 6) {
    opacity = 3;
    r.style.setProperty('--opacityDAWN', 0);
    r.style.setProperty('--opacityDAY', 0);
}

console.log(opacity);

document.getElementById("button").onclick = function() {
    if (opacity == 1) {
        opacity ++;
        console.log(opacity);
        r.style.setProperty('--opacityDAWN', 1);
        r.style.setProperty('--opacityDAY', 0);
    } else if (opacity == 2) {
        opacity ++;
        console.log(opacity);
        r.style.setProperty('--opacityDAWN', 0);
        r.style.setProperty('--opacityDAY', 0);
    } else if (opacity == 3) {
        opacity = 1;
        console.log(opacity);
        r.style.setProperty('--opacityDAY', 1);
    }
}