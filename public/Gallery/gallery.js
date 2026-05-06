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
// var keyArr = [".thumbnail", ".fileName", ".author", ".dateCreated", ".yearCreated", ".type.generalType"]
var keyArr = [
  { selector: ".thumbnail", key: "thumbnail", type: "img" },
  { selector: ".fileName", key: "fileName" },
  { selector: ".author", key: "author" },
  { selector: ".dateCreated", key: "dateCreated", translate: true },
  { selector: ".yearCreated", key: "yearCreated", prefix: " " },
  { selector: ".type.generalType", key: "type.generalType", translate: true }
];
var workOrganize = new Sort(`data/gallery.json`, workTemp, curOrganize, `#work`, keyArr)
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
    if (curOrganize == "Grid") {
        return
    }
    curOrganize = "Grid"
    workTemp = "workTemp1"
    changeColor(gridBtn, "#052854")
    changeColor(tileBtn, "#063B7D")
    localStorage.setItem("selectedOrganize", curOrganize)
    localStorage.setItem("workTemp", workTemp)
    workOrganize.clearWorkDiv()
    workOrganize = new Sort(`data/gallery.json`, workTemp, curOrganize, `#work`, keyArr)
    // workOrganize = null
    // console.log(workOrganize)
    sortWork(curSort, workOrganize)
}

tileBtn.onclick = function() {
    if (curOrganize == "Tile") {
        return
    }
    curOrganize = "Tile"
    workTemp = "workTemp2"
    changeColor(tileBtn, "#052854")
    changeColor(gridBtn, "#063B7D")
    localStorage.setItem("selectedOrganize", curOrganize)
    localStorage.setItem("workTemp", workTemp)
    // workOrganize = null
    workOrganize.clearWorkDiv()
    workOrganize = new Sort(`data/gallery.json`, workTemp, curOrganize, `#work`, keyArr)
    // workOrganize = null
    // console.log(workOrganize)
    sortWork(curSort, workOrganize)
    // console.log(workOrganize)
    // sortWork(curSort)
}

newBtn.onclick = function() {
    if (curSort == "newest") {
        return
    }
    curSort = "newest"
    localStorage.setItem("selectedSort", curSort);
    sortWork("clearWork", workOrganize)
    sortWork(curSort, workOrganize)
}
oldBtn.onclick = function() {
    if (curSort == "oldest") {
        return
    }
    curSort = "oldest"
    localStorage.setItem("selectedSort", curSort);
    sortWork("clearWork", workOrganize)
    sortWork(curSort, workOrganize)
}
alphabetBtn.onclick = function() {
    if (curSort == "alphabetical") {
        return
    }
    curSort = "alphabetical"
    localStorage.setItem("selectedSort", curSort);
    sortWork("clearWork", workOrganize)
    sortWork(curSort, workOrganize)
}
alphabetRevBtn.onclick = function() {
    if (curSort == "alphabeticalRev") {
        return
    }
    curSort = "alphabeticalRev"
    localStorage.setItem("selectedSort", curSort);
    sortWork("clearWork", workOrganize)
    sortWork(curSort, workOrganize)
}


// View work
document.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".view");

    if (!viewBtn) return;
    const work = e.target.closest('[id^="work"]')
    // console.log(e.target.parentElement.id)
    // var id = parseInt(e.target.parentElement.parentElement.parentElement.id.replace("work", ""))
    var id = parseInt(work.id.replace("work", ""))
    window.location.href = `./item.html?filenum=${id}`
});

// Download work
document.addEventListener("click", async (e) => {
    const downloadBtn = e.target.closest(".download");
    if (!downloadBtn) return;
    const work = e.target.closest('[id^="work"]')
    var id = parseInt(work.id.replace("work", ""))

    const file = await fetch(`data/gallery.json`)
    const res = await file.json()
    const link = res[id]["downloadPath"]
    showClipboardOverlay(1);
    const url = window.URL.createObjectURL(await (await fetch(link)).blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = link.split("/").pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
    
    // const blob = await file.blob()
})

// Copy link
document.addEventListener("click", async (e) => {
    const copyLinkBtn = e.target.closest(".copyLink");
    if (!copyLinkBtn) return;
    const work = e.target.closest('[id^="work"]')
    var id = parseInt(work.id.replace("work", ""))
    var url = `${window.location.origin}/Gallery/item.html?filenum=${id}`

    try {
        await navigator.clipboard.writeText(url);
        showClipboardOverlay(0);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
})

function showClipboardOverlay(i) {
    const overlay = document.getElementsByClassName("overlay")[i];
    overlay.classList.add('show');
    setTimeout(() => {overlay.classList.remove('show');}, 2000);
}