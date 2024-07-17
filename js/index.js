let mealsByNameList = [];
let rowData = document.getElementById('rowData');
let searchContainer = document.getElementById('searchContainer');
$(document).ready(() => {
    getSearchByName("").then(() => {
        $(".screen").fadeOut(500)
        $("body").css("overflow", "auto")
    });
})

///////////////////////////////////////////////////////
//contact
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const phoneInput = document.getElementById('phoneInput');
const ageInput = document.getElementById('ageInput');
const passInput = document.getElementById('passInput');
const repassInput = document.getElementById('repassInput');
const nameAlert = document.getElementById('nameAlert');
const emailAlert = document.getElementById('emailAlert');
const phoneAlert = document.getElementById('phoneAlert');
const ageAlert = document.getElementById('ageAlert');
const passAlert = document.getElementById('passAlert');
const repassAlert = document.getElementById('repassAlert');
/////////////////////////////////////////////////////////////////////////////
//side-nav-menu
let navContentWidth = $('.nav-tab').innerWidth();
$('.nav-tab').animate({ left: -navContentWidth }, 0);
$('.side-nav-menu').animate({ left: -navContentWidth }, 0);
$('.menu-icon i').click(function () {
    $('.menu-icon i').toggleClass('fa-close');
    if ($('.nav-tab').css('left') == '0px') { 
        $('.nav-tab').animate({ left: -navContentWidth }, 500);
        $('.side-nav-menu').animate({ left: -navContentWidth }, 500);
         
        $('nav li').animate({ top: 300 }, 500);
    }
    else {
         
        $('.nav-tab').animate({ left: 0 }, 500);
        $('.side-nav-menu').animate({ left: 0 }, 500);
         
        for (let i = 0; i < 5; i++)
            $('nav li').eq(i).animate({ top: 0 }, (i + 9) * 100);
    }
});
// When user click on nav links remove the side-nav-menu
$('nav li a').click(function () {
    $('.nav-tab').animate({ left: -navContentWidth }, 500);
    $('.side-nav-menu').animate({ left: -navContentWidth }, 500);
    $('.menu-icon i').toggleClass('fa-close');

});
 
getMealsByName();
// Meal by Name 
async function getMealsByName() {
    let mealsByNameAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    let mealsByNameList = await mealsByNameAPI.json();
    console.log(mealsByNameList);
    displayMealsByName(mealsByNameList.meals);
}
function displayMealsByName(mealsByNameList) {
    let result = ``;
    for (let i = 0; i < mealsByNameList.length; i++) {
        result += `
        <div class="col-md-3">
            <div class="img-card position-relative" onclick="getMealsById(${mealsByNameList[i].idMeal})">
                <img src="${mealsByNameList[i].strMealThumb}" alt="${mealsByNameList[i].strMeal}" class="border border-0 rounded-2">
                    <div class="img-overlay position-absolute bg-white bg-opacity-75 border border-0 rounded-2 overflow-hidden">
                        <h2 class="meal-name d-flex align-items-center h-100">${mealsByNameList[i].strMeal}</h2>
                    </div>
            </div>
        </div>
        `
    }
    rowData.innerHTML = result;
}

