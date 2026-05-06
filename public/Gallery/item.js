import {loadFile} from "../Reuse/shared.js";
// Load navbar
loadFile("../Reuse/Navbar/navbar.html", "navbar");
// Load footer
loadFile("../Reuse/Footer/footer.html", "footer");

const params = new URLSearchParams(window.location.search)
const filenum = parseInt(params.get("filenum"))
import {Sort} from "../Reuse/shared.js";

var keyArr = [
  { selector: ".thumbnail", key: "thumbnail", type: "img" },
  { selector: ".fileName", key: "fileName" },
  { selector: ".author", key: "author" },
  { selector: ".dateCreated", key: "dateCreated", translate: true },
  { selector: ".yearCreated", key: "yearCreated", prefix: " " },
  { selector: ".type.generalType", key: "type.generalType", translate: true },
  { selector: ".type.fileType", key: "type.fileType"},
  { selector: ".dimension", key: "dimension" },
  { selector: ".fileSize", key: "fileSize" }
];
var bindData = new Sort(`${window.location.origin}/data/gallery.json`, "", "", "", keyArr)
bindData.ready.then(() => {
    console.log(filenum)
    console.log(bindData)
    bindData.assignInfo(filenum)
})