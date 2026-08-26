import { loadFile, Sort, showNotif } from "../Reuse/shared.js";

// Load navbar and footer
loadFile("../Reuse/Navbar/navbar.html", "navbar");
loadFile("../Reuse/Footer/footer.html", "footer");

// --- Configuration & Initialization ---
const API_URL = { gallery: "https://williamrover.servehttp.com/api/gallery" };
const COLORS = { ACTIVE: "#052854", INACTIVE: "#063B7D" };

// Map old localStorage values to the new API format safely
const LEGACY_SORT_MAP = {
    "alphabetical": "a-z",
    "alphabeticalRev": "z-a"
};

let rawSort = localStorage.getItem("selectedSort") || "newest";
let curSort = LEGACY_SORT_MAP[rawSort] || rawSort;
let curOrganize = localStorage.getItem("selectedOrganize") || "Grid";
let workTemp = localStorage.getItem("workTemp") || "workTemp1";

// Global Pagination State
let curPage = 1;
let totalPages = 1;

const mobileQuery = window.matchMedia("(max-width: 768px)");

if (mobileQuery.matches) {
    curOrganize = "Grid";
    workTemp = "workTemp1";
}

const keyArr = [
    { selector: ".thumbnail", key: "thumbnail", type: "img" },
    { selector: ".fileName", key: "file_name" },
    { selector: ".author", key: "authors" },
    { selector: ".dateCreated", key: "date_created", translate: true },
    { selector: ".yearCreated", key: "year_created", prefix: " " },
    { selector: ".type.generalType", key: "general_type", translate: true }
];

// --- DOM Elements ---
const sortBtns = {
    "newest": document.getElementById("sortBtnNewest"),
    "oldest": document.getElementById("sortBtnOldest"),
    "a-z": document.getElementById("sortBtnAlphabetical"),
    "z-a": document.getElementById("sortBtnAlphabeticalRev")
};

const layoutBtns = {
    Grid: document.getElementById("sortGrid"),
    Tile: document.getElementById("sortTile")
};

let prevBtn = sortBtns[curSort] || sortBtns["newest"];
let workOrganize = new Sort(workTemp, curOrganize, `#work`, keyArr); // Instantiated without file path

// --- API Fetch ---
async function fetchGallery(sortType, pageNum = 1) {
    try {
        const response = await fetch(`${API_URL.gallery}?sort=${sortType}&page=${pageNum}`);
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid content type received, expected JSON.");
        }
        return await response.json(); 
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}

// --- Core Functions ---
function changeColor(obj, color) {
    if (obj && obj.style) {
        obj.style.backgroundColor = color;
    }
}

async function loadAndSortWork(sortType, pageNum = 1) {
    changeColor(prevBtn, COLORS.INACTIVE);

    const activeBtn = sortBtns[sortType];
    if (activeBtn) {
        changeColor(activeBtn, COLORS.ACTIVE);
        prevBtn = activeBtn;
    }

    curSort = sortType;
    curPage = pageNum; // Sync current page state
    localStorage.setItem("selectedSort", curSort);
    
    // Fetch newly sorted and paginated data
    const rawData = await fetchGallery(curSort, curPage);
    
    // Update pagination state and UI
    if (rawData["pagination"]) {
        totalPages = rawData["pagination"]["totalPages"];
        renderPagination();
    }

    const sortedData = rawData["data"] || [];
    
    // workOrganize.renderData() automatically clears the old container in shared.js
    workOrganize.renderData(sortedData); 
}

function handleLayoutChange(type, temp) {
    if (curOrganize === type) return;
    
    // Block switching to Tile mode if on mobile
    if (mobileQuery.matches && type === "Tile") return; 

    curOrganize = type;
    workTemp = temp;
    
    changeColor(layoutBtns[type], COLORS.ACTIVE);
    changeColor(layoutBtns[type === "Grid" ? "Tile" : "Grid"], COLORS.INACTIVE);
    
    if (!mobileQuery.matches) {
        localStorage.setItem("selectedOrganize", curOrganize);
        localStorage.setItem("workTemp", workTemp);
    }
    
    const existingData = workOrganize.file;
    workOrganize.clearWorkDiv();
    workOrganize = new Sort(workTemp, curOrganize, `#work`, keyArr);
    if (existingData.length > 0) {
        workOrganize.renderData(existingData);
    }
}