//Meal by Id
async function getMealsById(idMeal) {
    $(".inner-screen").fadeIn(300)
    let mealsByIdAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
    let mealsByIdList = await mealsByIdAPI.json();
    displayMealsById(mealsByIdList);
    $(".inner-screen").fadeOut(300)
    console.log(idMeal, 'id');
}
function displayMealsById(mealsByIdList) {
    searchContainer.innerHTML = ``; 
   
    let tags = mealsByIdList.meals[0].strTags;
    let resultTags = ``;
    if (tags != null) {
        let arrTags = tags.split(',');
        for (let i = 0; i < arrTags.length; i++)
            resultTags += `<li class="border border-0 rounded-2 bg-danger-subtle text-danger-emphasis p-2">${arrTags[i]}</li>`
    }
    /////////////////////////////////////////////////
    let Recipes = ``; 
    let ingredientsArr = []; 
    let measuresArr = [];
     let recipesArr = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = `strIngredient${i}`;
        const measure = `strMeasure${i}`;
        const ingredients = mealsByIdList.meals[0][ingredient];
        const measures = mealsByIdList.meals[0][measure];
        if (ingredients !== "" && ingredients !== null) {
            console.log(measures, ' ', ingredients, ' ', i);
            ingredientsArr.push(ingredients);
            measuresArr.push(measures);
        }
    }
    for (let i = 0; i < measuresArr.length; i++) { 
        const measuresArray = measuresArr[i];
        const ingredientsArray = ingredientsArr[i];
        recipesArr.push(`${measuresArray} ${ingredientsArray}`);
        Recipes += `<li class="border border-0 rounded-2 bg-info-subtle text-info-emphasis p-2">${recipesArr[i]}</li>`
    }
    let result = `
        <div class="col-md-3">
        <div class="meal-caption">
            <img src="${mealsByIdList.meals[0].strMealThumb}" alt="${mealsByIdList.meals[0].strMeal}" class="border border-0 rounded-2">
            <h1 class="text-white">${mealsByIdList.meals[0].strMeal}</h1>
        </div>
    
    </div>
    <div class="col-md-9">
        <div class="meal-info text-white">
            <h2>Instructions</h2>
            <p class="mb-2">${mealsByIdList.meals[0].strInstructions}</p>
            <h2 class="mb-2">Area : ${mealsByIdList.meals[0].strArea}</h2>
            <h2 class="mb-2">Category : ${mealsByIdList.meals[0].strCategory}</h2>
            <div class="recipes mb-2">
                <h2 class="mb-2">Recipes :</h2>
                <ul class="d-flex flex-wrap gap-2">${resultRecipes}</ul>
            </div>
            <div class="tags mb-4">
                <h2 class="mb-2">Tags :</h2>
                <ul class="d-flex flex-wrap gap-2">${resultTags}</ul>
            </div>
            <ul class="d-flex flex-wrap gap-2">
            <li class="btn btn-success p-2"><a href="${mealsByIdList.meals[0].strSource}" target="_blank">Source</a></li>
            <li class="btn btn-danger p-2"><a href="${mealsByIdList.meals[0].strYoutube}" target="_blank">Youtube</a></li>
        </ul>
        </div>
    </div>
    `
    rowData.innerHTML = result;
}

