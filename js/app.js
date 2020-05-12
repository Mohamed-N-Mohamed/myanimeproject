//doms
const search = document.getElementById("search");
const form = document.getElementById("form");
const submit = document.getElementById("btn");
const row = document.getElementById("row");
const content = document.querySelector(".anime-content");

//api path
//fetch anime data
async function fetchAnime(e) {
  e.preventDefault();
  if (search.value.trim() === "") {
    //show error
    alert("you need to type something");
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


  content.innerHTML = Object.keys(animeByCategories)
    .map((key) => {
      const animeDOM = animeByCategories[key]
        .sort(
          (a, b) => a.episodes - b.episodes //  console.log(data)
        )
        .map((anime) => {
          return `
   
    <div class="card" style="width: 18rem;">
   <img src="${anime.image_url}" class="card-img-top" alt="...">
   <div class="card-body">
     <h5 class="card-title">${anime.title}</h5>
     <p class="card-text">${anime.synopsis}</p>
     <a href="${anime.url}" class="btn btn-primary">Go somewhere</a>
   </div>
 </div>
      `;
        })
        .join("");

      return ` <section>
      <h2>${key.toUpperCase()}</h2>
      <div class="my-grid">${animeDOM}</div>

              </section>
      
      `;
    })
    .join('');
}
//listen for submit
submit.addEventListener("click", fetchAnime);
