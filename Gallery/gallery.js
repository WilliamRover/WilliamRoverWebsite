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


function sortWork(curSort, workClass) {
    changeColor(prevBtn, "#063B7D")
    workClass.ready.then(() => {
        // console.log(workClass)
        switch (curSort) {
            case "newest":
                changeColor(newBtn, "#052854")
                prevBtn = newBtn
                workClass.sortNewest()
                break
            case "oldest":
                changeColor(oldBtn, "#052854")
                prevBtn = oldBtn
                workClass.sortOldest()
                break
            case "alphabetical":
                changeColor(alphabetBtn, "#052854")
                prevBtn = alphabetBtn
                workClass.sortAtoZ()
                break
            case "alphabeticalRev":
                changeColor(alphabetRevBtn, "#052854")
                prevBtn = alphabetRevBtn
                workClass.sortZtoA()
                break
            case "clearWork":
                workClass.clearWorkDiv()
                return
        }
    })
}
// // newest, oldest, AtoZ, ZtoA
var curSort = localStorage.getItem("selectedSort") || "newest"
var curOrganize = localStorage.getItem("selectedOrganize") || "Grid"

var workTemp = localStorage.getItem("workTemp") || "workTemp1"
var keyArr = [".thumbnail", ".fileName", ".author", ".dateCreated", ".yearCreated", ".type.generalType"]
var workOrganize = new Sort(`./Data/gallery.json`, workTemp, curOrganize, keyArr)
// // console.log(curSort)
var prevBtn;
sortWork(curSort, workOrganize)
var newBtn = document.getElementById("sortBtnNewest")
var oldBtn = document.getElementById("sortBtnOldest")
var alphabetBtn = document.getElementById("sortBtnAlphabetical")
var alphabetRevBtn = document.getElementById("sortBtnAlphabeticalRev")

var gridBtn = document.getElementById("sortGrid")
var tileBtn = document.getElementById("sortTile")

function changeColor(obj, color) {
    try {
        obj.style.backgroundColor = color;
    } catch (error) {
        return;
    }
}
if (curOrganize == "Grid") {
    changeColor(gridBtn, "#052854")
} else {
    changeColor(tileBtn, "#052854")
}
gridBtn.onclick = function() {
    curOrganize = "Grid"
    workTemp = "workTemp1"
    changeColor(gridBtn, "#052854")
    changeColor(tileBtn, "#063B7D")
    localStorage.setItem("selectedOrganize", curOrganize)
    localStorage.setItem("workTemp", workTemp)
    workOrganize.clearWorkDiv()
    workOrganize = new Sort(`./Data/gallery.json`, workTemp, curOrganize, keyArr)
    // workOrganize = null
    // console.log(workOrganize)
    sortWork(curSort, workOrganize)
}

tileBtn.onclick = function() {
    curOrganize = "Tile"
    workTemp = "workTemp2"
    changeColor(tileBtn, "#052854")
    changeColor(gridBtn, "#063B7D")
    localStorage.setItem("selectedOrganize", curOrganize)
    localStorage.setItem("workTemp", workTemp)
    // workOrganize = null
    workOrganize.clearWorkDiv()
    workOrganize = new Sort(`./Data/gallery.json`, workTemp, curOrganize, keyArr)
    // workOrganize = null
    // console.log(workOrganize)
    sortWork(curSort, workOrganize)
    // console.log(workOrganize)
    // sortWork(curSort)
}

newBtn.onclick = function() {
    curSort = "newest"
    localStorage.setItem("selectedSort", curSort);
    sortWork("clearWork", workOrganize)
    sortWork(curSort, workOrganize)
}
oldBtn.onclick = function() {
    curSort = "oldest"
    localStorage.setItem("selectedSort", curSort);
    sortWork("clearWork", workOrganize)
    sortWork(curSort, workOrganize)
}
alphabetBtn.onclick = function() {
    curSort = "alphabetical"
    localStorage.setItem("selectedSort", curSort);
    sortWork("clearWork", workOrganize)
    sortWork(curSort, workOrganize)
}
alphabetRevBtn.onclick = function() {
    curSort = "alphabeticalRev"
    localStorage.setItem("selectedSort", curSort);
    sortWork("clearWork", workOrganize)
    sortWork(curSort, workOrganize)
}