// Search
function displaySearchInputs() {
    let searchInputResult = `
    <div class="row py-4">
        <div class="col-md-6">
            <input type="text" onkeyup="getSearchByName(this.value)" class="form-control text-white bg-transparent" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input type="text" onkeyup="getSearchByFirstLetter(this.value)" class="form-control text-white bg-transparent" placeholder="Search By First Letter" maxlength="1">
        </div>
    </div>`
    searchContainer.innerHTML = searchInputResult;
    rowData.innerHTML = ``;
}
async function getSearchByName(searchQuery) {
    $(".inner-screen").fadeIn(300)
    let searchByNameAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
    let searchByNameList = await searchByNameAPI.json();
    displaySearchByName_FirstLetter(searchByNameList);
}
async function getSearchByFirstLetter(searchQuery) {
    $(".inner-screen").fadeIn(300)
    let searchByFirstLetterAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
    let searchByFirstLetterList = await searchByFirstLetterAPI.json();
    displaySearchByName_FirstLetter(searchByFirstLetterList);
}
function displaySearchByName_FirstLetter(searchQuery) {
    if (searchQuery.meals != null)
        displayMealsByName(searchQuery.meals);
        $(".inner-screen").fadeOut(300)
}
// Categories
async function getMealsByCategories() {
    $(".inner-screen").fadeIn(300)
    let mealsByCategoryAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let mealsByCategoryList = await mealsByCategoryAPI.json();
    displayMealsByCategory(mealsByCategoryList.categories);
    $(".inner-screen").fadeOut(300)
}
function displayMealsByCategory(mealsByCategoryList) {
    searchContainer.innerHTML = ``; 
    let result = ``;
    for (let i = 0; i < mealsByCategoryList.length; i++) {
        result += `
        <div class="col-md-3">
            <div class="img-card position-relative" onclick="filterMealsByCategory('${mealsByCategoryList[i].strCategory}')">
                <img src="${mealsByCategoryList[i].strCategoryThumb}" alt="${mealsByCategoryList[i].strCategory}" class="border border-0 rounded-2">
                    <div class="img-overlay position-absolute text-center bg-white bg-opacity-75 border border-0 rounded-2 overflow-hidden">
                        <h2>${mealsByCategoryList[i].strCategory}</h2>
                        <p>${mealsByCategoryList[i].strCategoryDescription}</h2>
                    </div>
            </div>
        </div>
        `
    }
    rowData.innerHTML = result;
}
async function filterMealsByCategory(categoryName) {
    $(".inner-screen").fadeIn(300)
    let filterByCategoryAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName.trim()}`);
    let filterByCategoryList = await filterByCategoryAPI.json();
    filterByCategoryList = filterByCategoryList.meals.slice(0, 20);
    displayMealsByName(filterByCategoryList);
    $(".inner-screen").fadeOut(300)
}

// Area
async function getMealsByArea() {
    $(".inner-screen").fadeIn(300)
    let mealsByAreaAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let mealsByAreaList = await mealsByAreaAPI.json();
    displayMealsByArea(mealsByAreaList.meals);
    $(".inner-screen").fadeOut(300)
}
function displayMealsByArea(mealsByAreaList) {
    // hide the search when we display the meal.
    searchContainer.innerHTML = ``;

    let result = ``;
    for (let i = 0; i < mealsByAreaList.length; i++) {
        result += `
        <div class="col-md-3">
            <div class="text-white text-center cursor-pointer" onclick="filterMealsByArea('${mealsByAreaList[i].strArea}')">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h2>${mealsByAreaList[i].strArea}</h2>   
            </div>
        </div>
        `
    }
    rowData.innerHTML = result;
}
async function filterMealsByArea(areaName) {
    $(".inner-screen").fadeIn(300)
    let filterByAreaAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
    let filterByAreaList = await filterByAreaAPI.json();
    filterByAreaList = filterByAreaList.meals.slice(0, 20);
    displayMealsByName(filterByAreaList);
    $(".inner-screen").fadeOut(300)
}

//Ingredients
async function getMealsByIngredients() {
    $(".inner-screen").fadeIn(300)
    let mealsByIngredientsAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let mealsByIngredientsList = await mealsByIngredientsAPI.json();
    mealsByIngredientsList = mealsByIngredientsList.meals.slice(0, 20);
    displayMealsByIngredients(mealsByIngredientsList);
    $(".inner-screen").fadeOut(300)
}

function displayMealsByIngredients(mealsByIngredientsList) {
    searchContainer.innerHTML = ``; 
    let result = ``;
    for (let i = 0; i < mealsByIngredientsList.length; i++) {
        result += `
        <div class="col-md-3">
            <div class="text-white text-center cursor-pointer" onclick="filterMealsByIngredients('${mealsByIngredientsList[i].strIngredient}')">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h2>${mealsByIngredientsList[i].strIngredient}</h2>  
                <p>${mealsByIngredientsList[i].strDescription.slice(0, 100)}<p> 
            </div>
        </div>
        `
    }
    rowData.innerHTML = result;
}
async function filterMealsByIngredients(ingredientName) {
    $(".inner-screen").fadeIn(300)
    let filterByIngredientsAPI = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`);
    let filterByIngredientsList = await filterByIngredientsAPI.json();
    filterByIngredientsList = filterByIngredientsList.meals.slice(0, 20);
    displayMealsByName(filterByIngredientsList);
    $(".inner-screen").fadeOut(300)
}

