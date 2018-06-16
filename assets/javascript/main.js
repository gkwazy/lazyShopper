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
var auth = firebase.auth();

var txtEmail = $('#txtEmail');
var txtPassword = $('#txtPassword');
var btnLogin = $('#btnLogin');
var btnSignUp = $('#btnSignUp');
var btnLogout = $('#btnLogout');

//add login event
btnLogin.on("click", function (e) {
    e.preventDefault();
    // get user and password
    var email = txtEmail.val().trim();
    var pass = txtPassword.val().trim();
    // sign in
    auth.signInWithEmailAndPassword(email, pass).then(function (e) {
        console.log(e.message);
    })
    // $('.modal').modal('hide')
})

// Add signup event
btnSignUp.on("click", function (e) {
    e.preventDefault();
    // get user and password
    var email = txtEmail.val().trim();
    var pass = txtPassword.val().trim();
    // sign in
    auth.createUserWithEmailAndPassword(email, pass).then(function (e) {
        console.log(e.message);
    });
    //  $('.modal').modal('hide')
});



// Logout Btn
btnLogout.on("click", function (e) {
    e.preventDefault();
    firebase.auth().signOut();
    txtEmail.val('');
    txtPassword.val('');
    $('.modal').modal('show');

})

// Add a realtime listener
firebase.auth().onAuthStateChanged(function (firebaseUser) {
    if (firebaseUser) {
        console.log(firebaseUser);
        var userEmail = firebaseUser.email;
        console.log("  Email: " + firebaseUser.email);
        var uid = firebaseUser.uid;
        console.log("  Provider-specific UID: " + firebaseUser.uid);
        database.ref('users/' + uid).set({
            userEmail: userEmail,
            uid: uid
        });
        $('.modal').modal('hide');
        database.ref('users/' + uid).on("value", function (snapshot) {
            console.log(snapshot.val(), 'this should be our current user we need later on.');
            database.ref(`users/${uid}/recipies`).set({
                // push our urls to this path
                url: "dank green chili",
            });
        });
        btnLogout.show();
    } else {
        console.log('not logged in');
        btnLogout.hide();
        $('.modal').modal('show');
    }
})

var wantedItem;
var wantedURL = [];


$('#add-item').on("click", function (event) {
    event.preventDefault();

    //set wantedItem to input from user
    wantedItem = $('#item-input').val().trim()
    // console.log(wantedItem)

    //send wanted item to firebase 
    var savedItem = {
        name: wantedItem,
    }

    ajaxCall();

})
loadList();


$('#myModal').modal({
    show: true
});

function ajaxCall() {
    $(".listOfRecipes").empty();
    $(".listOfNutrtion").empty();
    $(".recipeAdd").empty();
    loadList();

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

            $(".listOfNutrtion").append("<h1 class='label-click' data-recipe = '" + ingd[i].recipe.url + "' data-name = '" + label + "'>" + label + "</h1>")

            for (j = 0; j < ingd[i].recipe.ingredientLines.length; j++) {
                listIngd.push(ingd[i].recipe.ingredientLines[j]);
                $(".listOfNutrtion").append("<br>" + ingd[i].recipe.ingredientLines[j] + "</br>");


            }


        }

    });


    //URL for the food nutrtion. 
    var queryURLNutrition = `https://api.edamam.com/api/nutrition-data?app_id=${foodAppId}&app_key=${foodAppKey}&ingr=1%20large%20${wantedItem}`

    //ajax call for the nutrition
    $.ajax({

        url: queryURLNutrition,
        method: "GET"
    }).then(function (returned) {

        foodIngd = returned.hits;
        console.log(returned);
        var label;

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
    $('#closestStores').empty();

    var buttonValue = $('#storeLocator').val();
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
    event.preventDefault();

    // This line will grab the text from the input box
    var ingredient = $("#item-input").val().trim();
    // The ingredient from the textbox is then added to our array
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
    $('.recipeAdd').empty()


    ingredients = [];

});
$("#save").on("click", function (event) {
    var email = $('#user-name').val();
    var password = $('#password-text').val();
    console.log(email + password);

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        console.log(error)
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
})

$("#dump-item").on("click", ".label-click", function (event) {
    event.preventDefault();
    $(".recipeAdd").empty();
    wantedURL = [];
    console.log("button clicked")
    var newURL = {
        url: $(this).attr("data-recipe"),
        label: $(this).attr("data-name")
    };
    database.ref("URLs").once("value", function (snapshot) {
        for (i = 0; i < snapshot.val().wantedURL.length; i++) {
            wantedURL.push(snapshot.val().wantedURL[i]);
            console.log((snapshot.val()));
        }

        console.log(wantedURL + ":wantedURL")
        console.log(newURL + " this stuff")
        for (i = 0; i < wantedURL.length; i++) {
            var match = false;
            console.log(wantedURL[i].label);
            console.log(newURL.label);
            if (wantedURL[i].label === newURL.label) {
                match = true;
            }
        }
        if (match === false) {
            wantedURL.push(newURL);
            console.log("it was pushed!" + match);
        }
        database.ref("URLs").set({
            wantedURL
        });

        for (i = 0; i < wantedURL.length; i++) {
            console.log("completed");
            $(".recipeAdd").append("<br>" + wantedURL[i].label.link(wantedURL[i].url) + "</br>");
        }
    });
});

function loadList() {
    console.log("loadList ran");
    $(".recipeAdd").empty();
    database.ref("URLs").once("value", function (snapshot) {
        for (i = 0; i < snapshot.val().wantedURL.length; i++) {
            wantedURL.push(snapshot.val().wantedURL[i]);
            $(".recipeAdd").append("<br>" + wantedURL[i].label.link(wantedURL[i].url) + "</br>");
            console.log("load list wanted; " + wantedURL[i])
        }
    });
};