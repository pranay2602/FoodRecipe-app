// Add these scripts to your existing script.js

const loadingSpinner = document.getElementById("loader");
const body = document.body;

function showLoadingSpinner() {
    loadingSpinner.style.display = "block";
}

function hideLoadingSpinner() {
    loadingSpinner.style.display = "none";
}

const appId = "80411d51";
const appKey = "b9cfa4217402881f78585a9511fcd842";
const baseUrl = `https://api.edamam.com/api/recipes/v2?type=public&&app_id=${appId}&app_key=${appKey}`;
const recipeContainer = document.querySelector("#recipe-container");
const wishlistContainer = document.getElementById("wishlist-container");
const txtSearch = document.querySelector("#txtSearch");
const btnSearch = document.querySelector("#btnSearch");
const btnAddToWishlist = document.getElementById("btnAddToWishlist");

const wishlist = [];

btnSearch.addEventListener("click", () => loadRecipes(txtSearch.value));

txtSearch.addEventListener("input", () => {
    const inputVal = txtSearch.value.trim();
    loadRecipes(inputVal);
});

function loadRecipes(type = "paneer") {
    showLoadingSpinner();
    const url = baseUrl + `&q=${type}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            renderRecipes(data.hits);
            hideLoadingSpinner();
        })
        .catch((error) => {
            console.log(error);
            hideLoadingSpinner();
        });
}

const getRecipeStepsStr = (ingredientLines = []) => {
    let str = "";
    for (var step of ingredientLines) {
        str = str + `<li>${step}</li>`;
    }
    return str;
};

const renderRecipes = (recipeList = []) => {
    recipeContainer.innerHTML = '';
    recipeList.forEach(recipeObj => {
        const { label: recipeTitle, ingredientLines, image: recipeImage } = recipeObj.recipe;
        const stepsStr = getRecipeStepsStr(ingredientLines);
        const htmlStr = `
            <div class="recipe">
                <div class="recipe-title">
                    <span>${recipeTitle}</span>
                    <span class="wishlist-btn">🌟</span>
                </div>
                <div class="recipe-image">
                    <img src="${recipeImage}" alt="${recipeTitle}" />
                </div>
                <div class="recipe-text">
                    <ul>
                        ${stepsStr}
                    </ul>
                </div>
            </div>`;
        recipeContainer.insertAdjacentHTML("beforeend", htmlStr);
    });
};

btnAddToWishlist.addEventListener("click", () => {
    wishlistContainer.innerHTML = '';
    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.innerHTML = `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.title}" />
                <span>${item.title}</span>
            </div>`;
        wishlistContainer.appendChild(wishlistItem);
    });
});

recipeContainer.addEventListener("click", (event) => {
    const wishlistBtn = event.target.closest(".wishlist-btn");
    if (wishlistBtn) {
        const recipeTitle = wishlistBtn.parentElement.querySelector("span").textContent;
        const recipeImage = wishlistBtn.parentElement.nextElementSibling.querySelector("img").src;
        addToWishlist(recipeTitle, recipeImage);
    }
});

function addToWishlist(recipeTitle, recipeImage) {
    const isRecipeInWishlist = wishlist.some(item => item.title === recipeTitle);
    if (!isRecipeInWishlist) {
        wishlist.push({ title: recipeTitle, image: recipeImage });
        console.log(`Added '${recipeTitle}' to the wishlist`);
        updateWishlistButton();
    } else {
        console.log(`'${recipeTitle}' is already in the wishlist`);
    }
}

function updateWishlistButton() {
    btnAddToWishlist.textContent = `Wishlist (${wishlist.length})`;
}


const handleResponsiveDesign = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) {
        body.style.background = "#f7f7f7";
        txtSearch.style.width = "80%";
        recipeContainer.style.width = "100%";
    }
    if (screenWidth <= 480) {
        body.style.background = "#ececec";
        txtSearch.style.width = "100%";
    }
};

window.addEventListener("load", handleResponsiveDesign);
window.addEventListener("resize", handleResponsiveDesign);

loadRecipes();
