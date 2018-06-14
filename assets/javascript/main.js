console.log("yo");

var config = {
    apiKey: "AIzaSyDWjwGAMxs6Xcd-wGfz-Fgi960RZLhJ70s",
    authDomain: "lazyshopper-3cd30.firebaseapp.com",
    databaseURL: "https://lazyshopper-3cd30.firebaseio.com",
    projectId: "lazyshopper-3cd30",
    storageBucket: "",
    messagingSenderId: "162604132617"
};
firebase.initializeApp(config);
var database = firebase.database();


var txtEmail = $('#txtEmail')
var txtPassword = $('#txtPassword')
var btnLogin = $('#btnLogin')
var btnSignUp = $('#btnSignUp')
var btnLogout = $('#btnLogout')

//add login event
btnLogin.on("click", function (e) {
    // get user and password
    var email = txtEmail.val().trim()
    var pass = txtPassword.val().trim()
    var auth = firebase.auth()
    // sign in
    auth.signInWithEmailAndPassword(email, pass).then(function(e){
        console.log(e.message)
      })
    $('.modal').modal('hide')
})

// Add signup event
btnSignUp.on("click", function (e) {
     // get user and password
     var email = txtEmail.val().trim()
     var pass = txtPassword.val().trim()
     var auth = firebase.auth()
     // sign in
     auth.signInWithEmailAndPassword(email, pass).then(function(e){
        console.log(e.message)
      })
     $('.modal').modal('hide')
})

// Logout Btn
btnLogout.on("click", function (e) {
    firebase.auth().signOut()
    txtEmail.val('')
    txtPassword.val('')
    $('.modal').modal('show')

})

// Add a realtime listener
firebase.auth().onAuthStateChanged(function (firebaseUser) {
    if(firebaseUser) {
        console.log (firebaseUser)
        $('.modal').modal('hide')
        btnLogout.show()
    } else {
        console.log('not logged in')
        btnLogout.hide()
        $('.modal').modal('show')
    }
})

// // Add a realtime listener
// firebase.auth().onAuthStateChanged(function (firebaseUser) {
//     if(firebaseUser) {
//         console.log (firebaseUser)
//         var userEmail =  firebaseUser.email;
//         var splitEmail = userEmail.split('@');
//         var userName = splitEmail[0];
//         // $('.modal').hide()
//         database.ref('users/' + userName).set({
//             userEmail: userEmail,
//             userName: userName
//         })
//         btnLogout.show()
//     } else {
//         console.log('not logged in')
//         btnLogout.hide()
//         // $('.modal').show()
//     }
// })
// database.ref('users/').on('value', function(snapshot){
//     console.log(snapshot.val());
// })

// database.ref('users/asdf').on("value", function(snapshot){
//     console.log(snapshot.val(), 'this should be our user we need later on.');
//     database.ref('users/asdf/recipies').set({
//         name: "dank green chili",
//         ingredients: ['chili', 'beans']
//     })
// })

var wantedItem;

$('#add-item').on("click", function (event){
    event.preventDefault();

    //set wantedItem to input from user
    wantedItem = $('#item-input').val().trim()
    // console.log(wantedItem)

    //send wanted item to firebase 
    var savedItem = {
        name: wantedItem,
    }
    console.log(savedItem)

    database.ref().push(savedItem);

    console.log(savedItem.name);

    //   alert("Item successfully added");

    //   $("#item-input").val("");

    ajaxCall();
    
})
//add saved items to page from firebase
database.ref().on("child_added", function (snapshot) {
 
  var name = snapshot.val().name;
  console.log(name);
})


//ajaxCall();

// ajaxCall();

$('#myModal').modal({ show: true });

function ajaxCall() {
    $(".listOfRecipes").empty();
    $(".listOfNutrtion").empty();


    var foodAppId = "ad90d902";
    var foodAppKey = "92d0ccc447ac37767ca7d6859ff6a3ac";
    //item that the user is searching for, var gathered 
    //for, the search bar



    //api key for the recipe api
    var appId = "d6f00b57";
    var appKey = "971c028b76c7d2aaa76db5c08e3acfbf";

    var queryURLRecipe = `https://api.edamam.com/search?q=${wantedItem}&app_id=${appId}&app_key=${appKey}&from=0&to=3&calories=591-722&health=alcohol-free`;
    //var to help with all the information in the JOSN
    var ingd;
    //ajox call to the recipe api for the users information
    $.ajax({

        url: queryURLRecipe,
        method: "GET"
    }).then(function (response) {

        ingd = response.hits;
        console.log(response);
        var label;
        var listIngd = [];
        //appending the wanted information to the HTML for the users view. 
        for (i = 0; i < ingd.length; i++) {
            $(".listOfNutrtion").append("<br> ");

            label = ingd[i].recipe.label;

            $(".listOfNutrtion").append("<h1>" + label + "<h1>");

            for (j = 0; j < ingd[i].recipe.ingredientLines.length; j++) {
                listIngd.push(ingd[i].recipe.ingredientLines[j]);
                $(".listOfNutrtion").append("<br>" + ingd[i].recipe.ingredientLines[j] + "</br>");


            }


        }

    });


    //URL for the food nutrtion. 
    var queryURLNutrition = `https://api.edamam.com/api/nutrition-data?app_id=${foodAppId}&app_key=${foodAppKey}&ingr=1%20large%20${wantedItem}`
    var foodIngd;
    //ajax call for the nutrition
    $.ajax({

        url: queryURLNutrition,
        method: "GET"
    }).then(function (returned) {

        foodIngd = returned.hits;
        console.log(returned);
        var label;
        var foodListIngd = [];
        //appending the wanted information to the html for the user to view

        wantedInformation = ["FAT", "CHOCDF", "FIBTG"];
        $(".listOfRecipes").append("<h2>Nutrients</h2>");
        $(".listOfRecipes").append("<br> calories: " + returned.calories + "</br>");
        for (i = 0; i < wantedInformation.length; i++) {
            var nutritionInfor = wantedInformation[i];
            var label = returned.totalNutrients[nutritionInfor].label;
            var quantity = returned.totalNutrients[nutritionInfor].quantity;
            var unit = returned.totalNutrients[nutritionInfor].unit;
            var quantityPer = returned.totalDaily[nutritionInfor].quantity;
            var unitPer = returned.totalDaily[nutritionInfor].unit;

            $(".listOfRecipes").append("<br> " + label + ": " + Math.round(quantity) + unit + " Daily Amount " + Math.round(quantityPer) + unitPer + "</br>");
        }
    });
}

