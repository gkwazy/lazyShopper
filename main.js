console.log("yo")


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