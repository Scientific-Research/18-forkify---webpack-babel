import View from "./View.js";
import icons from "url:../../img/icons.svg"; // Parcel 2 THE NEW PATH in here!

// We have to use extends because ResultView class is a child of View class as parent!
class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  // Using Publisher-Subscriber Pattern that we used it several times ago!
  addHandlerClick(handler) {
    // we use event delegation here because they are two buttons here and we don't want to listen to each of them individually , instead we will add addEventListener to the common parent element which is indeed this._parentElement =>
    this._parentElement.addEventListener("click", (e) => {
      // first of all, we need to figure out which button has been clicked based on the event!
      // Now, we select the closest button element to the clicked element(e.target)
      const btn = e.target.closest(".btn--inline");
      // the closest method is a little bit like the query selector but instead for searching down in the Tree for the children, it searches up in Tree for the parent! We might click on the spam, svg or href element and not only the button element itself, that's why we can not only set the btn to e.target, rather, we have to fund the closest parent to them!
      console.log(btn); // we have now go to the controller and create a controller there!

      //if there is a btn, we have to click on that, if there is no btn, return immediately!
      // => therefor, we need a Guard Clause here:
      if (!btn) return; // Because of this Guard Clause, when we click on between of the buttons, we get the null and NOT AN ERROR AYNMORE!

      const goToPage = Number(btn.dataset.goto);
      console.log(goToPage);

      handler(goToPage); // we send here the buttons back to the controller to use them there and display the respected page!
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    console.log(curPage);

    const numPages = Math.ceil(
      // we need to divide the length of the array to the number of the items per page and at the end, round it to the next highest integer number
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    // TO LET JS KNOWS WHICH PAGE HAS TO GO AFTER CLICKING ON THE BUTTONS => WE ADD SOME DATA ATTRIBUTES: data-goto="${curPage + 1}"

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
          <button data-goto="${
            curPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    // Last page => the current page is equal with the number of pages => for example we have 6 pages totally and we are on the last page which is sixth page!
    if (curPage === numPages && numPages > 1) {
      return `
          <button data-goto="${
            curPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
      `;
    }

    // Other page
    if (curPage < numPages) {
      return `
          <button data-goto="${
            curPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>

          <button data-goto="${
            curPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    // Page 1, and there are NO other pages
    // we are on the current page and we have only one page(total number of pages is 1)
    if (curPage === 1 && numPages === 1) {
      // return "only 1 page, NO others!";
      return ""; // There is other pages => there is no other ways to go!
    }
  }
}

// const pagination = new PaginationView();
// export default pagination; OR THE FOLLOWING:
export default new PaginationView(); // we have to create a new instance(object) of the class, so that we can access the paginationView in the controller.js