$("#submit").on("click", function (event) {
    event.preventDefault();
    $('#closestStores').empty()

    var buttonValue = $('#storeLocator').val()
    console.log(buttonValue);

    var queryURLWalmart = `http://api.walmartlabs.com/v1/stores?format=json&zip=${buttonValue}&apiKey=dw49zcatfq86efbzy9yc2ku3`

    $.ajax({
        url: queryURLWalmart,
        method: "GET",
        dataType: "jsonp",
    }).done(function (storeLocator) {
        console.log(storeLocator);
        var closestStores = storeLocator.slice(0, 3);
        console.log(closestStores);
        for (var i = 0; i < closestStores.length; i++) {
            //we need to gen a bunch of HTML elemts to put our store data inside
            // var div = $('<div></div>')

            var name = storeLocator[i].name
            var phoneNumber = storeLocator[i].phoneNumber
            var streetAddress = storeLocator[i].streetAddress
            var city = storeLocator[i].city
            var stateProvCode = storeLocator[i].stateProvCode
            var zip = storeLocator[i].zip

            // div.attr("id", "closeStoreList")
            // div.attr("data-store", "<strong>Store Name: </strong>" + name + "<br>" + "<strong>Phone Number: </strong>" + phoneNumber + "<br>" + "<strong>Address: </strong>" + streetAddress + " " + city + ", " + stateProvCode + " " + zip + "<br><br>")

            $('#closestStores').append(`<strong>Store Name: </strong>${name}<br><strong>Phone Number: </strong>${phoneNumber}<br><strong>Address: </strong>${streetAddress} ${city}, ${stateProvCode} ${zip}<br><br>`)

        }
        console.log(storeLocator[0].name)
        console.log(storeLocator[0].phoneNumber)
        console.log(storeLocator[0].streetAddress)
        console.log(storeLocator[0].city)
        console.log(storeLocator[0].stateProvCode)
        console.log(storeLocator[0].zip)


    })

})
A = [];

var ingredients = [];
renderButtons();
// Function for displaying ingredient buttons
function renderButtons() {

    // Deleting the ingredient buttons prior to adding new ingredient buttons
    // (this is necessary otherwise we will have repeat buttons)
    $("#new-item").empty();

    // Looping through the array of ingredients
    for (var i = 0; i < ingredients.length; i++) {

        // Then dynamicaly generating buttons for each ingredient in the array.
        var a = $("<button>");
        // Adding a class
        a.addClass("ingredients");
        // Adding a data-attribute with a value of the ingredient at index i
        a.attr("data-name", ingredients[i]);
        // Providing the button's text with a value of the ingredient at index i
        a.text(ingredients[i]);
        // Adding the button to the HTML
        $("#new-item").append(a);
        console.log("ingredients")
    }


}


// This function handles events where one button is clicked
$("#add-item").on("click", function (event) {
    // event.preventDefault() prevents the form from trying to submit itself.
    // We're using a form so that the user can hit enter instead of clicking the button if they want
    event.preventDefault();

    // This line will grab the text from the input box
    var ingredient = $("#item-input").val().trim();
    // The giphy from the textbox is then added to our array
    console.log(ingredients.indexOf(ingredient));
    console.log()
    if (ingredients.indexOf(ingredient) < 0 && ingredient != "") {
        ingredients.push(ingredient.toLowerCase());
    }
    // calling renderButtons which handles the processing of our array
    renderButtons();
    $("#item-input").val("");
});

$("#new-item").on("click", ".ingredients", function () {
    wantedItem = $(this).attr("data-name");
    console.log(wantedItem);
    ajaxCall();

});

$("#clear-button").on("click", function (event) {
    $("#new-item").empty();
    $('#dump-item-2').empty()
    $('#dump-item').empty()


    ingredients = [];
});