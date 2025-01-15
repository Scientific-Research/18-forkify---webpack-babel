// import icons from "url:../../img/icons.svg"; // Parcel 2 THE NEW PATH in here!

import icons from "../../img/icons.svg"; // Parcel 2 THE NEW PATH in here!

// This class is a parent class and has all the properties and methods which are common between all the View classes as child classes(recipeView.js, resultsView.js and searchView.js)
// We export the class itself, because we don't want to create any instance from the view!
// we use it always as parent of all other view classes as children!

// To move private properties and methods from children view files to here as parent view file, we have to change the status from private(#) to protected(_), otherwise, it will not work!
export default class View {
  _data;

  // This is a part of public API => is used for all the Views, that's why we have not to pollute it for only one View!
  render(data, render = true) {
    // ! works only for undefined or null but we get an empty array, what about that? first of all, we check that if it is an array and also if the array is empty => its length is 0!
    if (!data || (Array.isArray(data) && data.length === 0)) {
      this.renderError(); // we don't even need to assign an Error message, it is there as default!
      return;
    }

    this._data = data;
    console.log(this._data);

    const markup = this._generateMarkup();
    // TO GET RIDE OF extra message at the bottomn of the page, we have to make the content of innerHTML empty:
    // recipeContainer.innerHTML = "";

    if (!render) return markup;

    this._clear();

    // we have to insert this html file into our DOM using insertAdjacentHTML method. which we have to do that on the parent element => class .recipe with this element recipeContainer!
    // afterbegin means as the first child! markup is the variable that we just above created!
    // recipeContainer.insertAdjacentHTML("afterbegin", markup);
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  // we want that update function will be available on all the View pages and not one of them => that's why we write it here as a General file to be accessible for all the view files!
  update(data) {
    // ! works only for undefined or null but we get an empty array, what about that? first of all, we check that if it is an array and also if the array is empty => its length is 0!
    // if (!data || (Array.isArray(data) && data.length === 0)) {
    //   this.renderError(); // we don't even need to assign an Error message, it is there as default!
    //   return;
    // }

    this._data = data;
    // console.log(this._data);
    const newMarkup = this._generateMarkup();
    // We have to compare the new HTML to the current HTML => that shows us only the texts and attributes which changed from old version to the new version:

    // We have now newMarkup as string, but it is very difficult to compare it with the Object in DOM.
    // SOLUTION: we have to convert this string markup to a virtual Object in DOM in memory and compare it with actual one on the page:
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // And now we select all the elements in this virtual DOM:
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    // console.log(newElements); // we see now all the elements in DOM which was created from updated newMarkup!

    // To compare, we have to get the all elements on the current page:
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    // NOTE: Both the querySelectorAll return Node List,
    // QUESTION: how we can convert them to a real array?
    // ANSWER: we can use the Array.from()

    // console.log(newElements);
    // console.log(curElements);

    // Loop over the new elements array(newElements):
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // How we can now compare them(newEl and curEl)? => we can use isEqualNode() method:
      // console.log(curEl, newEl.isEqualNode(curEl)); // it compares the contents of the nodes and it doesn't matter is in which node!
      // WHEN THE CURRENT ELEMENT IS DIFFERENT FROM NEW ELEMENT => Result is false!
      // WHEN THE CURRENT ELEMENT IS THE SAME LIKE NEW ELEMENT => Result is true!

      // if new elemnet and current element are different:
      // Updates changed TEXT:
      if (
        !newEl.isEqualNode(curEl) &&
        // firstChild might not always exists, therefore, we use optional Chaining(?) to not continue the execution of the statement till end of that when firstChild doesn't exists => in this case, we are 100% sure our code will work and we don't get any error!

        newEl.firstChild?.nodeValue.trim() !== "" // we have to select first child node which contains the text - newEl is the element Node and not the text node, that's why we have to select the firstChild which contains the text node! This text muss not be an empty string!
      ) {
        // console.log("☠️", newEl.firstChild.nodeValue.trim());

        // when yes, we want to change the text content of the current element to the text content of the new element:
        curEl.textContent = newEl.textContent; // we got a problem now and that is we need only to replace the text and not all the contents:

        // WE HAVE TO USE ANOTHER NICE PROPERTY NOW WHICH IS AVAILABLE ON ALL NODES => nodeValue => the value of nodeValue is null when Node is Element and is Content of the text node when Node is Text => in this case, we have to do an extra Check!
      }

      // Updates changed ATTRIBUTES:
      // WE WANT TO CHANGE ALSO THE ATTRIBUTES AND NOT ONLY THE TEXT OF THE CURRENT ELEMENT ON THE PAGE, WHEN THERE IS A DIFFERENCE BETWEEN THIS ELEMENT AND NEW ELEMENT:
      if (!newEl.isEqualNode(curEl)) {
        // ANOTHER NEW THING => GET the attribute properties of an element:
        // console.log(newEl.attributes); // shows us all the attributes of changed elements
        // newEl.attributes gives us an object of changed attributes, therefore we have to convert it into array using Array.from() to loop over it!

        console.log(Array.from(newEl.attributes));

        // Here, we replace the name and value attributes from the current elemnet with the name and the value properties from new element!
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = ""; // this will be used for all the Views as long as they have the parent element as _parentElement.
  }

  // This would be also a public method:
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
      `;
    // First we clear the parent element:
    this._clear();
    // we need now to add this html to the DOM as a child of the parent element
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  // A method for Error message:
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;
    // First we clear the parent element:
    this._clear();
    // we need now to add this html to the DOM as a child of the parent element
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  // A method for success message too:
  renderMessage(message = this._successMessage) {
    const markup = `
      <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;
    // First we clear the parent element:
    this._clear();
    // we need now to add this html to the DOM as a child of the parent element
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
