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

    // Make sure page number stays within range
    if (num < 0) {
        num = 0;
    }

    if (num >= pages.length) {
        num = pages.length - 1;
    }

    currentPage = num;


    // Show only the current page
    pages.forEach((page, index) => {

        page.classList.toggle(
            "active",
            index === currentPage
        );

    });


    // Update page number
    if (pageNumEl) {
        pageNumEl.textContent = currentPage + 1;
    }


    // Update total pages
    if (pageCountEl) {
        pageCountEl.textContent = pages.length;
    }


    // Previous button
    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
    }


    // Next button
    if (nextBtn) {
        nextBtn.disabled =
            currentPage === pages.length - 1;
    }


    // Scroll to the beginning of the book
    if (book) {

        book.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =====================================================
   NEXT PAGE
===================================================== */

function nextPage() {

    if (currentPage < pages.length - 1) {

        showPage(currentPage + 1);

    }

}


/* =====================================================
   PREVIOUS PAGE
===================================================== */

function prevPage() {

    if (currentPage > 0) {

        showPage(currentPage - 1);

    }

}


/* =====================================================
   NAVIGATION BUTTONS
===================================================== */

if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        prevPage
    );

}

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        nextPage
    );

}


/* =====================================================
   LAPTOP KEYBOARD NAVIGATION
===================================================== */

document.addEventListener("keydown", (event) => {

    /*
       Don't change pages while the user is typing
       inside an input, textarea or select.
    */

    if (
        event.target.matches(
            "input, textarea, select"
        )
    ) {
        return;
    }


    // Don't interfere with browser shortcuts
    if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
    ) {
        return;
    }


    // Right arrow = next page
    if (event.key === "ArrowRight") {

        nextPage();

    }


    // Left arrow = previous page
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


/* -----------------------------------------------------
   TOUCH START
----------------------------------------------------- */

document.addEventListener(
    "touchstart",
    (event) => {

        // Ignore multi-touch
        if (event.touches.length !== 1) {
            return;
        }


        touchStartX =
            event.touches[0].clientX;

        touchStartY =
            event.touches[0].clientY;


        /*
           Check whether the swipe started
           inside a product gallery.
        */

        touchStartedInGallery =
            event.target.closest(".gallery") !== null;

    },
    {
        passive: true
    }
);


/* -----------------------------------------------------
   TOUCH END
----------------------------------------------------- */

document.addEventListener(
    "touchend",
    (event) => {

        // Ignore multi-touch
        if (event.changedTouches.length !== 1) {
            return;
        }


        /*
           If the swipe started inside a gallery,
           DON'T change the catalogue page.

           The gallery itself handles horizontal scrolling.
        */

        if (touchStartedInGallery) {

            touchStartedInGallery = false;

            return;

        }


        const touchEndX =
            event.changedTouches[0].clientX;

        const touchEndY =
            event.changedTouches[0].clientY;


        const diffX =
            touchStartX - touchEndX;

        const diffY =
            touchStartY - touchEndY;


        /*
           Only change pages when the movement is
           clearly horizontal.
        */

        if (
            Math.abs(diffX) > 60 &&
            Math.abs(diffX) >
                Math.abs(diffY) * 1.3
        ) {

            // Swipe LEFT
            if (diffX > 0) {

                nextPage();

            }

            // Swipe RIGHT
            else {

                prevPage();

            }

        }


        touchStartedInGallery = false;

    },
    {
        passive: true
    }
);


/* =====================================================
   PRODUCT GALLERY
===================================================== */

/*
   We intentionally do NOT manually control
   gallery.scrollLeft here.

   CSS handles native horizontal scrolling on mobile.

   This gives smoother scrolling and prevents
   the catalogue page from accidentally changing.
*/


document.querySelectorAll(".gallery").forEach(
    (gallery) => {

        gallery.addEventListener(
            "touchstart",
            (event) => {

                /*
                   Stop the page-swipe logic from
                   treating this as a page swipe.
                */

                if (event.touches.length === 1) {

                    touchStartedInGallery = true;

                }

            },
            {
                passive: true
            }
        );

    }
);


/* =====================================================
   PDF DOWNLOAD
===================================================== */

if (downloadBtn) {

    downloadBtn.addEventListener(
        "click",
        () => {


            /* -----------------------------------------
               Check PDF library
            ----------------------------------------- */

            if (typeof html2pdf === "undefined") {

                alert(
                    "PDF library could not load. Please check your internet connection."
                );

                return;

            }


            /* -----------------------------------------
               Create temporary PDF container
            ----------------------------------------- */

            const clone =
                document.createElement("div");


            clone.style.width = "100%";

            clone.style.background =
                "#ffffff";

            clone.style.padding =
                "16px";


            /* -----------------------------------------
               Copy every page
            ----------------------------------------- */

            pages.forEach((page) => {

                const copy =
                    page.cloneNode(true);


                /*
                   Make every page visible
                   inside the PDF.
                */

                copy.classList.add("pdf-page");

                copy.classList.add("active");


                copy.style.display =
                    "block";

                copy.style.width =
                    "100%";

                copy.style.height =
                    "auto";

                copy.style.position =
                    "relative";

                copy.style.overflow =
                    "visible";

                copy.style.pageBreakAfter =
                    "always";


                clone.appendChild(copy);

            });


            /* -----------------------------------------
               Add temporary container to document
            ----------------------------------------- */

            document.body.appendChild(clone);


            /* -----------------------------------------
               Generate PDF
            ----------------------------------------- */

            html2pdf()

                .set({

                    margin: 0.2,

                    filename:
                        "MACHPULSE-Catalogue.pdf",


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

                        mode: [
                            "css",
                            "legacy"
                        ]

                    }

                })


                .from(clone)


                .save()


                .then(() => {

                    // Remove temporary PDF content
                    clone.remove();

                })


                .catch((error) => {

                    console.error(
                        "PDF export failed:",
                        error
                    );


                    clone.remove();


                    alert(
                        "Unable to create the PDF. Please try again."
                    );

                });

        }
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

showPage(0);
