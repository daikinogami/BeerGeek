// define some global variables
var BUCKET_BEER_NAME = "BeerObject";
var BUCKET_BRUERY = "BrueryObject";
var BUCKET_CATEGORY = "CategoryObject";

var _beerObjects = null;
var _myBeerObjects = null;
var _brueryObjects = null;
var _categoryObjects = null;
var _selectBeerObjects = null;
var _selectedObject = null;

var objectCount = 0;
var beerColor = {"h": 40, "s": 100, "l": 50};
var inProgress = false;
var isFBLogin = false;
var selectedMainPage = "all";


function moveToOptionPage() {
    $.mobile.changePage("userpage.html");

    // $.mobile.changePage({  
    //         url: "userpage.html",   
    //         type: "post",  
    //         data: "hoge=piyo"  
    //     }, "fade", false, false, false);
    // $.mobile.changePage("#userInfoPage");
}

function moveToAddBeerPage(){
    $.mobile.changePage("addbeer.html");

    // $.mobile.changePage({  
    //         url: "addbeer.html",   
    //         type: "post",  
    //         data: "hoge=piyo"  
    //     }, "fade", false, false, false);
    // $.mobile.changePage("#addBeerPage");
}

function moveToMainPage(){
    $.mobile.changePage("main.html");

    // $.mobile.changePage({  
    //         url: "main.html",   
    //         type: "post",  
    //         data: "hoge=piyo"  
    //     }, "slide", false, false, false);
    // $.mobile.changePage("#listPage");
}

function moveToBeerDetailPage(object){
    _selectedObject = object;
    $.mobile.changePage("beerDetail.html");

    // $.mobile.changePage({  
    //         url: "beerDetail.html",   
    //         type: "post",  
    //         data: "hoge=piyo"  
    //     }, "fade", false, false, false);
    // $.mobile.changePage("#beerDetailPage");
}

function moveToLogInPage() {
    $.mobile.changePage("index.html");

    // $.mobile.changePage({  
    //         url: "index.html",   
    //         type: "post",  
    //         data: "hoge=piyo"  
    //     }, "fade", false, false, false);
    // $.mobile.changePage("#loginPage");
}

function moveToAllPage(){
    $.mobile.showPageLoadingMsg();
    $("#allPageArea").css("display", "block");
    $("#selectAllButton").addClass("ui-btn-active");
    $("#userPageArea").css("display", "none");
    $("#searchPageArea").css("display", "none");
    loadAllList();
    selectedMainPage = "all";
    $.mobile.hidePageLoadingMsg();
}
function moveToUserPage(){
    $("#allPageArea").css("display", "none");
    $("#userPageArea").css("display", "block");
    $("#selectUserButton").addClass("ui-btn-active");
    $("#searchPageArea").css("display", "none");
    loadMyList();
    selectedMainPage = "user";
}
function moveToSearchPage(){
    $("#allPageArea").css("display", "none");
    $("#userPageArea").css("display", "none");
    $("#searchPageArea").css("display", "block");
    $("#selectSearchButton").addClass("ui-btn-active");
    selectedMainPage = "search";
    initializeSearch();
}


function addToBeerList() {

    if(!inProgress){
        // show a loading animation
        $.mobile.showPageLoadingMsg();
        inProgress = true;

        // get the defined bucket belonging to this user
        var bucket = Kii.bucketWithName(BUCKET_NAME);

        var user = KiiUser.getCurrentUser();
        
        // create the object
        var object = bucket.createObject();
        
        // set a key/value pair
        object.set("name", "ライジングサン");
        object.set("bruery", "ベアードビール");
        object.set("category", "ペールエール");
        object.set("alcohol", 5.3);
        object.set("color", {"h": 40, "s": 100, "l": 50});
        
        // perform an asynchronous creation, with callbacks
        object.save({

            // callback for a successful deletion
            success: function(theSavedObject) {

                // create a DOM element for this object
                loadAllList();
                
                // hide the loader
                $.mobile.hidePageLoadingMsg();
                inProgress = false;
            },
            
            // callback for a failed creation
            failure: function(theObject, anErrorString) {

                // hide the loading animation
                $.mobile.hidePageLoadingMsg();
                inProgress = false;
                
                // tell the user
                alert("Unable to create object: " + anErrorString);
                
                // tell the console
                Kii.logger("Unable to create object: " + anErrorString);
            }
        });
    }
}


