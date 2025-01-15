import { TIMEOUT_SEC } from "./config.js";

// This function will return a new promise which will reject after a certain of seconds!
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// BOTH THE getJSON and sendJSON are very similar, therefore, we can write a GENERAL function and use it for both of them:
export const AJAX = async (url, uploadData = undefined) => {
  try {
    // fetch Promise
    const fetchPro = uploadData
      ? fetch(
          // "https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886"
          // `${config.API_URL}/${id}` OR the following:
          // `${API_URL}/${id}`
          url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // To say API: our Data is in JSON format!
            },
            body: JSON.stringify(uploadData), // convert the object or an array to JSON string
          }
        )
      : fetch(url);

    // fetch() returns a promise, therefore it must be awaited!
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // json() returns a promise, therefore it must be awaited!
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} ${res.status}`);
    }

    return data;
  } catch (err) {
    throw new Error(err.message); // we propagate the error down from one async function to another one by rethrowing the error => we throw the error from helper.js to model.js
    // console.log(err);
  }
};

// NOTE: I COMMENTED THE BELOW TWO FUNCTIONS OUT, BECAUSE WE HAVE A GENERAL FUNCTION FOR BOTH OF THEM ABOVE!

// QUESTION: HOW WE CAN USE THIS timeout() FUNCTION HERE? There is a race between this timeout function and fetch() function, everyone which is finished earlier, will win the game!

// export const getJSON = async (url) => {
//   try {
//     // fetch() returns a promise, therefore it must be awaited!
//     const res = await Promise.race([
//       fetch(
//         // "https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886"
//         // `${config.API_URL}/${id}` OR the following:
//         // `${API_URL}/${id}`
//         url
//       ),
//       timeout(TIMEOUT_SEC),
//     ]);
//     // json() returns a promise, therefore it must be awaited!
//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(`${data.message} ${res.status}`);
//     }

//     return data;
//   } catch (err) {
//     throw new Error(err.message); // we propagate the error down from one async function to another one by rethrowing the error => we throw the error from helper.js to model.js
//     // console.log(err);
//   }
// };

// // Create a method to send the JSON data using fetch function which is very similar to the function of getJSON():
// // IT MUST BE A POST REQUEST:
// export const sendJSON = async (url, uploadData) => {
//   try {
//     // fetch() returns a promise, therefore it must be awaited!
//     const res = await Promise.race([
//       fetch(
//         // "https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886"
//         // `${config.API_URL}/${id}` OR the following:
//         // `${API_URL}/${id}`
//         url,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json", // To say API: our Data is in JSON format!
//           },
//           body: JSON.stringify(uploadData), // convert the object or an array to JSON string
//         }
//       ),
//       timeout(TIMEOUT_SEC),
//     ]);
//     // json() returns a promise, therefore it must be awaited!
//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(`${data.message} ${res.status}`);
//     }

//     return data;
//   } catch (err) {
//     throw new Error(err.message); // we propagate the error down from one async function to another one by rethrowing the error => we throw the error from helper.js to model.js
//     // console.log(err);
//   }
// };
