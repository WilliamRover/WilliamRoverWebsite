import { loadFile, Sort } from "../Reuse/shared.js";

// Load navbar and footer
loadFile("../Reuse/Navbar/navbar.html", "navbar");
loadFile("../Reuse/Footer/footer.html", "footer");

// Get the file ID from the URL
const params = new URLSearchParams(window.location.search);
const filenum = parseInt(params.get("filenum"), 10);

const API_URL = `https://williamrover.servehttp.com/api/gallery?filenum=${filenum}`;

// Updated mapping to match the new backend API keys
const keyArr = [
    { selector: ".thumbnail", key: "thumbnail", type: "img" },
    { selector: ".fileName", key: "file_name" },
    { selector: ".author", key: "authors" },
    { selector: ".dateCreated", key: "date_created", translate: true },
    { selector: ".yearCreated", key: "year_created", prefix: " " },
    { selector: ".type.generalType", key: "general_type", translate: true },
    { selector: ".type.fileType", key: "file_types" },
    { selector: ".dimension", key: "dimension" },
    { selector: ".fileSize", key: "file_size" }
];

const bindData = new Sort("", "", "", keyArr);

async function loadItem() {
    try {
        if (isNaN(filenum)) throw new Error("Invalid file number in URL.");

        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch item data");
        
        const rawData = await response.json();
        
        let item = null;
        if (rawData.data && Array.isArray(rawData.data)) {
            item = rawData.data[0];
        } else if (Array.isArray(rawData)) {
            item = rawData[0];
        } else {
            item = rawData; 
        }

        if (!item || item.file_num === undefined) {
            console.error(`Item with file_num ${filenum} not found.`);
            return;
        }
        bindData.file = [item];
        
        bindData.assignInfo(0);
        
    } catch (error) {
        console.error("Error loading item:", error);
    }
}

loadItem();