// called from the UI, this method removes an object from the server
function removeFromList(index) {

    if(!inProgress){
        // show a loading animation
        $.mobile.showPageLoadingMsg();
        inProgress = true;

        // get a reference to the selected object
        var obj = _beerObjects[index];

        var bucketName = obj.get("opinion");
        // deleteBucketAsync(bucketName).then(function(){
            // perform an asynchronous deletion, with callbacks
            obj.delete({

                // callback for a successful deletion
                success: function(theDeletedObject) {
                    // find the associated UI element and remove it from the list
                    $("[uri='"+index+"']").remove();
                    
                    // hide the loader
                    $.mobile.hidePageLoadingMsg();
                    inProgress = false;
                },
                
                // callback for a failed deletion
                failure: function(theObject, anErrorString) {
                    // hide the loading animation
                    $.mobile.hidePageLoadingMsg();
                    inProgress = false;
                    
                    // tell the user
                    alert("Unable to delete object: " + anErrorString);
                    
                    // tell the console
                    Kii.logger("Unable to delete object: " + anErrorString);
                }
            });
        // }, function(){
        //     // hide the loader
        //     $.mobile.hidePageLoadingMsg();
        //     inProgress = false;

        //     console.log("Error: Can't remove opinion bucket.");
        // });
    }
    
}



// a UI method to create a list item based on a KiiObject
function createBeerListItem(obj, index) {

    var name = obj.get("name");
    var bruery = obj.get("bruery");
    var category = obj.get("category");
    var alcohol = obj.get("alcohol");
    var color = obj.get("color");
    var rgb = hslToRGB(color.h, color.s, color.l);


    // generate some DOM elements.
    // set the KiiObject URI to an attribute so it can be tracked
    var row = $("<li></li>").attr("uri", index);
    //var block = $("<div class='flexbox'></div>");
    var link = $("<a></a>").attr("href", "javascript:onClickBeerFromList('" + index + "')");
    var colorBox = $("<div class='colorBox'></div>").css("background-color", rgb);
    
    // add the title/subtitle text
    $(link).append("<h3>" + name + "</h3>");
    $(link).append($("<p></p>").text("製造元: " + bruery));
    $(link).append($("<p></p>").text("種類: " + category));
    $(link).append($("<p></p>").text("alco: " + alcohol + "%"));

    
    // build the element
    $(row).append(colorBox);
    $(row).append(link);
    //$(row).append(block);

    var deleteLink = $("<a></a>").attr("href", "javascript:removeFromList('"+index+"')");
    
    
    // build the element
    //$(deleteLink).append("<h3>"+obj.get(KEY_NAME)+"</h3>");
    //$(deleteLink).append("<p>"+obj.getCreated()+"</p>");
    
    // append the delete button to the row
    $(row).append(deleteLink);
    
    // return the entire row
    return row;
}

function onClickBeerFromList(index){
    var list = null;
    switch(selectedMainPage){
        case "all":
            list = _beerObjects;
            break;
        case "user":
            list = _myBeerObjects;
            break;
        case "search":
            list = _searchObject;
            break;
    }
    var target = list[index];

    moveToBeerDetailPage(target);
}


function loadAllList(){

    if(!inProgress){
        // show a loading animation
        $.mobile.showPageLoadingMsg();
        inProgress = true;

        var setListDOM = function(){
            // clear the existing objects from the list
            $("#all_listview").empty();

            // iterate through the result set
            var objects = _beerObjects;
            for(var i=0; i < objects.length; i++) {
            
                // create a row UI element based on the object
                var obj = objects[i];
                var row = createBeerListItem(obj, i);
                
                // add the row to the list
                $("#all_listview").append(row);
            }
            
            // refresh the list to show the added results
            $("#all_listview").listview('refresh');
        }

        if(_beerObjects != null){
            if($("#all_listview").children().length == 0){
                setListDOM();
            }
            
            // hide the loader
            $.mobile.hidePageLoadingMsg();
            inProgress = false;
        }else{
            // Create Application Scope Bucket
            var bucket = Kii.bucketWithName(BUCKET_BEER_NAME);

            // create an empty KiiQuery (will return all objects in the bucket)
            var queryObject = KiiQuery.queryWithClause(null);

            // sort the results by creation date
            queryObject.sortByDesc("_created");

                // perform the asynchronous query, with callbacks defined
            bucket.executeQuery(queryObject, {

                // callback for a successful query
                success: function(queryPerformed, resultSet) {
                    _beerObjects = resultSet;
                    setListDOM();
                    // hide the loader
                    $.mobile.hidePageLoadingMsg();
                    inProgress = false;
                },
                    
                // callback for a failed query
                failure: function(queryPerformed, anErrorString) {

                    // hide the loading animation
                    $.mobile.hidePageLoadingMsg();
                    inProgress = false;
                    
                    // tell the user
                    alert("Unable to execute query: " + anErrorString);
                    
                    // tell the console
                    Kii.logger("Unable to execute query: " + anErrorString);
                }
            });
        }
    }
}



