// var lanArr = ["../lang/en.json", "../lang/fi.json", "../lang/vn.json"]
// // Fetch json
// fetch(lanArr[2]).then(response => {
  //   return response.json();
  // }).then(file => {
    //   // DO THINGS HERE
    //   console.log(file["navbar"]["lan"]["curLan"])
    //   a[0].innerHTML = file["homepage"]["desc"]
// })
// function printNested(obj) {
//   if (typeof obj === 'object') {
//     for (let key in obj) {
//       printNested(obj[key]);
//     }
//   } else {
//     console.log(obj);
//   }
// }
function getNested(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
}
// Only apply to innerHTML
// export function translateData(lan) {
//   fetch(`../lang/${lan}.json`).then(response => {
//     return response.json();
//   }).then(file => {
//     // DO THINGS HERE
//     let a = document.querySelectorAll("[idLan]")
//     for (let i = 0; i < a.length; i++) {
//       var b = a[i].getAttribute("idLan")
//       var res = getNested(file, b)
//       a[i].innerHTML = res
//       // console.log(res)
//       // printNested(file[pageName])
//     }
//   })
// }
export async function translateData(lan) {
  try {
    const response = await fetch(`${window.location.origin}/data/lang/${lan}.json`);
    const file = await response.json();

    const elements = document.querySelectorAll("[idLan]");

    elements.forEach(el => {
      const key = el.getAttribute("idLan");
      const res = getNested(file, key);

      if (res !== undefined) {
        el.innerHTML = res;
      }
    });

  } catch (error) {
    console.error("Translation loading failed:", error);
  }
}