// Contact
function contact() {
    searchContainer.innerHTML = ``; 
    let result = `
    <div class="min-vh-100 w-75 mx-auto d-flex align-items-center justify-content-center">

                    <form action="#">
                        <div class="row g-4" id="">
                            <div class="col-md-6">
                                <input type="text" id="nameInput"  class="form-control "
                                    placeholder="Enter Your Name">
                                <p id="nameAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Special characters and numbers not allowed
                                </p>
                            </div>
                            <div class="col-md-6">
                                <input type="email" id="emailInput" class="form-control "
                                    placeholder="Enter Your Email">
                                <p id="emailAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Email not valid *exemple@yyy.zzz
                                </p>
                            </div>
                            <div class="col-md-6">
                                <input type="tel" id="phoneInput"  class="form-control "
                                    placeholder="Enter Your Phone">
                                <p id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Enter valid Phone Number
                                </p>
                            </div>
                            <div class="col-md-6">
                                <input type="number" id="ageInput"  class="form-control "
                                    placeholder="Enter Your Age" min="18" max="60">
                                <p id="ageAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Enter valid age
                                </p>
    
                            </div>
                            <div class="col-md-6">
                                <input type="password" id="passInput"  class="form-control "
                                    placeholder="Enter Your Password">
                                <p id="passAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                                </p>
                            </div>
                            <div class="col-md-6">
                                <input type="password" id="repassInput"  class="form-control "
                                    placeholder="RePassword">
                                <p id="repassAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Enter valid repassword
                                </p>
                            </div>
                            <div class="col text-center">
                                <button id="submitBtn" class="btn btn-outline-danger cursor-pointer" disabled>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>   
    `
    rowData.innerHTML = result;
 //////////////////////////////////////////////////////

nameInput.addEventListener('blur', () => {
    if (nameInput.value !== '' && nameFunc(nameInput.value))
        nameAlert.classList.replace('d-block', 'd-none');
    else
        nameAlert.classList.replace('d-none', 'd-block');
    checkValidation();
});
nameInput.addEventListener('input', () => {
    if (nameInput.value !== '' && nameFunc(nameInput.value))
        nameAlert.classList.replace('d-block', 'd-none');
    else
        nameAlert.classList.replace('d-none', 'd-block');
    checkValidation();
});
emailInput.addEventListener('blur', () => {
    if (emailInput.value.trim() !== '' && emailFunc(emailInput.value))
        emailAlert.classList.replace('d-block', 'd-none');
    else
        emailAlert.classList.replace('d-none', 'd-block');
    checkValidation();
});
emailInput.addEventListener('input', () => {
    if (emailInput.value !== '' && emailFunc(emailInput.value))
        emailAlert.classList.replace('d-block', 'd-none');
    else
        emailAlert.classList.replace('d-none', 'd-block');
    checkValidation();
});
phoneInput.addEventListener('blur', () => {
    if (phoneInput.value.trim() !== '' && phoneFunc(phoneInput.value))
        phoneAlert.classList.replace('d-block', 'd-none');
    else
        phoneAlert.classList.replace('d-none', 'd-block');
    checkValidation();
});
phoneInput.addEventListener('input', () => {
    if (phoneInput.value !== '' && phoneFunc(phoneInput.value))
        phoneAlert.classList.replace('d-block', 'd-none');
    else
        phoneAlert.classList.replace('d-none', 'd-block');
    checkValidation();
});
ageInput.addEventListener('blur', () => {
    if (ageInput.value !== '' && ageFunc(ageInput.value))
        ageAlert.classList.replace('d-block', 'd-none');
    else
        ageAlert.classList.replace('d-none', 'd-block');
    checkValidation();
});
ageInput.addEventListener('input', () => {
    if (ageInput.value !== '' && ageFunc(ageInput.value))
        ageAlert.classList.replace('d-block', 'd-none');
    else
        ageAlert.classList.replace('d-none', 'd-block');
    checkValidation();
});
passInput.addEventListener('blur', () => {
    if (passInput.value !== '' && passFunc(passInput.value))
        passAlert.classList.replace('d-block', 'd-none');
    else
        passAlert.classList.replace('d-none', 'd-block');
    checkValidation();
});
passInput.addEventListener('input', () => {
    if (passInput.value !== '' && passFunc(passInput.value))
        passAlert.classList.replace('d-block', 'd-none');
    else
        passAlert.classList.replace('d-none', 'd-block');
    checkValidation();
});
repassInput.addEventListener('blur', () => {
    if (repassInput.value !== '' && passFunc(repassInput.value) && repassInput.value === passInput.value)
        repassAlert.classList.replace('d-block', 'd-none');
    else
        repassAlert.classList.replace('d-none', 'd-block');
    checkValidation();
});
repassInput.addEventListener('input', () => {
    if (repassInput.value !== '' && passFunc(repassInput.value) && repassInput.value === passInput.value)
        repassAlert.classList.replace('d-block', 'd-none');
    else
        repassAlert.classList.replace('d-none', 'd-block');
    checkValidation();
});


function emailFunc(value) {
const emailRegex =/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
return emailRegex.test(value);
}

function nameFunc(value) {
const nameRegex = /^[A-Z][a-z]+$/;
return nameRegex.test(value);
}

function phoneFunc(value) {
const phoneRegex = /^01(1|2|0|5)[0-9]{8}$/;
return phoneRegex.test(value);
}

function ageFunc(value) {
const ageRegex = /^(1[8-9]|[2-5][0-9]|60)$/;
return ageRegex.test(value);
}
function passFunc(value) {
const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
return passRegex.test(value);
}
function checkValidation() {
const submitBtn = document.getElementById('submitBtn');
if (nameFunc(nameInput.value) && emailFunc(emailInput.value) && phoneFunc(phoneInput.value) && ageFunc(ageInput.value) && passFunc(passInput.value) && passRegexFunc(repassInput.value) && repassInput.value === passInput.value) {
    
    submitBtn.removeAttribute('disabled');
}
else {
   
    submitBtn.setAttribute('disabled', '');
}
}
}
 
 