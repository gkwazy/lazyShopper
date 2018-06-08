
var appId = "d6f00b57";
var appKey = "971c028b76c7d2aaa76db5c08e3acfbf";
var wantedItem = "squash";
var quaryURL = `https://api.edamam.com/search?q=${wantedItem}&app_id=${appId}&app_key=${appKey}&from=0&to=3&calories=591-722&health=alcohol-free`
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

$("#submit").on("click", function(event){
    event.preventDefault();
    
    var buttonValue = $('#storeLocator').val()
    console.log(buttonValue);
    
    var queryURL = "http://api.walmartlabs.com/v1/stores?format=json&zip=" + buttonValue + "&apiKey=dw49zcatfq86efbzy9yc2ku3"
    
    $.ajax({
      url: queryURL,
      method: "GET",
      dataType: "jsonp",
    }).done(function(storeLocator){
      console.log(storeLocator);
      var closestStores = storeLocator.slice(0, 3);
      console.log(closestStores);
      for (var i = 0; i < closestStores.length; i++) {
        //we need to gen a bunch of HTML elemts to put our store data inside
        var div = $('<div></div>')
        
      }
    })



})