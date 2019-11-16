
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
                                        <div id="card-recipe-add-info"></div>               
                                        <p id="card-recipe-instructions"></p>
                                        <div id="card-recipe-ingredients"></div>
                                    </div>

                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" id="save-to-faves">Save to Favorites</button>
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>

                                </div>
                            </div>
                            <!-- end modal -->    
                        </div>
                    </div>
                </div>    
                `

        }).join("");

        document.getElementsByClassName("results")[0].innerHTML = recipeHTML;
    }

    document.getElementById("search-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const searchString = document.getElementById('search-bar').value.split(" ").join(",").toLowerCase();
        console.log(searchString);  

        axios({
            "method":"GET",
            "url":"https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients",
            "headers":{
                "content-type":"application/octet-stream",
                "x-rapidapi-host":"spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "x-rapidapi-key":"d64ead36d4msh2d7c35ad33b43ddp1579e9jsnec14e0565611"
            },"params":{
                "number":"12",
                "ranking":"1",
                "ignorePantry":"false",
                "ingredients":`${searchString}`,
                "instructionsRequired":"true",

            }

        
        })
            .then((response)=>{
                console.log(response)

                recipeData = response.data;

                const sortedRecipe = recipeData.sort(compareValues('likes', 'desc'));

                const recipesContainer = document.getElementsByClassName("results")[0];

                renderRecipes(sortedRecipe);

            })
            .catch((error)=>{ 
                // insert conditional logic here? or a continue statement?
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
            recipe = response.data;

            const recipeTitle = document.getElementById('exampleModalLongTitle');
            const recipeImage = document.getElementById('card-recipe-image');
            const recipeAddInfo = document.getElementById('card-recipe-add-info');
            const recipeInstructions = document.getElementById('card-recipe-instructions');
            const recipeIngredients = document.getElementById('card-recipe-ingredients');

            let recipeLikesCount = response.data.aggregateLikes;
            let recipeLikes = document.createElement('p');
            recipeLikes.innerHTML = `Likes: ${ recipeLikesCount }`;

            let recipeServingsCount = response.data.servings;
            let recipeServings = document.createElement('p');
            // recipeServings.innerHTML = `Yield: ${ recipeServingsCount } servings`;

            recipeAddInfo.innerHTML = `Yield: ${recipeServingsCount} servings <br> Likes: ${ recipeLikesCount }`;

            let result = response.data.extendedIngredients.map(({ originalString }) => originalString);
            let instructions = response.data.analyzedInstructions[0].steps;

            recipeTitle.innerText = `${ response.data.title }`;
            recipeImage.innerHTML = `<img src="${response.data.image}" alt="recipe image">`;
            recipeInstructions.innerText = `${ response.data.instructions}`;

            let instructionsList = document.createElement('ol');
            instructions.forEach(instruction => {
                let li = document.createElement('li');
                instructionsList.appendChild(li);
                li.innerHTML += instruction.step;
            });

            recipeInstructions.innerText = 'Preparation: ';
            recipeInstructions.appendChild(instructionsList);

            let recipeList = document.createElement('ul');

            result.forEach(ingredient => {
                let li = document.createElement('li');
                recipeList.appendChild(li);
                li.innerHTML += ingredient;
            });

            recipeIngredients.innerText = 'Ingredients: ';
            recipeIngredients.appendChild(recipeList);

            saveToFaves_Btn = document.getElementById('save-to-faves');
            saveToFaves_Btn.addEventListener('click', function(e) {
                e.preventDefault();

                var firebaseRef = firebase.database().ref('recipes');
                data = {
                    title: `${response.data.title}`,
                    image: `<img src="${response.data.image}" alt="recipe image">`,
                    likes: recipeLikesCount,
                    yield: recipeServingsCount,
                    instructions: instructions,
                    ingredients: result
                };

                firebaseRef.push().set(data);
            });

        })
        .catch((error)=>{
            console.log(error)
        })
}


function saveRecipe(id) {
    console.log(recipe, id, "id");

    let recipeListJSON = localStorage.getItem('recipeList');
    let recipeList = JSON.parse(recipeListJSON);
        if (recipeList == null) {
            recipeList= [];
        } 
    recipeList.push(recipe); 
    recipeButton = document.getElementById('saveButton');
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

getRecipeFaves_Btn = document.getElementById('get-recipe-faves-list');
getRecipeFaves_Btn.addEventListener('click', function (e) {
    window.alert('You clicked me!');
    e.preventDefault();

    var rootRef = firebase.database().ref().child('recipes');
    rootRef.on('child_added', snapshot => {
            snapshot.forEach(function (childSnapshot) {
                console.log(childSnapshot);
                // renderRecipes(childSnapshot);
            })
        });


});
















