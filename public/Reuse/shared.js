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
    #keyArr;
    #sectionIndex = 0;
    #predefinedId;
    file = [];
    
    constructor(workTempName = "", sortMode = "", predefinedId = "", keyArr) {
        this.#keyArr = keyArr;
        this.WorkTempName = workTempName;
        this.sortMode = sortMode;
        this.#predefinedId = predefinedId;
    }

    // Main rendering engine called externally by the API fetcher
    renderData(data) {
        this.clearWorkDiv();
        this.file = data;
        this.#assignAndCreateWorkDiv();
    }
    
    #addToSection(i, sectionIndex) {
        const workElem = document.getElementById(this.WorkTempName);
        if (!workElem) return;

        const item = this.file[i];
        const div = document.createElement("div");
        
        div.id = `work${i}`;
        // Store absolute ID so URL linking doesn't get messed up by the new sorting index
        div.dataset.fileId = item.id ?? item.filenum ?? i; 
        div.classList.add(`work${this.sortMode}`);
        div.innerHTML = workElem.innerHTML;
        
        document.getElementById(`section${sectionIndex}`).appendChild(div);
    }

    assignInfo(idx = "") {
        if (idx !== "") {
            this.#bindData(idx);
            return;
        }
        
        for (let i = 0; i < this.file.length; i++) {
            this.#bindData(i);
        }
        
        const curLan = localStorage.getItem('selectedLanguage') || 'en';
        if (typeof translateData === "function") {
            translateData(curLan);
        }
    }

    #bindData(idx) {
        for (const config of this.#keyArr) {
            const selector = this.#predefinedId === "" 
                ? config.selector 
                : `${this.#predefinedId}${idx} ${config.selector}`;
            
            const access = document.querySelector(selector);
            if (!access) continue;

            const res = getNested(this.file[idx], config.key);

            if (config.translate) {
                access.setAttribute("idLan", res);
            } else if (config.type === "img") {
                access.src = `${window.location.origin}/${res}`;
            } else if (config.prefix) {
                access.innerHTML = `${config.prefix}${res}`;
            } else {
                access.innerHTML = res;
            }
        }
    }

    #assignAndCreateWorkDiv() {
        let sectionIndex = -1;
        const itemsPerSection = this.sortMode === "Grid" ? 3 : 1;

        for (let i = 0; i < this.file.length; i++) {
            if (i % itemsPerSection === 0) {
                sectionIndex++;
                this.#createSection(sectionIndex);
                
                const line = document.createElement("div");
                line.id = `sectionLine${sectionIndex}`;
                line.classList.add("sectionLine");
                document.getElementById(`section${sectionIndex}`).appendChild(line);
            }
            this.#addToSection(i, sectionIndex);
        }
        
        this.assignInfo();
        this.#sectionIndex = sectionIndex;
    }
    
    #createSection(sectionIndex) {
        const div = document.createElement("div");
        div.id = `section${sectionIndex}`;
        div.classList.add("section");
        
        const midpage = document.getElementById("midpage");
        if (midpage) midpage.appendChild(div);
    }

    clearWorkDiv() {
        for (let i = 0; i <= this.#sectionIndex; i++) {
            const elem = document.getElementById(`section${i}`);
            if (elem) elem.remove();
        }
        this.#sectionIndex = 0;
    }
}

export function showNotif(idLan) {
    var notificationTimer
    var curLan = localStorage.getItem('selectedLanguage') || 'en'

    var overlay = document.getElementById('overlay')
    var overlayTxt = overlay.querySelector('span')
    overlayTxt.setAttribute('idLan', idLan)
    translateData(curLan)
    overlay.classList.add("show")
    clearTimeout(notificationTimer)
    notificationTimer = setTimeout(() => {overlay.classList.remove("show")}, 3000)
}