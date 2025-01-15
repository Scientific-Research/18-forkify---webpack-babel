import View from "./View.js";

// We use previewView.js as Child here:
import previewView from "./previewView.js";

// NOTE: The resultsView.js and bookmarksView.js are the same but the only difference is _parentElement and _errorMessage. And the main functionality to generate the markup is essentially the same for both of them and in order to encapsulate them, we put this functionality in a separate Child class called previewView.js.

// We have to use extends because ResultView class is a child of View class as parent!
class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "No Bookmarks yet. Find a nice recipe and bookmark it ;)";
  _successMessage = "";

  // we want to load the bookmarks when the page reloads using Publisher-Subscriber Pattern
  // after defining the handler, we have to go to the controller to define the controller for this handler there!
  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    console.log(this._data); // _data = model.state.search.results
    // return this._data.map(this._generateMarkupPreview).join("");

    // THE DIFFERENCE HERE: we want to call the _generateMarkup() in previewView.js as child here, but this will not work here:
    // return this._data.map(this._generateMarkup).join("");

    // What will work here is to do something like this:
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }

  // NOTE: THE BELOW CODE IS REPLACED WITH ABOVE CODE => THE BELOW CODE IS AVAILABLE AS A GENERAL CODE IN previewView.js:

  // _generateMarkup() {
  //   console.log(this._data); // _data = model.state.search.results
  //   return this._data.map(this._generateMarkupPreview).join("");
  // }
  // _generateMarkupPreview(result) {
  //   const id = window.location.hash.slice(1);

  //   // How the selected recipe stays on what we selected and doesn't change when i move the mouse over other recipes:
  //   // This is the class for selected recipe: "preview__link--active" => we want to give this class to the below URL if the result.id is equal with the id of selected recipe in the URL: and the id in the URL is basically the hash value without hash sign(#) => const id = window.location.hash.slice(1);

  //   // We do that using ternary operator down below: ${result.id === id ? "preview__link--active" : ""}
  //   return `
  //   <li class="preview">
  //     <a class="preview__link
  //     ${result.id === id ? "preview__link--active" : ""}" href="#${result.id}">
  //       <figure class="preview__fig">
  //         <img src="${result.image}" alt="${result.title}"/>
  //       </figure>
  //       <div class="preview__data">
  //         <h4 class="preview__title">${result.title}</h4>
  //         <p class="preview__publisher">${result.publisher}</p>
  //       </div>
  //     </a>
  //   </li>
  //   `;
  // }
}

// we export here the instance from the class BookmarksView and not the class itself and because it is default, it would be only one default Instance, because every class can have only one default for export and not more and can have much more normal export(not export default)!
// WE CAN IMPORT IT IMMEDIATELY TO THE controller.js!
export default new BookmarksView();
