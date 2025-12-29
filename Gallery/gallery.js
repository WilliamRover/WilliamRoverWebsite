import {loadFile} from "../Reuse/shared.js";
// Load navbar
loadFile("../Reuse/Navbar/navbar.html", "navbar");
// Load footer
loadFile("../Reuse/Footer/footer.html", "footer");

// DO THINGS HERE
fetch(`./Data/gallery.json`).then(response => {
    return response.json();
    }).then(file => {
        var dataLen = Object.keys(file).length

        // Create work divs
        var sectionIndex = -1
        for (let i = 0; i < dataLen; i++) {
            if (i % 3 == 0) {
                sectionIndex ++
                let div = document.createElement("div")
                div.id = "section".concat(sectionIndex)
                div.classList.add("section")
                document.getElementById("midpage").appendChild(div)

            }
            createWorkDiv(i, sectionIndex)
        }

        // Set custom attribute for each work div
        var key = [".thumbnail", ".fileName", ".author", ".dateCreated", ".type.generalType"] // IF ADD EXTRA INFO, MAKE SURE TO PUT IN THIS ARR
        for (let i = 0; i < dataLen; i++) {
            for (let j = 0; j < key.length; j++) {
                if (j == 4) {
                    var access = document.querySelector(`#work${i} .type\\.generalType`)
                } else {
                    var access = document.querySelector(`#work${i} ${key[j]}`)
                }
                var res = getNested(file[i], key[j].replace('.', ''))
                console.log(access)
                console.log(res)

                if (j == 0) {
                    access.src = res
                    continue
                }
                access.innerHTML = res
            }
        }
    })

function createWorkDiv(i, sectionIndex) {
    var work = document.getElementById("workTemp")
    let div = document.createElement("div")
    div.id = "work".concat(i)
    div.classList.add("work")
    // console.log(div.id)
    div.innerHTML = work.innerHTML
    document.getElementById("section".concat(sectionIndex)).appendChild(div)
}




// Assigning data
function getNested(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
}

// fetch(`./Data/gallery.json`).then(response => {
//     return response.json();
//     }).then(file => {
//         let dataLen = Object.keys(file).length
//         // console.log(dataLen)
//         for (let i = 0; i < dataLen; i++) {
//             let dataGal = document.querySelectorAll(`[idGal]`)
//             let data = dataGal[i].getAttribute("idGal")
//             for (let j = 0; j < 20; j++) {
//                 var res = getNested(file[j], data)
//             }
//             console.log(data)
//             console.log(res)
//             if (data == "thumbnail") {
//                 dataGal[i].src = res
//                 continue
//             }
//             dataGal[i].innerHTML = res
//         }
//     })