// --- Event Listeners: Sorting & Layout ---
layoutBtns.Grid.onclick = () => {
    handleLayoutChange("Grid", "workTemp1");
    showNotif("gallery.overlay.grid")
}
layoutBtns.Tile.onclick = () => {
    handleLayoutChange("Tile", "workTemp2")
    showNotif("gallery.overlay.tiles")
}

Object.entries(sortBtns).forEach(([type, btn]) => {
    if (btn) btn.onclick = () => {
        // When user changes sorting, always reset to page 1
        if (curSort !== type) loadAndSortWork(type, 1); 
    };
});

// Set initial layout colors & trigger initial fetch
changeColor(layoutBtns[curOrganize], COLORS.ACTIVE);
changeColor(layoutBtns[curOrganize === "Grid" ? "Tile" : "Grid"], COLORS.INACTIVE);

// Launch the initial load!
loadAndSortWork(curSort, curPage);

// --- Global Click Handlers (Event Delegation) ---
document.addEventListener("click", async (e) => {
    const viewBtn = e.target.closest(".view");
    const downloadBtn = e.target.closest(".download");
    const copyLinkBtn = e.target.closest(".copyLink");

    if (!viewBtn && !downloadBtn && !copyLinkBtn) return;

    const work = e.target.closest('[id^="work"]');
    if (!work) return;

    const index = parseInt(work.id.replace("work", ""));
    
    const item = workOrganize.file[index]; 
    if (!item) return;

    const fileId = item.file_num;

    // View work
    if (viewBtn) {
        window.location.href = `./item.html?filenum=${fileId}`;
        return;
    }

    // Download work
    if (downloadBtn) {
        const link = item.download_path;
        showNotif("gallery.overlay.download")
        
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

    // Copy link
    if (copyLinkBtn) {
        const url = `${window.location.origin}/Gallery/item.html?filenum=${fileId}`;
        try {
            await navigator.clipboard.writeText(url);
            showNotif("gallery.overlay.copy")
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
});

mobileQuery.addEventListener("change", (e) => {
    if (e.matches && curOrganize !== "Grid") {
        handleLayoutChange("Grid", "workTemp1");
    } else if (!e.matches) {
        const savedLayout = localStorage.getItem("selectedOrganize");
        if (savedLayout === "Tile") {
            handleLayoutChange("Tile", "workTemp2");
        }
    }
});

// --- Pagination Logic ---
const pageCtnNum = document.getElementById("page-numbers");
const prevPageBtn = document.getElementById("prev-btn");
const nextPageBtn = document.getElementById("next-btn");

function renderPagination() {
    if (!pageCtnNum || !prevPageBtn || !nextPageBtn) return;

    let html = '';
    const addPage = (num) => {
        const activeClass = num === curPage ? 'active' : '';
        html += `<button class="page-num ${activeClass}" onclick="changePage(${num})">${num}</button>`;
    };
    
    const addEllipsis = () => {
        html += `<span class="page-num ellipsis">...</span>`;
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const delta = isMobile ? 1 : 2;
    let rangeStart = Math.max(2, curPage - delta);
    let rangeEnd = Math.min(totalPages - 1, curPage + delta);

    addPage(1);

    // Left ellipsis
    if (rangeStart > 2) addEllipsis();

    // Middle range
    for (let i = rangeStart; i <= rangeEnd; i++) {
        addPage(i);
    }

    // Right ellipsis
    if (rangeEnd < totalPages - 1) addEllipsis();

    // Always show the last page
    if (totalPages > 1) addPage(totalPages);

    // Inject only the numbers into the DOM
    pageCtnNum.innerHTML = html;

    // Toggle disabled states on the static HTML buttons
    prevPageBtn.disabled = curPage === 1;
    nextPageBtn.disabled = curPage === totalPages;
}

window.changePage = function(newPage) {
  if (newPage >= 1 && newPage <= totalPages) {
    // We only need to call this. It handles curPage, clearing the DOM, fetching, and re-rendering!
    loadAndSortWork(curSort, newPage);
  }
}

if (prevPageBtn && nextPageBtn) {
    prevPageBtn.addEventListener('click', () => changePage(curPage - 1));
    nextPageBtn.addEventListener('click', () => changePage(curPage + 1));
}