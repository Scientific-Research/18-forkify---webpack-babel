import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
// In Parcel we can import more than just JS files! we can import all kinds of assets including images!

// We can use any name instead!
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable"; // for Polyphilling => other things
import "regenerator-runtime/runtime"; // for Polyphiling => Async-await

// This is not a JS module, this is a Parcel module => activate the hot module reloading:
// Faster Development: Changes in code are reflected immediately without a full reload, allowing for a more efficient development workflow.

// if (module.hot) {
//   module.hot.accept();
// }

// console.log(icons);

// const recipeContainer = document.querySelector(".recipe");

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// To make an AJAX Request to an API, we use the fetch Request!
// const showRecipe = async () => {
const controlRecipes = async () => {
  try {
    // Get the Id from the hash => window.location.hash is the complete URL, but we need only the hash part, therefore, we add the hash at the end => window.location.hash

    // const id = window.location.hash;

    // The hash part is #8789756756jksdfhsfdhsj, the Id is this minus #(hash sign)- we can remove this sign using slice() method in JS:
    const id = window.location.hash.slice(1); // start at position 1 till end(it will not include # sign which is in position 0)!
    console.log(id);

    // A Clause Guard => when there is no Id => return and not going further!
    if (!id) return;

    // renderSpinner(recipeContainer); // we have to put the parent element inside!
    recipeView.renderSpinner(); // we have to put the parent element inside!

    // 0) Update results view to mark selected search result => we pass the current page inside the update() function:
    resultsView.update(model.getSearchResultsPage());

    // 1) updating bookmarkView
    bookmarksView.update(model.state.bookmarks);

    // And now, instead of hardCoding the Id down below, I replace it with the obtained id:

    // 2) Loading recipe
    await model.loadRecipe(id); // loadRecipe function is an async function which means, it returns a Promise, therefore, it should be awaited!
    // const recipe = model.state.recipe OR using destructuring as following:
    // const { recipe } = model.state;

    // when we export the whole RecipeView class instead of the only created object, we have to write something like this:
    // const recipeView = new recipeView(model.state.recipe);

    // But now we exported only the object, therefore, we write something like this:
    // The important note is that: we want to send the data from Model to View, How we can do that? We can not do it directly, We export the data from model to the controller and from controller, we send the data to the View using render method in RecipeView class as following => The controller.js is a bridge between model.js and recipeView.js

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);

    // TEST
    // controlServings();
  } catch (err) {
    // alert(err); // We alert the error that we have already thrown in try section!
    // recipeView.renderError(`${err.message} ☠️☠️☠️☠️`);
    recipeView.renderError();
    console.error(err);
  }
};

// controlRecipes();

