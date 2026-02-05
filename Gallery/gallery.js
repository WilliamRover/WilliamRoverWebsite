import {loadFile} from "../Reuse/shared.js";


// Load navbar
loadFile("../Reuse/Navbar/navbar.html", "navbar");
// Load footer
loadFile("../Reuse/Footer/footer.html", "footer");


import {Sort} from "../Reuse/shared.js";

// Sort funcs

// fetch(`./Data/gallery.json`).then(response => {
//         return response.json();
//         }).then(file => {
//             new Sort(file).sortNewest()
//         })

var workSort = new Sort(`./Data/gallery.json`, "workTemp1", "Grid")
function sortWork(curSort) {
    changeColor(prevBtn, "#063B7D")
    workSort.ready.then(() => {
        switch (curSort) {
            case "newest":
                changeColor(newBtn, "#052854")
                prevBtn = newBtn
                workSort.sortNewest()
                break
            case "oldest":
                changeColor(oldBtn, "#052854")
                prevBtn = oldBtn
                workSort.sortOldest()
                break
            case "alphabetical":
                changeColor(alphabetBtn, "#052854")
                prevBtn = alphabetBtn
                workSort.sortAtoZ()
                break
            case "alphabeticalRev":
                changeColor(alphabetRevBtn, "#052854")
                prevBtn = alphabetRevBtn
                workSort.sortZtoA()
                break
            case "clearWork":
                workSort.clearWorkDiv()
                break
        }
    })
}

// // newest, oldest, AtoZ, ZtoA
var curSort = localStorage.getItem("selectedSort") || "newest"
// // console.log(curSort)
var prevBtn;
sortWork(curSort)
var newBtn = document.getElementById("sortBtnNewest")
var oldBtn = document.getElementById("sortBtnOldest")
var alphabetBtn = document.getElementById("sortBtnAlphabetical")
var alphabetRevBtn = document.getElementById("sortBtnAlphabeticalRev")

function changeColor(obj, color) {
    try {
        obj.style.backgroundColor = color;
    } catch (error) {
        return;
    }
}
newBtn.onclick = function() {
    curSort = "newest"
    localStorage.setItem("selectedSort", curSort);
    sortWork("clearWork")
    sortWork(curSort)
}
oldBtn.onclick = function() {
    curSort = "oldest"
    localStorage.setItem("selectedSort", curSort);
    sortWork("clearWork")
    sortWork(curSort)
}
alphabetBtn.onclick = function() {
    curSort = "alphabetical"
    localStorage.setItem("selectedSort", curSort);
    sortWork("clearWork")
    sortWork(curSort)
}
alphabetRevBtn.onclick = function() {
    curSort = "alphabeticalRev"
    localStorage.setItem("selectedSort", curSort);
    sortWork("clearWork")
    sortWork(curSort)
}