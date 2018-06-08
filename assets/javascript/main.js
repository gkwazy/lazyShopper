console.log("yo");
var appId = "d6f00b57";
var appKey = "971c028b76c7d2aaa76db5c08e3acfbf";
var wantedItem = "squash";
var quaryURL = `https://api.edamam.com/search?q=${wantedItem}&app_id=${appId}&app_key=${appKey}&from=0&to=10&calories=591-722&health=alcohol-free`
var ingd;
$.ajax({
    url: quaryURL,
    method: "GET"
}).then(function (response) {
    console.log(response);
    ingd = response.hits;
    console.log(ingd);
    var label;
    var listIngd = [];
    for (i = 0; i < ingd.length; i++) {
        $("#listOfItem").append("<tr> ")

        label = ingd[i].recipe.label;
        console.log("\nTHIS IS A NEW RECIPE!! \n")
        for (j = 0; j < ingd[i].recipe.ingredientLines.length; j++) {
            listIngd.push(ingd[i].recipe.ingredientLines[j]);
            $("#listOfItem").append("<td scope=col >" + ingd[i].recipe.ingredientLines[j] + "</td>")

            console.log(ingd[i].recipe.ingredientLines[j])

        }
        $("#listOfItem").append("</tr>")
    }

});