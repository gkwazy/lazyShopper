console.log("yo")


$("#submit").on("click", function(event){
    event.preventDefault();
    
    var buttonValue = $('#storeLocator').val()
    console.log(buttonValue);
    
    var queryURL = "http://api.walmartlabs.com/v1/stores?format=json&zip=" + buttonValue + "&apiKey=dw49zcatfq86efbzy9yc2ku3"
    
    $.ajax({
      url: queryURL,
      headers: {
        'X-Originating-IP': '65.130.232.218',
        },
      method: "GET"
    }).done(function(storeLocator){
      console.log(storeLocator);
    })



})