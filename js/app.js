//doms
const search = document.getElementById("search");
const form = document.getElementById("form");
const submit = document.getElementById("btn");
const row = document.getElementById("row");
const content = document.querySelector(".anime-content");

//fetch anime data
async function fetchAnime(e) {
  e.preventDefault();
  if (search.value.trim() === "") {
    //show error
    showError();
  } else {
    //fetch data
    try {
      const anime = search.value;
      const url = `http://api.jikan.moe/v3/search/anime?q=${anime}`;
      let response = await fetch(url);
      let data = await response.json();
      //for testing
      console.log(data);
      //create the ui for the data
      createDOM(data);
    } catch (err) {
      console.log(err);
    }
  }
}

function createDOM(data) {
  //loop through the data
  const animeByCategories = data.results.reduce((acc, curr) => {
    let { type } = curr;
    //check to see if there is a type else create one
    if (acc[type] === undefined) acc[type] = [];
    acc[type].push(curr);

    return acc;
  }, {});

  //loop through each categories anime and sort them and insert DOM elements to the website
  content.innerHTML = Object.keys(animeByCategories)
    .map((key) => {
      const animeDOM = animeByCategories[key]
        .sort(
          (a, b) => a.episodes - b.episodes //  console.log(data)
        )
        .map((anime) => {
          return `
   
    <div class="card">
   <img src="${anime.image_url}" class="card-img-top" alt="...">
   <div class="card-body">
     <h5 class="card-title">${anime.title}</h5>
     <p class="card-text">${anime.synopsis}</p>
     <a href="${anime.url}" class="btn btn-primary" target="_blank">Find out more</a>
   </div>
 </div>
      `;
        })
        .join("");

      return ` <div>
      <h2>${key.toUpperCase()}</h2>
      <div class="my-grid">${animeDOM}</div>

              </div>
      
      `;
    })
    .join("");
}

//create error when nothing is typed
function showError() {
  //clear error from duplicating
  removeError();
  //create error div
  let error = document.createElement("div");
  error.className = "alert alert-danger";
  error.appendChild(document.createTextNode("You did not type anything!!"));
  content.append(error);
  //clear error after 3 secs
  setTimeout(removeError, 3000);
}

function removeError() {
  let current = document.querySelector(".alert");
  if (current) {
    current.remove();
  }
}

//listen for submit
submit.addEventListener("click", fetchAnime);
