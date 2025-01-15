import View from "./View.js";
// import icons from "url:../../img/icons.svg"; // Parcel 2 THE NEW PATH in here!

import icons from "../../img/icons.svg"; // Parcel 2 THE NEW PATH in here!

// NOTE: The resultsView.js and bookmarksView.js are the same but the only difference is _parentElement and _errorMessage. And the main functionality to generate the markup is essentially the same for both of them and in order to encapsulate them, we put this functionality in a separate Child class called previewView.js.

// We have to use extends because ResultView class is a child of View class as parent!
class PreviewView extends View {
  _parentElement = "";

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    // How the selected recipe stays on what we selected and doesn't change when i move the mouse over other recipes:
    // This is the class for selected recipe: "preview__link--active" => we want to give this class to the below URL if the result.id is equal with the id of selected recipe in the URL: and the id in the URL is basically the hash value without hash sign(#) => const id = window.location.hash.slice(1);

    // We do that using ternary operator down below: ${result.id === id ? "preview__link--active" : ""}
    return `
    <li class="preview">
      <a class="preview__link 
      ${this._data.id === id ? "preview__link--active" : ""}" href="#${
      this._data.id
    }">
        <figure class="preview__fig">
          <img src="${this._data.image}" alt="${this._data.title}"/>
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${this._data.title}</h4>
          <p class="preview__publisher">${this._data.publisher}</p>      
          
          <div class="preview__user-generated ${
            !this._data.key ? "hidden" : ""
          }">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>
    `;
  }
}

// we export here the instance from the class PreviewView and not the class itself and because it is default, it would be only one default Instance, because every class can have only one default for export and not more and can have much more normal export(not export default)!
// WE CAN IMPORT IT IMMEDIATELY TO THE controller.js!
export default new PreviewView();
