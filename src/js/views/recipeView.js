import View from "./View.js";

// We use class here because of some reasons:
// 1) We can later create a View class as parent class which other views as children can inherit from this parent class!
// 2) Classes make it very simple to make some of the properties and methods private and some of them public
// 3) therefore, classes make it really easy to implement and is a right way to go here!

// import icons from "../img/icons.svg"; // Parcel 1
// NOTE: We have to add type="module" in script in html file. In this case, the following import will work in Parcel!
// import icons from "url:../img/icons.svg"; // Parcel 2 THE OLD PATH as it was in controller
// import icons from "url:../../img/icons.svg"; // Parcel 2 THE NEW PATH in here!

import icons from "../../img/icons.svg"; // Parcel 2 THE NEW PATH in here!

import { Fraction } from "fractional";
console.log(Fraction);

class RecipeView extends View {
  // Here are the private properties:
  _parentElement = document.querySelector(".recipe");
  _errorMessage = "We could not find that recipe. Please try another one!";
  _successMessage = "";

  // It must be a public API => In this case, we can access to that in controller.js
  addHandlerRender(handler) {
    // when the hash changes, we listen to that, and then call the callback function:

    // window.addEventListener("hashchange", controlRecipes); // controlRecipes function will run, when hash changes!

    // window.addEventListener("load", controlRecipes);

    // when the page loads completely, the controlRecipes as callback function will runs immediately! for example, when i copy and paste the complete URL in a new Tab, it is already loaded and runs immediately! but with only above addEventListener, it will not run because, it will listen till we click on a link, in this case the hash will change and we see the result!

    // NEXT STEP: the next step is to get the recipe Id from the hash!

    // NOTE: WE CAN EVEN COMBINE TWO addEventListener IN ONE addEventListener using forEach() loop => Therefore, I commented the two separated above addEventListener out!
    ["hashchange", "load"].forEach((event) =>
      // addEventListener(event, controlRecipes)
      addEventListener(event, handler)
    );
  }

  // WE use addEventListener to listen to the SERVINGS's buttons as soon as they are increased or decreased => we don't need to use a separate servingsView.js because the buttons are here and we can do that here in recipeView.js!
  // We use once again PUBLISHER-SUBSCRIBER PATTERN => The below function is publisher and controlServings() function is subscriber and also is as handler(argument) for below function:
  addHandlerUpdateServings(handler) {
    // we use again the event Delegation => because we have the buttons and also the svg around them => we can list the event on the _parentElement as parent element and check if the click target was one of those buttons => this is very similar with what we have done for pagination buttons!
    this._parentElement.addEventListener("click", (e) => {
      // we want to select the button, that was clicked or not? => e.target is click element!
      // Imagine that the use click on the svg element, when we use closest method => the closest class to the svg would be .btn--tiny => Closest method search for the closest class from botton to the Top of the DOM tree searching for the parent elemnet!

      const btn = e.target.closest(".btn--update-servings");

      // When we click between the two buttons, it gives us null or undefined and we have to check it too using a Guard Clause! => if there is not btn => return immediately and not go further!
      if (!btn) return;

      console.log(btn);
      // const updateTo = Number(btn.dataset.updateTo); // here we read the data from user Interface(below HTML code) OR USING DESTRUCTRING AS FOLLOWING TO BE MORE CLEANER:

      const { updateTo } = btn.dataset; // here we read the data from user Interface(below HTML code)

      console.log(updateTo);
      if (Number(updateTo) > 0) handler(+updateTo); // + sign means the same as Number()
      // The next step is to connect it to the controller => in init() function, we add this function there!

      // QUESTION: HOW WE DETERMINE THE newServings value and send it to the controlServings() function as parameter in controller.js file?
      // ANSWER: we have to connect the user Interface(below HTML file) with our JS code again using special data-properties => adding this: data-update-to="${ this._data.servings - 1}" and data-update-to="${ this._data.servings + 1}"
    });
  }

  // WE USE AGAIN EVENT-DELEGATION => it recieves like always our controlAddBookmark function in controller.js file as handler parameter here!
  // At the beginning(when the page loads), if we connect the .btn--bookmark class to the addEventListener(), it will be undefined, because it doesn't exist, therefore using Event -Delegation is very useful in this case that we put the addeventlistenet to the parent element and not direct the element itself!
  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener("click", (e) => {
      // We simply listen for the event on a parent element and try to figure out if the click actually happened on the element that we are looking for!

      // WE use again the closest => because the user might clicked on the SVG icon and not exactly the button itself!
      const btn = e.target.closest(".btn--bookmark");
      console.log(btn);

      // We have again the same Guard Clause as always:
      if (!btn) return; // if there is no btn => return immediately, otherwise, call our handler()!

      handler(); // The next step, is to go to the controller.js and call this function there with respected bookmark function as argument which would be here as handler!
    });
  }

  // recipe = this._data;
  // _generateMarkup(recipe) {
  _generateMarkup() {
    // const markup = `
    console.log(this._data);
    return `
     <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${
            !this._data.key ? "hidden" : ""
          }">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark ">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked === true ? "-fill" : ""
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateMerkupIngredient).join("")}
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
  }

  _generateMerkupIngredient(ing) {
    return `
    <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity ? new Fraction(ing.quantity).toString() : ""
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
    </li>            
    `;
    /* Tranforming the above array of string to a big string using join()*/
  }
}

// we make a new object from RecipeView object => Instead of exporting the whole class, we will export only the created object as following:
export default new RecipeView(); // we don't pass any data in and so, therefore, we don't need any constructor even!
