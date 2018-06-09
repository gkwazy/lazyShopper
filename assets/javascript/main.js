
var appId = "d6f00b57";
var appKey = "971c028b76c7d2aaa76db5c08e3acfbf";
var wantedItem = "squash";
var foodAppId = "9183a0c7";
var foodAppKey = "7efa96f54a882dc6ee414a8e33e14889";
var quaryURL = `https://api.edamam.com/search?q=${wantedItem}&app_id=${appId}&app_key=${appKey}&from=0&to=3&calories=591-722&health=alcohol-free`
var foodQueryURL = `https://api.edamam.com/api/food-database/parser?ingr=${wantedItem}&app_id=${foodAppId}&app_key=${foodAppKey}&page=0`
var ingd;
$.ajax({
    url: quaryURL,
    method: "GET"
}).then(function (response) {

    ingd = response.hits;

    var label;
    var listIngd = [];
    for (i = 0; i < ingd.length; i++) {
        $("#listOfItem").append("<tr> ")

        label = ingd[i].recipe.label;

        for (j = 0; j < ingd[i].recipe.ingredientLines.length; j++) {
            listIngd.push(ingd[i].recipe.ingredientLines[j]);
            $("#listOfItem").append("<td scope=col >" + ingd[i].recipe.ingredientLines[j] + "</td>")



        }
        $("#listOfItem").append("</tr>")
    }

});
$.ajax({
    url: foodQueryURL,
    method: "GET"
}).then(function (callBack) {

    foodItem = callBack.hits;
    console.log(callBack);

    // var label;
    // var listIngd = [];
    // for (i = 0; i < ingd.length; i++) {
    //     $("#listOfItem").append("<tr> ")

    //     label = ingd[i].recipe.label;

    //     for (j = 0; j < ingd[i].recipe.ingredientLines.length; j++) {
    //         listIngd.push(ingd[i].recipe.ingredientLines[j]);
    //         $("#listOfItem").append("<td scope=col >" + ingd[i].recipe.ingredientLines[j] + "</td>")



    //     }
    //     $("#listOfItem").append("</tr>")
    // }

});