import View from "./View.js";
// import icons from "url:../../img/icons.svg"; // Parcel 2 THE NEW PATH in here!
// import icons from "../../img/icons.svg"; // Parcel 2 THE NEW PATH in here!

// We have to use extends because ResultView class is a child of View class as parent!
class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _successMessage = "Recipe was successfully uploaded!";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super(); // this file is child of View.js => we have to call the super() here! and only after that, we can use this keyword!
    this._addHandlerShowWindow(); // this method will be called immediately as soon as the page loads!
    this._addHandlerHideWindow();
  }

  // to correct the this keyword in _addHandlerShowWindow() method and using bind() method:
  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  // and now listen to the addEventListeners for both open and close buttons => here we don't need the controller, because it doesn't need to show us something special, this is only about the buttons and nothing else. The controller doesn't need to interfer in any of this => To be executed immediately after page loads, we put this method inside the constructor. WE ONLY NEED TO IMPORT THIS FILE IN CONTROLLER; OTHERWISE, THE OBJECT WILL NOT BE CREATED AND THEREFORE, THE CODE WILL NOT BE RAN!
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener(
      "click",
      this.toggleWindow.bind(this)
      // we want here to take the overlay and window and remove the hidden class!

      // NOTE: THE PROBLEM IS THAT: here the this keyword points out to the this._btnOpen(button) which attached to the addEvenetListener() and we don't want that.
      // TO CORRECT THAT: WE DEFINE THESE TWO STATEMENTS IN A SEPARATE METHOD() AND USE bind() METHOD TO POINT OUT TO THE CORRESPONDING OBJECTS AND NOT this._btnOpen anymore! => THIS IS MANUALLY SETTING THE this keyword TO THE toggleWindow() METHOD!

      // this._overlay.classList.toggle("hidden");
      // this._window.classList.toggle("hidden");
    );
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this)); // when i click on the around of the window, it is closed too!
  }

  // creating a handler for Submission button => we will listen to an event which is attached to the parent element of the form which is upload:
  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", (e) => {
      // This is a form and first thing about a form is preventDefault():
      e.preventDefault(); // prevent a form from reloading!

      // QUESTION: HOW WE CAN ACCESS TO ALL COMPONENTS OF THIS FORM?
      // ANSWER: THE EASIEST SOLUTION IS TO USE FORM DATA => THAT IS A PRETTY MODERN BROWSER API THAT WE CAN USE OF THAT:
      const dataArr = [...new FormData(this._parentElement)]; // this points to the _parentElement which is upload form here and we have to exactly put a form here!

      // THE OUTPUT(data) IS A WIERD OBJECT THAT WE CAN NOT USE IT, THEREFORE, WE HAVE TO CONVERT IT TO THE ARRAY USING SPREAD OPERATOR AND TWO BRACKETS[]!

      // console.log(data);

      // THE NEXT STEP: WE HAVE TO BRING THIS DATA IN THE model.js, BUT BEFORE THAT WE HAVE TO CREATE A CONTROLLER FOR THIS HANDLER IN controller.js that we have done many times before => I THINK THIS IS PUBLISHER-SUBSCRIBER PATTERN!

      // FIRST SOLUTION USING reduce: CONVERTING AN ARRAY TO AN OBJECT:
      const data1 = dataArr.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

      // SECOND SOLUTION: USING A LOOP:
      const data2 = {};
      for (const [key, value] of dataArr) {
        data2[key] = value;
      }

      // THIRD SOLUTION Using Object.fromEntries() => THIS IS THE EASIEST SOLUTION:
      const data = Object.fromEntries(dataArr); // this is the opposite of Entries for object, here it takes an array and convert it to an object.

      handler(data);
    });
  }
  _generateMarkup() {}
}

// const pagination = new AddRecipeView();
// export default pagination; OR THE FOLLOWING:
export default new AddRecipeView(); // we have to create a new instance(object) of the class, so that we can access the paginationView in the controller.js
