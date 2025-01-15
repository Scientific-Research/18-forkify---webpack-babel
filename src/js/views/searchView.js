// We can of course write all this code in controller.js file, but it is against the MVC pattern => We don't write anything related to the DOM or VIEW in controller.js, rather, we write them here in a separate file => "separation of concerns"
class SearchView {
  #parentEl = document.querySelector(".search");

  getQuery() {
    // 1) we get the query and store it in the query varibale because we want to clear it in the next step!
    const query = this.#parentEl.querySelector(".search__field").value;

    // 2) we clear the input field in this step!
    this.#clearInput();

    // 3) we return the query that we stored it already in the query variable!
    return query;
  }

  // To clear the input field => we have to call that in controller.js:
  // I made it private and I can not use it outside anyway!
  #clearInput() {
    this.#parentEl.querySelector(".search__field").value = "";
  }

  // This is Publisher and controlSearchResults() function in control.js is Subscriber!
  addHandlerSearch(handler) {
    // The important note is: we don't connect the addEventListener to the Search button itself, rather, we connect it to the entire form, because there, we can listen to the submit event => In this case, it doesn't matter, if we click on the Search button itself or hit the enter button while enter the query => In both cases, we submit the form!

    // this.#parentEl.addEventListener("submit", handler);
    this.#parentEl.addEventListener("submit", (e) => {
      e.preventDefault(); // first of all => prevent the page from reloading and then call the handler function whic is actually our controlSearchResults() function in controller.js:
      handler();
    });
  }
}

// we export an instance of the class and not the above class itself:
// const newInstance = new SearchView();
export default new SearchView();
