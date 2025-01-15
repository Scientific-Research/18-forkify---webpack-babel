// import * as config from "./config"; // OR the following:
import { API_URL, RES_PER_PAGE, KEY } from "./config";
// import { getJSON, sendJSON } from "./helpers";
import { AJAX } from "./helpers";

// We export the class to have access to that in controller.js
// state contains all the data that we need in our application:
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1, // By default, we set the page to 1!
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [], // we push the bookmarked recipes here in this array!
};

const createRecipeObject = (data) => {
  // let recipe = data.data.recipe; OR using destructuring:
  const { recipe } = data.data;
  // We can change the property notation from _ notation at the right side to the Camel notation at the left side for recipe as following => a nicely formatted recipe:
  // state.recipe = {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // AND operator short circuits => if there is no key for this recipe => AND will short-circuit and nothing happens!
    // But if there is a key for this recipe, we will have an object => { key: recipe.key } and the spread operator will unpack it as a normal key-value => key: recipe.key like other above key-value
    // NOTE: THIS IS A VERY NICE TRICK TO ADD CONDITIONALLY A PROPERTY TO AN OBJECT!
  };
};

// We export the class to have access to that in controller.js
// This function is responsible to fetch the recipe data from our forkify API
export const loadRecipe = async (id) => {
  try {
    // const data = await getJSON(`${API_URL}${id}`);
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    console.log(data);

    state.recipe = createRecipeObject(data);

    // Using Some method as one of the array method, because it gives us True or False: Some method will loop over an array and will return True, if any element in this array meet the condition we already specified!
    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    console.log(state.recipe);
  } catch (err) {
    // alert(err.message);
    // Temp error handling!
    console.error(`${err.message} ☠️☠️☠️☠️`);
    throw new Error(err.message); // throw the error here again to have an access to that in controller.js
  }
};

// Start implemeneting the Serach functionality => The controller will call this function, that's why we export it and is performing AJAX calls => is a async function:
// The controller tells this function on which function search for => will pass in a query like a string:
export const loadSearchResults = async (query) => {
  try {
    state.search.query = query; // store the query in state
    // const data = await getJSON(
    const data = await AJAX(
      // `https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza`
      `${API_URL}?search=${query}&key=${KEY}`
    );
    console.log(data);

    // we loop over all the recipes and get a new array => therefore, we use map() method:
    state.search.results = data.data.recipes.map((rec) => {
      // we simply return a new object and we will store that in our state - state contains all the data that we need to build our application.
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }), // AND operator short circuits => if there is no key for this recipe => AND will short-circuit and nothing happens!
        // But if there is a key for this recipe, we will have an object => { key: recipe.key } and the spread operator will unpack it as a normal key-value => key: recipe.key like other above key-value
        // NOTE: THIS IS A VERY NICE TRICK TO ADD CONDITIONALLY A PROPERTY TO AN OBJECT!
      };
    });
    // For every new query, we have to reset the page number to 1, otherwise, it will preserve the last page number from the last query!
    state.search.page = 1;
  } catch (err) {
    console.error(`${err.message} ☠️☠️☠️☠️`);
    throw new Error(err.message); // throw the error here again to have an access to that in controller.js
  }
};

// loadSearchResults("pizza"); // we have to call this function in the controller.js and not here!

export const getSearchResultsPage = function (page = state.search.page) {
  // the page is set to 1 as default => page = state.search.page
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0 => if page is 1 => start = 0
  const end = page * state.search.resultsPerPage; // 9 => if page is 1 => end is 10, but slice doesn't take the last element => last element would be 10th element => the element with index 9!

  // we want to return a part of the results => therefore we use slice() method as following:
  return state.search.results.slice(start, end); // Results from array with index 0 bis 9 => from element 1 to element 10
};

