```javascript
document.addEventListener("DOMContentLoaded", function () {

    const buttons = document.querySelectorAll(".filter-buttons button");
    const items = document.querySelectorAll(".gallery-item");

    const lightbox = document.getElementById("lightbox");
    const previewImage = document.getElementById("previewImage");

    const closeBtn = document.getElementById("closeBtn");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    let currentIndex = 0;

    // CATEGORY FILTER

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            const category = this.dataset.filter;

            buttons.forEach(btn => btn.classList.remove("active"));

            this.classList.add("active");

            items.forEach(item => {

                const imageCategory = item.dataset.category;

                if (category === "all" || category === imageCategory) {

                    item.style.display = "";

                } else {

                    item.style.display = "none";

                }

            });

        });

    });


    // GET VISIBLE IMAGES

    function getVisibleImages() {

        return Array.from(items).filter(item => {

            return getComputedStyle(item).display !== "none";

        });

    }


    // DISPLAY IMAGE

    function showImage() {

        const visibleImages = getVisibleImages();

        if (visibleImages.length === 0) return;

        const img = visibleImages[currentIndex].querySelector("img");

        previewImage.src = img.src;
        previewImage.alt = img.alt;

    }


    // OPEN LIGHTBOX

    items.forEach(item => {

        item.addEventListener("click", function () {

            const visibleImages = getVisibleImages();

            currentIndex = visibleImages.indexOf(item);

            showImage();

            lightbox.style.display = "flex";

        });

    });


    // NEXT IMAGE

    nextBtn.addEventListener("click", function () {

        const visibleImages = getVisibleImages();

        currentIndex = (currentIndex + 1) % visibleImages.length;

        showImage();

    });


    // PREVIOUS IMAGE

    prevBtn.addEventListener("click", function () {

        const visibleImages = getVisibleImages();

        currentIndex = (currentIndex - 1 + visibleImages.length)
            % visibleImages.length;

        showImage();

    });


    // CLOSE LIGHTBOX

    closeBtn.addEventListener("click", function () {

        lightbox.style.display = "none";

    });


    // CLICK OUTSIDE TO CLOSE

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {

            lightbox.style.display = "none";

        }

    });


    // KEYBOARD CONTROLS

    document.addEventListener("keydown", function (event) {

        if (lightbox.style.display === "flex") {

            if (event.key === "ArrowRight") nextBtn.click();

            if (event.key === "ArrowLeft") prevBtn.click();

            if (event.key === "Escape") {
                lightbox.style.display = "none";
            }

        }

    });

});
```