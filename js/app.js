document.addEventListener("DOMContentLoaded", function () {

    function renderRecipes(recipesArray) {
        var recipeHTML = recipesArray.map(currentRecipe => {
            return ` 
                <div class="card recipe">
                    <img class="card-img-top" src="${currentRecipe.image}" alt="movie poster">
                    <div class="card-body">
                        <h5 class="card-title">${currentRecipe.title}</h5>
                        <p class="card-likes">Likes: ${currentRecipe.likes}</p>
                    </div>
                 </div>       
                `

        }).join("");

        document.getElementsByClassName("results")[0].innerHTML = recipeHTML;
    }

    document.getElementById("search-form").addEventListener("submit", function (e) {
        e.preventDefault();

        var searchString = document.getElementById('search-bar').value.split(" ").join("").toLowerCase();

        axios({
            "method":"GET",
            "url":"https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients",
            "headers":{
                "content-type":"application/octet-stream",
                "x-rapidapi-host":"spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "x-rapidapi-key":"d64ead36d4msh2d7c35ad33b43ddp1579e9jsnec14e0565611"
            },"params":{
                "number":"5",
                "ranking":"1",
                "ignorePantry":"false",
                "ingredients":`${ searchString }`
            }
        })
            .then((response)=>{

                recipeData = response.data;

                var recipesContainer = document.getElementsByClassName("results")[0];

                var recipeHTML = renderRecipes(recipeData);
                recipesContainer.innerHTML = recipeHTML;

                renderRecipes(recipeData);

            })
            .catch((error)=>{
                console.log(error)
            })
    });


});






