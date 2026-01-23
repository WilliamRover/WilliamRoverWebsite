import {loadFile} from "../Reuse/shared.js";
import {translateData} from "../lang.js";
// Load navbar
loadFile("../Reuse/Navbar/navbar.html", "navbar");
// Load footer
loadFile("../Reuse/Footer/footer.html", "footer");

function getNested(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
}

// Sort funcs
class Sort {
    #key;
    #sectionIndex = 0
    ready
    constructor(filePath) {
        this.ready = fetch(filePath).then(response => {
        return response.json();
        }).then(file => {
            this.file = file
            this.fileLen = Object.keys(file).length
        })
        this.#key = [".thumbnail", ".fileName", ".author", ".dateCreated", ".yearCreated", ".type.generalType"]
    }
    
    #addToSection(i, sectionIndex) {
        var work = document.getElementById("workTemp1")
        let div = document.createElement("div")
        div.id = "work".concat(i)
        div.classList.add("work")
        // console.log(div.id)
        div.innerHTML = work.innerHTML
        // console.log("section".concat(sectionIndex))
        document.getElementById("section".concat(sectionIndex)).appendChild(div)
    }

    #assignInfo() {
        for (let i = 0; i < this.fileLen; i++) {
            for (let j = 0; j < this.#key.length; j++) {
                if (j == 5) {
                    var access = document.querySelector(`#work${i} .type\\.generalType`)
                } else {
                    var access = document.querySelector(`#work${i} ${this.#key[j]}`)
                }
                var res = getNested(this.file[i], this.#key[j].replace('.', ''))
                
                if (j == 3 || j == 5) {
                    var curLan = localStorage.getItem('selectedLanguage') || 'en';
                    access.setAttribute("idLan", res)
                    translateData(curLan)
                }
                if (j == 4) {
                    res = ' '.concat(res)
                }
                if (j == 0) {
                    access.src = res
                    continue
                }
                access.innerHTML = res
            }
        }
    }
    // In the JSON, the order is already listed from oldest to newest
    #assignAndCreateWorkDiv(Arr) {
        var sectionIndex = -1
        for (let i = 0; i < Arr.length; i++) {
            if (i % 3 == 0) {
                sectionIndex ++
                this.#createSection(sectionIndex)
            }
            this.#addToSection(Arr[i], sectionIndex)
        }
        this.#assignInfo()
        this.#sectionIndex = sectionIndex
        console.log(this.#sectionIndex)
    }
    #sortAlphabetically() {
        var workNameArr = []
        for (let i = 0; i < this.fileLen; i++) {
            workNameArr.push(this.file[i]["fileName"])
        }
        var workNameSort = workNameArr.toSorted()
        var workIndexArr = []
        for (let i = 0; i < workNameSort.length; i++) {
            for (let j = 0; j < workNameArr.length; j++) {
                if (workNameArr[j] == workNameSort[i]) {
                    workIndexArr.push(j)
                    break
                }
            }
        }
        return workIndexArr
    }
    
    #createSection(sectionIndex) {
        let div = document.createElement("div")
        div.id = "section".concat(sectionIndex)
        div.classList.add("section")
        document.getElementById("midpage").appendChild(div)
    }

    sortOldest() {
        this.#assignAndCreateWorkDiv(Object.keys(this.file))
    }

    sortNewest() {
        this.#assignAndCreateWorkDiv(Object.keys(this.file).reverse())
    }


    sortAtoZ() {
        var workIndexArr = this.#sortAlphabetically()
        this.#assignAndCreateWorkDiv(workIndexArr)
    }
    
    sortZtoA() {
        var workIndexArr = this.#sortAlphabetically().reverse()
        this.#assignAndCreateWorkDiv(workIndexArr)
    }

    clearWorkDiv() {
        for (let i = 0; i <= this.#sectionIndex; i++) {
            console.log(i)
            let elem = document.getElementById("section".concat(i))
            elem.remove()
        }
        this.#sectionIndex = 0
    }
}
// fetch(`./Data/gallery.json`).then(response => {
//         return response.json();
//         }).then(file => {
//             new Sort(file).sortNewest()
//         })
var workSort = new Sort(`./Data/gallery.json`)
function sortWork(curSort) {
    workSort.ready.then(() => {
        switch (curSort) {
            case "newest":
                workSort.sortNewest()
                break
            case "oldest":
                workSort.sortOldest()
                break
            case "alphabetical":
                workSort.sortAtoZ()
                break
            case "alphabeticalRev":
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
sortWork(curSort)
var newBtn = document.getElementById("newest")
var oldBtn = document.getElementById("oldest")
var alphabetBtn = document.getElementById("alphabetical")
var alphabetRevBtn = document.getElementById("alphabeticalRev")

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