function loadMyList(){

    if(!inProgress){
        // show a loading animation
        $.mobile.showPageLoadingMsg();
        inProgress = true;

        var setMyListDOM = function(){
            // clear the existing objects from the list
            $("#my_listview").empty();

            // iterate through the result set
            var objects = _myBeerObjects;
            for(var i=0; i < objects.length; i++) {
            
                // create a row UI element based on the object
                var obj = objects[i];
                var row = createBeerListItem(obj, i);
                
                // add the row to the list
                $("#my_listview").append(row);
            }

            if(objects.length == 0){
                $("#my_listview").append($("<li><p style='margin: 18px;'>まだビールが登録されていません．'Add'ボタンから登録して下さい．</p></li>"));
            }
            
            // refresh the list to show the added results
            $("#my_listview").listview('refresh');
        }

        if(_myBeerObjects != null){
            if($("#my_listview").children().length == 0){
                setMyListDOM();
            }
            
            // hide the loader
            $.mobile.hidePageLoadingMsg();
            inProgress = false;
        }else{
            var user = KiiUser.getCurrentUser();
            var myBeerList = user.get("beerList");

            if(myBeerList != null){
                var userId = user.getUUID();

                var clause = KiiClause.equals(userId, "true");
                // var clauseList = [];
                // var str = "KiiClause.or(";
                // for(var i = 0; i < myBeerList.length; i++){
                //     var clause = KiiClause.equals("beerId", myBeerList[i]);
                //     clauseList.push(clause);
                //     str = str + "clauseList[" + i + "], ";
                // }
                // str = str.substring(0, str.length - 2) + ");";

                // var totalClause = eval(str);

                    // Create Application Scope Bucket
                var bucket = Kii.bucketWithName(BUCKET_BEER_NAME);

                // create an empty KiiQuery (will return all objects in the bucket)
                var queryObject = KiiQuery.queryWithClause(clause);
                // var queryObject = KiiQuery.queryWithClause(totalClause);

                // sort the results by creation date
                queryObject.sortByDesc("_created");

                // perform the asynchronous query, with callbacks defined
                bucket.executeQuery(queryObject, {

                    // callback for a successful query
                    success: function(queryPerformed, resultSet) {
                        _myBeerObjects = resultSet;
                        setMyListDOM();
                        
                        // hide the loader
                        $.mobile.hidePageLoadingMsg();
                        inProgress = false;
                    },
                        
                    // callback for a failed query
                    failure: function(queryPerformed, anErrorString) {

                        // hide the loading animation
                        $.mobile.hidePageLoadingMsg();
                        inProgress = false;
                        
                        $("#my_listview").append($("<li><p style='margin: 18px;'>Error!: " + anErrorString + "</p></li>"));

                        // tell the user
                        alert("Unable to execute query: " + anErrorString);
                        
                        // tell the console
                        Kii.logger("Unable to execute query: " + anErrorString);
                    }
                });
            }else{
                // tell the console
                Kii.logger("User Beer is Empty");

                $("#my_listview").append($("<li><p style='margin: 18px;'>まだビールが登録されていません．'Add'ボタンから登録して下さい．</p></li>"));
                // hide the loader
                $.mobile.hidePageLoadingMsg();
                inProgress = false;
            }
        }
    }
}




function onPullDown(){
    switch(selectedMainPage){
        case "all":
            _beerObjects = null;
            moveToAllPage();
            break;
        case "user":
            _myBeerObjects = null;
            moveToUserPage();
            break;
    }
}

function onPullUp(){

}





/**
*
*   Object of Beer
*
*/
function initBeerObject(){
    var obj = {
        "name": "",
        "bruery": "",
        "category": "",
        "alcohol": "",
        "color": {
            "h": 40,
            "s": 100,
            "l": 50
        },
        "uri": "",
        "ave_koku": 0,
        "ave_kire": 0,
        "ave_bitter": 0,
        "ave_body": 0,
        "ave_like": 0,
        "user": [],
    }
    return obj;
}


/**
*
*   Object of Beer by User
*
*/
function initBeerByUserObject(){
    var obj = {
        "koku": 0,
        "kire": 0,
        "bitter": 0,
        "body": 0,
        "smell": 0,
        "like": 0,
        "smell-like": "",
        "dish": "",
        "comment": "",
        "username": "",
        "date": ""
    }

    return obj;
}





function hslToRGB(hue, saturation, lightness){
    var h = Number(hue),
        s = Number(saturation) / 100,
        l = Number(lightness) / 100,
        max = l <= 0.5 ? l * (1 + s) : l * (1 - s) + s,
        min = 2 * l - max,
        rgb = {};

    if (s == 0) {
        rgb.r = rgb.g = rgb.b = l;
    } else {
        var list = {};
        
        list['r'] = h >= 240 ? h - 240 : h + 120;
        list['g'] = h;
        list['b'] = h < 120 ? h + 240 : h - 120; 

        for (var key in list) {
            var val = list[key],
                res;

            switch (true) {
                case val < 60:
                    res = min + (max - min) * val / 60;
                    break;

                case val < 180:
                    res = max;
                    break;

                case val < 240:
                    res = min + (max - min) * (240 - val) / 60;
                    break;

                case val < 360:
                    res = min;
                    break;
            }

            rgb[key] = res;
        }
    }

    // CSS用に変換して返す
    return 'rgb(' + Math.round(rgb.r * 255) + ',' + Math.round(rgb.g * 255) + ',' + Math.round(rgb.b * 255) + ')';
};



