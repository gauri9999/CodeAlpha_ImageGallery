document.addEventListener("DOMContentLoaded", function () {

    console.log("Gallery JavaScript Loaded!");

    const cards = Array.from(document.querySelectorAll(".image-card"));

    const lightbox = document.getElementById("lightbox");
    const previewImage = document.getElementById("previewImage");

    const closeBtn = document.getElementById("closeBtn");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");

    const imageCount = document.getElementById("imageCount");
    const noResults = document.getElementById("noResults");

    let currentIndex = 0;
    let visibleCards = [];


    // FAVORITES STORAGE

    function getFavorites() {

        try {

            const data = JSON.parse(localStorage.getItem("favorites"));

            return Array.isArray(data) ? data : [];

        } catch (error) {

            return [];

        }

    }


    function saveFavorites(favorites) {

        localStorage.setItem("favorites", JSON.stringify(favorites));

    }


    // UPDATE FAVORITE BUTTONS

    function updateFavoriteButtons() {

        const favorites = getFavorites();

        cards.forEach(card => {

            const img = card.querySelector("img");
            const button = card.querySelector(".favorite-btn");

            if (!img || !button) return;

            const exists = favorites.some(item => item.src === img.src);

            if (exists) {

                button.textContent = "❤️ Remove Favorite";
                button.classList.add("active");

            } else {

                button.textContent = "🤍 Add to Favorites";
                button.classList.remove("active");

            }

        });

    }


    // ADD OR REMOVE FAVORITES

    cards.forEach(card => {

        const img = card.querySelector("img");
        const title = card.querySelector("h3");
        const button = card.querySelector(".favorite-btn");

        if (!img || !button) return;

        button.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            let favorites = getFavorites();

            const index = favorites.findIndex(item => item.src === img.src);

            if (index === -1) {

                favorites.push({

                    src: img.src,
                    title: title.textContent.trim(),
                    category: card.dataset.category

                });

                saveFavorites(favorites);

                alert("Image Added to Favorites ❤️");

            } else {

                favorites.splice(index, 1);

                saveFavorites(favorites);

                alert("Image Removed from Favorites!");

            }

            updateFavoriteButtons();

        });

    });


    // DOWNLOAD IMAGE

    cards.forEach(card => {

        const img = card.querySelector("img");
        const title = card.querySelector("h3");
        const downloadBtn = card.querySelector(".download-btn");

        if (!img || !downloadBtn) return;

        downloadBtn.addEventListener("click", async function (event) {

            event.preventDefault();
            event.stopPropagation();

            try {

                const response = await fetch(img.src);

                if (!response.ok) {
                    throw new Error("Image download failed");
                }

                const blob = await response.blob();

                const imageURL = URL.createObjectURL(blob);

                const link = document.createElement("a");

                link.href = imageURL;

                link.download = title.textContent.trim()
                    .replace(/\s+/g, "_") + ".jpg";

                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);

                setTimeout(() => URL.revokeObjectURL(imageURL), 1000);

                alert("Image Downloaded Successfully! ⬇️");

            } catch (error) {

                console.error("Download Error:", error);

                alert("Download failed. Please try again.");

            }

        });

    });


    // SHARE IMAGE

    cards.forEach(card => {

        const img = card.querySelector("img");
        const title = card.querySelector("h3");
        const shareBtn = card.querySelector(".share-btn");

        if (!img || !shareBtn) return;

        shareBtn.addEventListener("click", async function (event) {

            event.preventDefault();
            event.stopPropagation();

            const imageURL = img.src;

            const imageTitle = title.textContent.trim();

            const shareText = "Check out this beautiful image: " + imageTitle;

            // NATIVE SHARE

            if (navigator.share) {

                try {

                    await navigator.share({

                        title: imageTitle,
                        text: shareText,
                        url: imageURL

                    });

                } catch (error) {

                    if (error.name !== "AbortError") {

                        console.error("Share Error:", error);

                        alert("Unable to share this image.");

                    }

                }

            } else {

                // FALLBACK SHARE OPTIONS

                const choice = confirm(
                    "Share this image?\n\nOK = Copy Image Link\nCancel = WhatsApp Share"
                );

                if (choice) {

                    // COPY LINK

                    try {

                        await navigator.clipboard.writeText(imageURL);

                        alert("Image Link Copied Successfully! 📋");

                    } catch (error) {

                        // FALLBACK FOR CLIPBOARD

                        const input = document.createElement("textarea");

                        input.value = imageURL;

                        document.body.appendChild(input);

                        input.select();

                        document.execCommand("copy");

                        document.body.removeChild(input);

                        alert("Image Link Copied! 📋");

                    }

                } else {

                    // WHATSAPP SHARE

                    const whatsappURL =
                        "https://wa.me/?text=" +
                        encodeURIComponent(shareText + "\n" + imageURL);

                    window.open(whatsappURL, "_blank");

                }

            }

        });

    });


    // SEARCH AND FILTER

    function updateVisibleImages() {

        visibleCards = cards.filter(card =>
            getComputedStyle(card).display !== "none"
        );

    }


    function filterGallery() {

        const searchText = searchInput.value.toLowerCase().trim();

        const selectedCategory = categoryFilter.value;

        let count = 0;

        cards.forEach(card => {

            const title = card.querySelector("h3").textContent.toLowerCase();

            const category = card.dataset.category;

            const matchesSearch = title.includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                selectedCategory === category;

            if (matchesSearch && matchesCategory) {

                card.style.display = "";
                count++;

            } else {

                card.style.display = "none";

            }

        });

        imageCount.textContent = count;

        noResults.style.display = count === 0 ? "block" : "none";

        updateVisibleImages();

    }


    searchInput.addEventListener("input", filterGallery);

    categoryFilter.addEventListener("change", filterGallery);


    // IMAGE PREVIEW

    cards.forEach(card => {

        const img = card.querySelector("img");

        img.addEventListener("click", function () {

            updateVisibleImages();

            currentIndex = visibleCards.indexOf(card);

            if (currentIndex === -1) return;

            previewImage.src = img.src;

            lightbox.classList.add("show");

        });

    });


    // NEXT IMAGE

    nextBtn.addEventListener("click", function () {

        updateVisibleImages();

        if (visibleCards.length === 0) return;

        currentIndex = (currentIndex + 1) % visibleCards.length;

        previewImage.src =
            visibleCards[currentIndex].querySelector("img").src;

    });


    // PREVIOUS IMAGE

    prevBtn.addEventListener("click", function () {

        updateVisibleImages();

        if (visibleCards.length === 0) return;

        currentIndex =
            (currentIndex - 1 + visibleCards.length) % visibleCards.length;

        previewImage.src =
            visibleCards[currentIndex].querySelector("img").src;

    });


    // CLOSE LIGHTBOX

    closeBtn.addEventListener("click", function () {

        lightbox.classList.remove("show");

    });


    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {

            lightbox.classList.remove("show");

        }

    });


    // KEYBOARD CONTROLS

    document.addEventListener("keydown", function (event) {

        if (!lightbox.classList.contains("show")) return;

        if (event.key === "Escape") {

            lightbox.classList.remove("show");

        }

        if (event.key === "ArrowRight") {

            nextBtn.click();

        }

        if (event.key === "ArrowLeft") {

            prevBtn.click();

        }

    });


    // INITIAL SETUP

    updateFavoriteButtons();

    filterGallery();

    console.log("Gallery Initialized Successfully!");

});