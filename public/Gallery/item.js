import { loadFile, Sort, showNotif } from "../Reuse/shared.js";

// Load navbar and footer
loadFile("../Reuse/Navbar/navbar.html", "navbar");
loadFile("../Reuse/Footer/footer.html", "footer");

// Get the file ID from the URL
const params = new URLSearchParams(window.location.search);
const filenum = parseInt(params.get("filenum"), 10);

const API_URL = {
    "fileNum": `https://williamrover.servehttp.com/api/gallery?filenum=${filenum}`,
    "otherWork": `https://williamrover.servehttp.com/api/gallery/trio?order=`
}

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
    { selector: ".fileSize", key: "file_size" },
    { selector: ".descText", key: "description"}
];

const bindData = new Sort("", "", "", keyArr);

async function loadItem() {
    try {
        if (isNaN(filenum)) throw new Error("Invalid file number in URL.");

        const response = await fetch(API_URL["fileNum"]);
        if (!response.ok) throw new Error("Failed to fetch item data");
        
        const rawData = await response.json();
        
        console.log(rawData)
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

// import { Sort, showNotif } from "../Reuse/shared.js";

// --- Configuration & State ---
// Ensure API_URL.otherWork points to your trio endpoint, e.g.:
// API_URL.otherWork = "https://williamrover.servehttp.com/api/gallery/trio?order="
let curOrder = 1;
let maxOrder = 1;
const otherWorkCache = new Map();

// Matches the exact key configuration from gallery.js
const otherKeyArr = [
    { selector: ".thumbnail", key: "thumbnail", type: "img" },
    { selector: ".fileName", key: "file_name" },
    { selector: ".author", key: "authors" },
    { selector: ".dateCreated", key: "date_created", translate: true },
    { selector: ".yearCreated", key: "year_created", prefix: " " },
    { selector: ".type.generalType", key: "general_type", translate: true }
];

// Separate Sort instance scoped to "#work" (#work0, #work1, #work2)
const otherWorkOrganize = new Sort("workTemp1", "Grid", "#work", otherKeyArr);

// --- DOM Elements ---
const cont2 = document.querySelector(".cont2");
const prevOtherBtn = document.querySelector(".prevBtn");
const nextOtherBtn = document.querySelector(".nextBtn");

// Hide the raw #workTemp1 template so only rendered cards are visible
const workTempElem = document.getElementById("workTemp1");
if (workTempElem) {
    workTempElem.style.display = "none";
}

// --- API Fetch (with Cache) ---
async function fetchOtherWork(orderNum = 1) {
    if (otherWorkCache.has(orderNum)) {
        return otherWorkCache.get(orderNum);
    }

    try {
        const response = await fetch(API_URL["otherWork"] + String(orderNum));
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid content type received, expected JSON.");
        }

        const data = await response.json();
        otherWorkCache.set(orderNum, data); // Save to cache
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}

// --- Core Render Functions ---
function renderOtherWorkCards(data) {
    if (!cont2 || !workTempElem) return;

    // 1. Remove only previously generated #work0, #work1, #work2 divs (keep #workTemp1 intact)
    cont2.querySelectorAll('[id^="work"]:not(#workTemp1)').forEach(el => el.remove());

    // 2. Create #work0, #work1, #work2 inside .cont2 using the same structure as Sort.#addToSection
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const div = document.createElement("div");

        div.id = `work${i}`;
        div.dataset.fileId = item.id ?? item.file_num ?? item.filenum ?? i;
        div.classList.add(`work${otherWorkOrganize.sortMode}`);
        div.innerHTML = workTempElem.innerHTML;

        cont2.appendChild(div);
    }

    // 3. Hand data to Sort and run assignInfo() to bind fields and trigger translateData()
    otherWorkOrganize.file = data;
    otherWorkOrganize.assignInfo();
}

function updateOtherPagination() {
    if (!prevOtherBtn || !nextOtherBtn) return;
    prevOtherBtn.disabled = curOrder <= 1;
    nextOtherBtn.disabled = curOrder >= maxOrder;
}

async function loadOtherWork(orderNum = 1) {
    try {
        if (typeof filenum !== "undefined" && isNaN(filenum)) {
            throw new Error("Invalid file number in URL.");
        }

        curOrder = orderNum;
        const rawData = await fetchOtherWork(curOrder);

        if (rawData["pagination"]) {
            maxOrder = rawData["pagination"]["maxOrder"];
            updateOtherPagination();
        }

        const otherData = rawData["data"] || [];
        if (otherData.length === 0) {
            console.error(`No items found for order ${curOrder}.`);
            return;
        }

        renderOtherWorkCards(otherData);
    } catch (error) {
        console.error("Error loading other work:", error);
    }
}

// --- Pagination Button Listeners ---
if (prevOtherBtn && nextOtherBtn) {
    prevOtherBtn.addEventListener("click", () => {
        if (curOrder > 1) loadOtherWork(curOrder - 1);
    });

    nextOtherBtn.addEventListener("click", () => {
        if (curOrder < maxOrder) loadOtherWork(curOrder + 1);
    });
}
// --- Global Click Handlers (Event Delegation) ---
document.addEventListener("click", async (e) => {
    const viewBtn = e.target.closest(".view");
    // Match both carousel classes (.download, .copyLink) and main item IDs (#download, #copy)
    const downloadBtn = e.target.closest(".download, #download");
    const copyLinkBtn = e.target.closest(".copyLink, #copy");

    if (!viewBtn && !downloadBtn && !copyLinkBtn) return;

    // 1. Check if clicked inside one of the 3 otherWork cards (#work0, #work1, #work2)
    const work = e.target.closest('[id^="work"]:not(#workTemp1)');
    let item = null;

    if (work) {
        const index = parseInt(work.id.replace("work", ""));
        item = otherWorkOrganize.file[index];
    } else if (typeof bindData !== "undefined" && bindData.file?.length > 0) {
        // 2. Otherwise, use the main item's data for #download and #copy
        item = bindData.file[0];
    }

    if (!item) return;

    const fileId = item.file_num;

    // View work (otherWork cards)
    if (viewBtn) {
        window.location.href = `./item.html?filenum=${fileId}`;
        return;
    }

    // Download work (Main item #download OR otherWork .download)
    if (downloadBtn) {
        const link = item.download_path;
        showNotif("gallery.overlay.download");
        
        const blobRes = await fetch(link);
        const blob = await blobRes.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = link.split("/").pop();
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // Free up memory
        return;
    }

    // Copy link (Main item #copy OR otherWork .copyLink)
    if (copyLinkBtn) {
        const url = `${window.location.origin}/Gallery/item.html?filenum=${fileId}`;
        try {
            await navigator.clipboard.writeText(url);
            showNotif("gallery.overlay.copy");
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
});

// Initial launch
loadOtherWork(1);

// ==========================
// Modal Logic
// ==========================
const modal = document.querySelector('.fullscreen');
const modalImg = document.getElementById('fullscreen-img');
const modalDesc = document.getElementById('fullscreen-txt');
const modalClose = document.querySelector('.modal-close');

// Helper to check if a file path has a standard web image extension
function isImageFile(path) {
    if (!path) return false;
    return /\.(jpe?g|png|gif|webp|avif|svg|bmp)(\?.*)?$/i.test(path);
}

// Helper to format relative paths the same way Sort.#bindData does in shared.js
function formatAssetUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${window.location.origin}/${path.replace(/^\//, '')}`;
}

function openModal(imgUrl, imgTxt = '') {
    if (!modal || !modalImg || !modalDesc) return;
    modalImg.src = imgUrl;
    modalDesc.innerHTML = imgTxt;
    modal.classList.add('active');
}

if (modalClose && modal) {
    // Close modal when clicking the 'X'
    modalClose.onclick = () => {
        modal.classList.remove('active');
        modalImg.src = '';
    };

    // Close modal when clicking on the dark background outside the image
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            modalImg.src = '';
        }
    };
}

// --- Global Click Handlers (Event Delegation) ---
document.addEventListener("click", async (e) => {
    const viewBtn = e.target.closest(".view");
    const downloadBtn = e.target.closest(".download, #download");
    const copyLinkBtn = e.target.closest(".copyLink, #copy");
    const fullscreenBtn = e.target.closest(".controlPanel #fullscreen, #fullscreen-btn");

    if (!viewBtn && !downloadBtn && !copyLinkBtn && !fullscreenBtn) return;

    // 1. Check if clicked inside one of the 3 otherWork cards (#work0, #work1, #work2)
    const work = e.target.closest('[id^="work"]:not(#workTemp1)');
    let item = null;

    if (work) {
        const index = parseInt(work.id.replace("work", ""));
        item = otherWorkOrganize.file[index];
    } else if (typeof bindData !== "undefined" && bindData.file?.length > 0) {
        // 2. Otherwise, use the main item's data
        item = bindData.file[0];
    }

    if (!item) return;

    const fileId = item.file_num;

    // Fullscreen modal (Main item)
    if (fullscreenBtn) {
        const downloadPath = item.download_path;

        if (isImageFile(downloadPath)) {
            openModal(formatAssetUrl(downloadPath), "");
        } else {
            openModal(formatAssetUrl(item.thumbnail), "Item needs to be downloaded to view");
        }
        return;
    }

    // View work (otherWork cards)
    if (viewBtn) {
        window.location.href = `./item.html?filenum=${fileId}`;
        return;
    }

    // Download work (Main item #download OR otherWork .download)
    if (downloadBtn) {
        const link = item.download_path;
        showNotif("gallery.overlay.download");
        
        const blobRes = await fetch(link);
        const blob = await blobRes.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = link.split("/").pop();
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return;
    }

    // Copy link (Main item #copy OR otherWork .copyLink)
    if (copyLinkBtn) {
        const url = `${window.location.origin}/Gallery/item.html?filenum=${fileId}`;
        try {
            await navigator.clipboard.writeText(url);
            showNotif("gallery.overlay.copy");
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
});