document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("search-button2").addEventListener("submit", function (e) {
            console.log('bank');
         e.preventDefault();
        let data = [];

        var renderIngredients = function() {
            let saveString = document.getElementById("search-bar").value.split(" ").join("-").toLowerCase();
            var outputIngredients = document.getElementById("output");
            
            //Get the text area input
            var gotIngredients = saveString.value;

            if(gotIngredients) {
                //Store the data
                data.push(gotIngredients);

                var outputHtml = document.createElement("p");
                outputHtml.innerHTML = gotIngredients;

                outputIngredients.append(outputHtml);

                //Reset text area input
                //textAreaElement.value = "";

                console.log(data);
            } else{
                alert("No Content");
            }
    }
    });
});

        ////end new code /////