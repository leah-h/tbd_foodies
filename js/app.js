document.addEventListener("DOMContentLoaded", function () {

    function renderRecipes(recipesArray) {
        var recipeHTML = recipesArray.map(currentRecipe => {
            return ` 
                <div class="card recipe">
                    <img class="card-img-top" src="${currentRecipe.image}" alt="recipe image">
                    <div class="card-body">
                        <h5 class="card-title">${currentRecipe.title}</h5>
                        <p class="card-likes">Likes: ${currentRecipe.likes}</p>
                                <!-- Button trigger modal -->
                <button class="butn" data-toggle="modal" data-target="#exampleModalLong" id="recipe-info" onclick="getRecipe(${currentRecipe.id})">
                See recipe
                </button>
                
                <!-- Modal -->
                <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    
                    <div class="modal-body"> 
                    <div id="card-recipe-image"></div>
                    <p id="card-recipe-instructions"></p>
                    <div id="card-recipe-ingredients"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="saveRecipe(${currentRecipe.id})" id="saveButton_${currentRecipe.id}" >Save Recipe</button>

                    </div>
                    </div>
                </div>
                </div>
                    </div>
                </div>       
                `

        }).join("");

        document.getElementsByClassName("results")[0].innerHTML = recipeHTML;
    }

    document.getElementById("search-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const searchString = document.getElementById('search-bar').value.split(" ").join("").toLowerCase();

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
                "ingredients":`${searchString}`
            }
        })
            .then((response)=>{

                recipeData = response.data;

                const sortedRecipe = recipeData.sort(compareValues('likes', 'desc'));
                console.log(sortedRecipe);

                const recipesContainer = document.getElementsByClassName("results")[0];

                renderRecipes(sortedRecipe);

            })
            .catch((error)=>{
                console.log(error)
            })
    });

});

function getRecipe(id) {

    axios({
        "method":"GET",
        "url":`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`,
        "headers":{
            "content-type":"application/octet-stream",
            "x-rapidapi-host":"spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            "x-rapidapi-key":"d64ead36d4msh2d7c35ad33b43ddp1579e9jsnec14e0565611"
        }
    })
        .then((response)=>{
            console.log(response);

            const recipeTitle = document.getElementById('exampleModalLongTitle');
            const recipeImage = document.getElementById('card-recipe-image');
            const recipeInstructions = document.getElementById('card-recipe-instructions');
            const recipeIngredients = document.getElementById('card-recipe-ingredients');
            
            let result = response.data.extendedIngredients.map(({ originalString }) => originalString);
            
            recipeTitle.innerText = `${ response.data.title }`;
            recipeImage.innerHTML = `<img src="${response.data.image}" alt="recipe image">`;
            recipeInstructions.innerText = `${ response.data.instructions}`;
            recipeIngredients.innerHTML = `Ingredients: ${result}`;

        })
        .catch((error)=>{
            console.log(error)
        })
}

function saveRecipe(id) {
    let recipe = recipeData.find(function(currentRecipe) {
        return currentRecipe.id == id;      
    });
        console.log(recipe, id);
            

    let recipeListJSON = localStorage.getItem('recipeList');
    let recipeList = JSON.parse(recipeListJSON);
        if (recipeList == null) {
            recipeList= [];
        } 
    recipeList.push(recipe); 


    let recipeButton = document.getElementById(`saveButton_${id}`);
    recipeButton.innerHTML = "Saved!";
    recipeButton.className = ("disabled");


    recipeListJSON = JSON.stringify(recipeList);
    localStorage.setItem('recipeList', recipeListJSON);


}



function compareValues(key, order='asc') {
    return function(a, b) {
        if(!a.hasOwnProperty(key) ||
            !b.hasOwnProperty(key)) {
            return 0;
        }

        const varA = a[key];
        const varB = b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order == 'desc') ?
                (comparison * -1) : comparison
        );
    };
}