// We write a new function here in control for loadSearchResults:
// This function will call an async function => loadSearchResults, therefore, this function muss be an async function too!
const controlSearchResults = async function () {
  try {
    // To display the spinner!
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();

    // set a Guard Clause here, when there is no query:
    if (!query) return; // when there is no query => return immediately!

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // console.log(model.state.search.results);

    // TO SEND ALL SEARCH RESULTS TO THE PAGE:
    // resultsView.render(model.state.search.results); // to send the all results of search to the resultsView() and show it on the page!

    // BUT WE WANT TO SEND A PART OF THE SEARCH RESULTS TO THE PAGE => 10 Results Per Page:
    resultsView.render(model.getSearchResultsPage()); // we want to start with page 1 => we set it already to 1 in controller.js, therefore, we don't need to assign 1 here as argument

    // Clear the input field
    // searchView.clearInput(); // I comment this here out and move it to the searchView.js, because it belongs to this file anyway! I made it private and we can not use it here anymore!

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// controlSearchResults(); => we want to call this function when there is an event, it means when use enter something in input filed(like pizza) and we don't want to cakll this function when the program loads, that's why i commented that out and we use addEventListener to do that:

// searchView.parentEl.addEventListener("enter", controlSearchResults); My solution

// To do that: We use once again PUBLISHER-SUBSCRIBER PATTERN as we used it already down below: we will create a addHandlerSearch method in searchView.js as Publisher and controlSearchResults() function here is the Subscriber!

// EVENT HANDLING IN MVC: PUBLISHER-SUBSCRIBER PATTERN => we send the controlRecipes() function as argument to the addHandlerRender() function in recipeView!

// THIS IS THE CONTROLLER THAT WILL BE EXECUTED WHEN CLICK ON ONE OF THE BUTTONS HAPPENS: USING PUBLISHED-SUBSCRIBER PATTEN:
const controlPagination = (goToPage) => {
  console.log("Pag controller", goToPage);

  // And now we want to display the results and display the new buttons too! we have this code above and we need only to copy and paste it here and do some changes on that:

  // 1) Render NEW results after clicking on the buttons:
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = (newServings) => {
  // Update the recipe servings (in state) => we have to go to the model, because states are in the model. we delegate this Task as a method to the model which dealth with the data!
  // model.updateServings(8);
  model.updateServings(newServings);

  // Update the recipe view => because the data to be updated are in recipe view and we don't need a separate servingsView

  // We overwrite simply the entire recipe => we will render recipe in the state again:
  // recipeView.render(model.state.recipe); The problem is here: render function render the entire page when i click on anything on the page, for example + and - for servings => the photo on the page will flicker  => we have to prevent that: we have only render what we click on them not the entire page:
  recipeView.update(model.state.recipe);
  // UPDATE WILL RENDER ONLY TEXT AND ATTRIBUTES AND NOT THE ENTIRE PAGE, BUT RENDER WILL RENDER THE ENTIRE PAGE!
};

// CONTROLLER FOR ADDING A NEW BOOKMARK:
const controlAddBookmark = () => {
  // Only when the recipe has not been bookmarked, in this case, we want to bookmark a recipe:

  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else model.deleteBookmark(model.state.recipe.id);

  // adding the current recipe to the bookmark array
  // model.addBookmark(model.state.recipe);
  console.log(model.state.recipe);

  // We added -fill to the HTML section using ternary operator => when bookmarked is true => mark the Bookmark with a white color => but we need to update the recipeView after that, therefore, we use the update() method as following:

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks => to display the bookmarks in a list:
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

// THIS CONTROLLER ACTUALLY RECEIVE THE DATA:
// UploadRecipe is an async function and here has to be async await function too, otherwise the error message will not work anymore!
const controlAddRecipe = async (newRecipe) => {
  try {
    // console.log(newRecipe);

    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data:
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display a success message:
    addRecipeView.renderMessage();

    // Render bookmark view => after reload the page, the new bookmarked added recipe will remain on the page!
    bookmarksView.render(model.state.bookmarks);

    // Change the id in the URL after uploading the info in the recipe form without reloading the page using the history in the browser:
    // pushState() takes three arguments => state, title, url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // WE CAN ALSO DO SOME OTHER STUFFS WITH pushState():
    // window.history.back(); // automatically going back to the last page!

    //Close form window:
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    // when we give the incomplete data for the Ingredients input field in the form => we get the error message which is this in model:  "Wrong ingredients format! Please use the correct format :)"
    console.error("☠️", err);
    addRecipeView.renderError(err.message);
  }
};

// WE call both functions in init() function => it means when the page loads at the beginning:
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings); // i put it here besides the first one!
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination); // we send controlPagination() function as an argument to the addHandlerClick() function!

  // We call this function at the end, in this case we are sure that a recipe was already created => BUT THIS IS FALSE! AT THIS POINT THE RECIPE WAS NOT CREATED YET AND state.recipe.ingredients doesn't have any recipe yet(we are trying to read the recipe from ingredients which doesn't exist, that's why we get undefined!) => BECAUSE THE API HAS NOT ARRIVED YET(BECAUSE IT IS AN ASYNC FUNCTION) TO TEST IT, WE CAN MOVE THIS STATEMENT TO THE TOP => controlRecipes(); IN THAT POINT, IT WORKS WELL!
  // controlServings();

  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
