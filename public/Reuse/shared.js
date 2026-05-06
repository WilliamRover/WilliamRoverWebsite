// Load file
export function loadFile(file, id) {
    // gonna be honest chatGPT write this line
    fetch(file).then(response => response.text()).then(html => {
            // 1. Insert the HTML
            document.getElementById(id).innerHTML = html;

            // 2. THEN load and run the JS
            const script = document.createElement("script");
            script.src = file.replace("html", "js");
            script.type = "module";

            document.body.appendChild(script);

            return true;
        });
}
// Check time
var time = new Date();
export function checkTime() {
    if (time.getHours() >= 6 && time.getHours() < 18) {
        return true
    } else if (time.getHours() >= 18 || time.getHours() < 6) {
        return false
    }
}

import {translateData} from "../lang.js";
function getNested(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
}


export class Sort {
    #key
    #sectionIndex = 0
    ready
    #predefinedId
    constructor(filePath, WorkTempName="", sortMode="", predefinedId="", keyArr) {
        this.ready = fetch(filePath).then(response => {
        return response.json();
        }).then(file => {
            this.file = file
            this.fileLen = Object.keys(file).length
        })
        this.#key = keyArr
        this.WorkTempName = WorkTempName
        this.sortMode = sortMode
        this.#predefinedId = predefinedId
        // this.sectionTempName = sectionTempName
    }
    
    #addToSection(i, sectionIndex) {
        var work = document.getElementById(this.WorkTempName)
        let div = document.createElement("div")
        div.id = "work".concat(i)
        div.classList.add("work".concat(this.sortMode))
        // console.log(div.id)
        div.innerHTML = work.innerHTML
        // console.log("section".concat(sectionIndex))
        document.getElementById("section".concat(sectionIndex)).appendChild(div)
    }

    assignInfo(idx="") {
        if (idx !== "") {
            this.#bindData(idx)
            return
        }
        for (let i = 0; i < this.fileLen; i++) {
            this.#bindData(i)
        }
        var curLan = localStorage.getItem('selectedLanguage') || 'en';
        // access.setAttribute("idLan", res)
        translateData(curLan)
    }

    #bindData(idx) {
        for (let j = 0; j < this.#key.length; j++) {
            // if (j == 5) {
            //     var access = document.querySelector(`#work${i} .type\\.generalType`)
            // } else {
            //     var access = document.querySelector(`#work${i} ${this.#key[j]}`)
            // }
            // var res = getNested(this.file[i], this.#key[j].replace('.', ''))
            
            // if (j == 3 || j == 5) {
            //     var curLan = localStorage.getItem('selectedLanguage') || 'en';
            //     access.setAttribute("idLan", res)
            //     translateData(curLan)
            // }
            // if (j == 4) {
            //     res = ' '.concat(res)
            // }
            // if (j == 0) {
            //     access.src = res
            //     continue
            // }
            // access.innerHTML = res
            var config = this.#key[j]
            if (this.#predefinedId == "") {
                var access = document.querySelector(`${config["selector"]}`)
            } else {
                var access = document.querySelector(`${this.#predefinedId + idx + " "}${config["selector"]}`)
            }
            if (!access) {
                continue
            }
            // console.log(j)
            var res = getNested(this.file[idx], config["key"])
            // console.log(res)

            // console.log(res)
            if (config["translate"]) {
                access.setAttribute("idLan", res)
                continue
            }

            if (config["type"] == "img") {
                access.src = window.location.origin + '/' +res
                // console.log(res)
                continue
            }

            if (config["prefix"]) {
                access.innerHTML = config["prefix"].concat(res)
                continue
            }

            access.innerHTML = res
        }
    }
    // In the JSON, the order is already listed from oldest to newest
    #assignAndCreateWorkDiv(Arr) {
        var sectionIndex = -1
        for (let i = 0; i < Arr.length; i++) {
            if (i % 3 == 0 && this.sortMode == "Grid") {
                sectionIndex ++
                this.#createSection(sectionIndex)
                let div = document.createElement("div")
                div.id = "sectionLine".concat(sectionIndex)
                div.classList.add("sectionLine")
                document.getElementById("section".concat(sectionIndex)).appendChild(div)
            }
            if (this.sortMode == "Tile") {
                sectionIndex ++
                this.#createSection(sectionIndex)
                let div = document.createElement("div")
                div.id = "sectionLine".concat(sectionIndex)
                div.classList.add("sectionLine")
                document.getElementById("section".concat(sectionIndex)).appendChild(div)
            }
            this.#addToSection(Arr[i], sectionIndex)
        }
        this.assignInfo()
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
            // console.log(i)
            let elem = document.getElementById("section".concat(i))
            elem.remove()
        }
        this.#sectionIndex = 0
    }
}

