
```javascript
/* =====================================================
   PAGE NAVIGATION
===================================================== */

const pages = document.querySelectorAll(".page");

let currentPage = 0;

const book = document.getElementById("book");

const pageNumEl = document.getElementById("page-num");
const pageCountEl = document.getElementById("page-count");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const downloadBtn = document.getElementById("download-btn");


/* =====================================================
   SHOW PAGE
===================================================== */

function showPage(num) {
    if (num < 0) {
        num = 0;
    }

    if (num >= pages.length) {
        num = pages.length - 1;
    }

    currentPage = num;

    pages.forEach((page, index) => {
        page.classList.toggle("active", index === currentPage);
    });

    // Update page number only if the element exists
    if (pageNumEl) {
        pageNumEl.textContent = currentPage + 1;
    }

    if (pageCountEl) {
        pageCountEl.textContent = pages.length;
    }

    // Update navigation buttons only if they exist
    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage === pages.length - 1;
    }

    // Return to the top of the book after changing pages
    if (book) {
        book.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* =====================================================
   NEXT AND PREVIOUS PAGE
===================================================== */

function nextPage() {
    if (currentPage < pages.length - 1) {
        showPage(currentPage + 1);
    }
}

function prevPage() {
    if (currentPage > 0) {
        showPage(currentPage - 1);
    }
}


/* =====================================================
   NAVIGATION BUTTONS
===================================================== */

if (prevBtn) {
    prevBtn.addEventListener("click", prevPage);
}

if (nextBtn) {
    nextBtn.addEventListener("click", nextPage);
}


/* =====================================================
   LAPTOP KEYBOARD NAVIGATION
===================================================== */

document.addEventListener("keydown", (event) => {

    // Do not flip pages while typing in form fields
    if (
        event.target.matches("input, textarea, select") ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
    ) {
        return;
    }

    if (event.key === "ArrowRight") {
        nextPage();
    }

    if (event.key === "ArrowLeft") {
        prevPage();
    }

});


/* =====================================================
   MOBILE PAGE SWIPE
===================================================== */

let touchStartX = 0;
let touchStartY = 0;

let touchStartedInGallery = false;

document.addEventListener("touchstart", (event) => {

    if (event.touches.length !== 1) {
        return;
    }

    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;

    // Do not flip pages when the swipe begins inside a gallery
    touchStartedInGallery =
        event.target.closest(".gallery") !== null;

}, { passive: true });


document.addEventListener("touchend", (event) => {

    if (event.changedTouches.length !== 1) {
        return;
    }

    // Allow galleries to scroll independently
    if (touchStartedInGallery) {
        return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Flip only for a clear horizontal swipe
    if (
        Math.abs(diffX) > 60 &&
        Math.abs(diffX) > Math.abs(diffY) * 1.3
    ) {
        if (diffX > 0) {
            nextPage();
        } else {
            prevPage();
        }
    }

}, { passive: true });


/* =====================================================
   PRODUCT GALLERY TOUCH SUPPORT
===================================================== */

document.querySelectorAll(".gallery").forEach((gallery) => {

    // Native horizontal scrolling handles touch swipes.
    // Prevent the page-flip handler from interfering.
    gallery.addEventListener("touchstart", (event) => {
        if (event.touches.length === 1) {
            touchStartedInGallery = true;
        }
    }, { passive: true });

    gallery.addEventListener("touchend", () => {
        touchStartedInGallery = false;
    }, { passive: true });

});


/* =====================================================
   PDF DOWNLOAD
===================================================== */

if (downloadBtn) {

    downloadBtn.addEventListener("click", () => {

        if (typeof html2pdf === "undefined") {
            alert("PDF library could not load. Please check your internet connection.");
            return;
        }

        const clone = document.createElement("div");

        clone.style.width = "100%";
        clone.style.background = "#ffffff";
        clone.style.padding = "16px";

        pages.forEach((page) => {

            const copy = page.cloneNode(true);

            copy.classList.add("pdf-page");
            copy.classList.add("active");

            copy.style.display = "block";
            copy.style.width = "100%";
            copy.style.height = "auto";
            copy.style.position = "relative";
            copy.style.overflow = "visible";
            copy.style.pageBreakAfter = "always";

            clone.appendChild(copy);

        });

        document.body.appendChild(clone);

        html2pdf()
            .set({
                margin: 0.2,
                filename: "MechPulse-Catalogue.pdf",

                image: {
                    type: "jpeg",
                    quality: 0.95
                },

                html2canvas: {
                    scale: 2,
                    useCORS: true
                },

                jsPDF: {
                    unit: "in",
                    format: "a4",
                    orientation: "portrait"
                },

                pagebreak: {
                    mode: ["css", "legacy"]
                }
            })
            .from(clone)
            .save()
            .then(() => {
                clone.remove();
            })
            .catch((error) => {
                console.error("PDF export failed:", error);
                clone.remove();
                alert("Unable to create the PDF. Please try again.");
            });

    });

}


/* =====================================================
   INITIALIZE
===================================================== */

showPage(0);
```
