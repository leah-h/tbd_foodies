document.addEventListener("DOMContentLoaded", function () {

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
                console.log(response);

            })
            .catch((error)=>{
                console.log(error)
            })
    });


});