export const updateServings = (newServings) => {
  // we have to change(mutate) the quatity property inside the ingredients => when the servings is doubled => the quantity would be doubled too => we use the forEach, because we don't need a new array. We can also use map and we will have a new array and at the end, we can overwrite the state.recipe!
  state.recipe.ingredients.forEach((ing) => {
    // We use the following Formula to calculate the ing.quantity:
    // newQuantity = oldQuantity * newServings / oldServings => (2 * 8) / 4 = 4
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  // we have to update the servings in the state:
  state.recipe.servings = newServings; // we have to update the servings with the new servings, otherwise we will have always the same old servings!
};

// Storing data in local storage is all about the data, therefore, we have to do it here in the model:
// A function to store the data in local storage => we don't need to export it, we use this function in two below functions:
const persistBookmarks = () => {
  // we have to give it a name(bookmarks) and also an object that we want to convert to the string using string(JSON.stringify()):
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

// BOOKmarks are all about DATA => we have to start with them in model.js => we write the function here and then export it to the controller:
export const addBookmark = (recipe) => {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked => to show the bookmarked recipe in VIEW.
  // if the id of selected recipe is the same with the id of already selected and gepushed recipe in the bookmarks array => TRUE, it means it get the respected bookmark SIGN (white sign) on the page => we put a new property on this recipe object!
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true; // we put a new property on this recipe object!
  }

  persistBookmarks();
};
// AND NOW, WE HAVE TO CREATE A NEW CONTROLLER FUNCTION FOR THIS FUNCTION in controller.js => CONTROLLER FOR ADDING A NEW BOOKMARK!

// The function to unmark the selected Bookmark:
export const deleteBookmark = (id) => {
  // Delete the Bookmark which has this id from bookmarks array:
  // we want to delete the bookmark at index and only one element!

  // we have to calculate the index:
  const index = state.bookmarks.findIndex((el) => el.id === id); // There would be only one bookmark that its id would be the same as the id we got as parameter!
  // For this element which condition is True, return the index and we take this index and will delete it from the array!
  state.bookmarks.splice(index, 1);

  // And finally we have to bookmark the recipe as not a boookmarked recipe anymore!
  // Mark current recipe as NOT bookmarked!
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
};

// To get the data out of the LocalStorage => do the opposite of storing the data:
const init = () => {
  // we need only the name
  const storage = localStorage.getItem("bookmarks");
  // if there is something in storage(localStorage), then
  // CONVERT IT FROM JSON STRING INTO AN OBJECT and store it in the state, otherwise, not:
  if (storage) state.bookmarks = JSON.parse(storage);
};

init(); // init function will be called in the beginning
console.log(state.bookmarks);

// A function to clear the bookmarks:
const clearBookmarks = () => {
  localStorage.clear("bookmarks");
};

// clearBookmarks(); By default it should be off, otherwise the localStorage would not work!

// Here we need to upload the data to the form API => It send a request to the API:
export const uploadRecipe = async (newRecipe) => {
  try {
    // to create an array based on existing data:
    // Object.entries() => to convert newRecipe as an obejct back to an array which is the opposite of Object.fromEntries(dataArr);
    // we use filter() because we want only ingredients from 1 to 6 of course, when they have contents and are not empty!
    const ingredients = Object.entries(newRecipe)
      .filter(
        (entry) => entry[0].startsWith("ingredient") && entry[1] !== ""

        // and now get the string contents of the ingredients and put them in an array:
      )
      .map((ing) => {
        // const ingArr = ing[1].replaceAll(" ", "").split(",");
        // split with commas and removing the extra spaces, instead of replacing the spaces with no spaces, in this case, all the words are glued together!
        const ingArr = ing[1].split(",").map((el) => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredients format! Please use the correct format :)"
          );

        // destructuring: ing[1] is the second element of the entry which is contents!
        const [quantity, unit, description] = ingArr;
        // and now put the destructured values in an object: + means convert to number!
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // NOW WE HAVE TO CREATE THE OBJECT WHICH IS READY TO BE UPLOADED => which is opposite of above:  state.recipe{}

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // console.log(recipe);

    // using sendJSON to create the AJAX REQUEST:
    // sendJSON has two parameters: not only the URL but also the data which is recipe here!

    // const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data); // we have now chnaged the info to the format on top of the page in this function => createRecipeObject()
    addBookmark(state.recipe); // we bookmark the recipe here => bookmarked:true
  } catch (err) {
    throw new Error(err);
  }
};
