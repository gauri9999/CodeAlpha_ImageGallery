document.addEventListener("DOMContentLoaded", function () {

    console.log("Favorites JavaScript Loaded!");

    const favoritesGrid = document.getElementById("favoritesGrid");

    const emptyMessage = document.getElementById("emptyMessage");

    const favoriteCount = document.getElementById("favoriteCount");


    // GET FAVORITES

    function getFavorites() {

        try {

            const data = JSON.parse(localStorage.getItem("favorites"));

            return Array.isArray(data) ? data : [];

        } catch (error) {

            return [];

        }

    }


    // DISPLAY FAVORITES

    function displayFavorites() {

        const favorites = getFavorites();

        favoritesGrid.innerHTML = "";

        favoriteCount.textContent = favorites.length;


        if (favorites.length === 0) {

            emptyMessage.style.display = "block";

            return;

        }

        emptyMessage.style.display = "none";


        favorites.forEach(function (item) {

            const card = document.createElement("div");

            card.className = "image-card";


            const img = document.createElement("img");

            img.src = item.src;

            img.alt = item.title || "Favorite Image";

            img.loading = "lazy";


            const info = document.createElement("div");

            info.className = "image-info";


            const title = document.createElement("h3");

            title.textContent = item.title || "Untitled Image";


            const category = document.createElement("p");

            category.textContent = item.category || "Favorite";


            const button = document.createElement("button");

            button.type = "button";

            button.className = "remove-favorite";

            button.textContent = "❤️ Remove Favorite";


            // REMOVE FAVORITE

            button.addEventListener("click", function () {

                const updatedFavorites = getFavorites();

                const index = updatedFavorites.findIndex(fav =>
                    fav.src === item.src
                );

                if (index !== -1) {

                    updatedFavorites.splice(index, 1);

                    localStorage.setItem(
                        "favorites",
                        JSON.stringify(updatedFavorites)
                    );

                    displayFavorites();

                }

            });


            info.appendChild(title);

            info.appendChild(category);

            info.appendChild(button);

            card.appendChild(img);

            card.appendChild(info);

            favoritesGrid.appendChild(card);

        });

    }


    // INITIAL DISPLAY

    displayFavorites();

});