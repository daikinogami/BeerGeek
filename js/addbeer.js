var _modifyBeer = false;

function initializeSlideBar(){
    beerColor = {"h": 40, "s": 100, "l": 50};
    var rgb = hslToRGB(beerColor.h, beerColor.s, beerColor.l);
    $("#outputColorBox").css("background-color", rgb);

    $('#sliderH').bind("change", function(e) {
        beerColor.h = e.target.value;
        var rgb = hslToRGB(beerColor.h, beerColor.s, beerColor.l);
        $("#outputColorBox").css("background-color", rgb);
    });

    $('#sliderL').bind("change", function(e) {
        beerColor.l = e.target.value;
        var rgb = hslToRGB(beerColor.h, beerColor.s, beerColor.l);
        $("#outputColorBox").css("background-color", rgb);
    });
}

function initializeSelectDOM(){

    initializeSelectBeerAsync().done(function(){
        initializeSelectBrueryAsync().done(function(){
            initializeSelectCategoryAsync().done(function(){
                console.log("initializeSelectDOM done.");
            });
        });
    });
}


function initializeSelectBeerAsync(){
    var d = $.Deferred();

    //reload Beer List
    var beerBucket = Kii.bucketWithName(BUCKET_BEER_NAME);
    var beerQuery = KiiQuery.queryWithClause(null);
    beerQuery.sortByAsc("name");
    beerBucket.executeQuery(beerQuery, {

        // callback for a successful query
        success: function(queryPerformed, resultSet) {
            //update select DOM
            _selectBeerObjects = resultSet;
            for(var i = 0; i < _selectBeerObjects.length; i++){
                var name = _selectBeerObjects[i].get("name");
                var opt = $("<option>" + name + "</option>");
                opt.attr("value", i);
                $("#selectBeerName").append(opt);
            }
            $("#selectBeerName").bind("change", function(){
                var index = Number($(this).val());
                if(index > -1){
                    $("#inputName").val(_selectBeerObjects[index].get("name"));
                    $("#inputBruery").val(_selectBeerObjects[index].get("bruery"));
                    $("#inputCategory").val(_selectBeerObjects[index].get("category"));
                    $("#inputAlcohol").val(_selectBeerObjects[index].get("alcohol"));
                    var hsl = _selectBeerObjects[index].get("color");
                    var rgb = hslToRGB(hsl.h, hsl.s, hsl.l);
                    $("#outputColorBox").css("background-color", rgb);
                    $("#sliderH").val(hsl.h);
                    $("#sliderL").val(hsl.l);
                    $("#sliderH").slider("refresh");
                    $("#sliderL").slider("refresh");
                    $("#inputName").attr("disabled", "disabled");
                    _modifyBeer = true;
                }else{
                    $("#inputName").val("");
                    $("#inputName").removeAttr("disabled");
                    _modifyBeer = false;
                }
            });
            _modifyBeer = false;
            d.resolve();
        },
            
        // callback for a failed query
        failure: function(queryPerformed, anErrorString) {
            // tell the console
            Kii.logger("Unable to execute query: " + anErrorString);
            d.resolve();
        }
    });

    return d.promise();
}

function initializeSelectBrueryAsync(){
    var d = $.Deferred();

    //reload Bruery List
    var brueryBucket = Kii.bucketWithName(BUCKET_BRUERY);
    var brueryQuery = KiiQuery.queryWithClause(null);
    brueryQuery.sortByAsc("name");
    brueryBucket.executeQuery(brueryQuery, {

        // callback for a successful query
        success: function(queryPerformed, resultSet) {
            //update select DOM
            _brueryObjects = resultSet;
            for(var i = 0; i < resultSet.length; i++){
                var name = resultSet[i].get("name");
                var opt = $("<option>" + name + "</option>");
                opt.attr("value", i);
                $("#selectBrueryName").append(opt);
            }
            $("#selectBrueryName").bind("change", function(){
                var index = Number($(this).val());
                if(index > -1){
                    $("#inputBruery").val(resultSet[index].get("name"));
                    $("#inputBruery").attr("disabled", "disabled");
                }else{
                    $("#inputBruery").val("");
                    $("#inputBruery").removeAttr("disabled");
                }
            });
            d.resolve();
        },
            
        // callback for a failed query
        failure: function(queryPerformed, anErrorString) {
            // tell the console
            Kii.logger("Unable to execute query: " + anErrorString);
            d.resolve();
        }
    });

    return d.promise();
}

function initializeSelectCategoryAsync(){
    var d = $.Deferred();

    //reload Category List
    var categoryBucket = Kii.bucketWithName(BUCKET_CATEGORY);
    var categoryQuery = KiiQuery.queryWithClause(null);
    categoryQuery.sortByAsc("name");
    categoryBucket.executeQuery(categoryQuery, {

        // callback for a successful query
        success: function(queryPerformed, resultSet) {
            //update select DOM
            _categoryObjects = resultSet;
            for(var i = 0; i < resultSet.length; i++){
                var name = resultSet[i].get("name");
                var opt = $("<option>" + name + "</option>");
                opt.attr("value", i);
                $("#selectCategoryName").append(opt);
            }
            $("#selectCategoryName").bind("change", function(){
                var index = Number($(this).val());
                if(index > -1){
                    $("#inputCategory").val(resultSet[index].get("name"));
                    $("#inputCategory").attr("disabled", "disabled");
                }else{
                    $("#inputCategory").val("");
                    $("#inputCategory").removeAttr("disabled");
                }
            });
            d.resolve();
        },
            
        // callback for a failed query
        failure: function(queryPerformed, anErrorString) {
            // tell the console
            Kii.logger("Unable to execute query: " + anErrorString);
            d.resolve();
        }
    });

    return d.promise();
}




function addNewBeer(){

    if(!inProgress){
        // show a loading animation
        $.mobile.showPageLoadingMsg();
        inProgress = true;

        var name = $("#inputName").val();
        var bruery = $("#inputBruery").val();
        var category = $("#inputCategory").val();
        var alcohol = $("#inputAlcohol").val();
        alcohol = alcohol.replace("%", "");
        var beerColor = {"h": 40, "s": 100, "l": 50};
        beerColor.h = Number($("#sliderH").val());
        beerColor.l = Number($("#sliderL").val());

        //input check
        if(name.length > 0 && bruery.length > 0 && category.length > 0 && alcohol.length > 0){
            $("#addBeerError").text("");
            
            if(_modifyBeer){
                //get exist beer info
                var index = $("#selectBeerName").val();
                var object = _selectBeerObjects[index];
            }else{
                // get the defined bucket belonging to this user
                var bucket = Kii.bucketWithName(BUCKET_BEER_NAME);
                // create the object
                var object = bucket.createObject();
            }
            var user = KiiUser.getCurrentUser();
            var userId = user.getUUID();
            var beerId = object.getUUID();
            var opinionBucket = beerId + "_opinion";

            // set a key/value pair
            object.set("name", name);
            object.set("bruery", bruery);
            object.set("category", category);
            object.set("alcohol", alcohol);
            object.set("color", {"h": beerColor.h, "s": beerColor.s, "l": beerColor.l});
            object.set("beerId", beerId);
            object.set("opinion", opinionBucket);
            object.set(userId, "true");
            
            // perform an asynchronous creation, with callbacks
            object.save({

                // callback for a successful deletion
                success: function(theSavedObject) {
                    //add beer to user
                    var beerId = theSavedObject.getUUID();
                    
                    addBrueryAsync(bruery).done(function(){
                        addCategoryAsync(category).done(function(){
                            addBeerToUserBeerAsync(beerId).then(function(){
                                moveToMainPage();
                            
                                // hide the loader
                                $.mobile.hidePageLoadingMsg();  
                                inProgress = false;
                            }, function(err){
                                console.log("Error: " + err);
                                // hide the loader
                                $.mobile.hidePageLoadingMsg();  
                                inProgress = false;
                            });
                        });
                    });
                },
                
                // callback for a failed creation
                failure: function(theObject, anErrorString) {

                    // hide the loading animation
                    $.mobile.hidePageLoadingMsg();
                    inProgress = false;
                    
                    // tell the user
                    alert("Unable to create beer object: " + anErrorString);
                    
                    // tell the console
                    Kii.logger("Unable to create beer object: " + anErrorString);
                }
            });

            //reset beer list and my beer list
            _beerObjects = null;
            _myBeerObjects = null;

        }else{
            $("#addBeerError").text("全ての項目を入力してください．");
            // hide the loader
            $.mobile.hidePageLoadingMsg();  
            inProgress = false;
        }
    }
}

/**
 * 
 * Async function
 * すでに存在する場合は追加されない
 *
 */
function addBrueryAsync(name){
    var d = $.Deferred();

    var objects = _brueryObjects;
    for(var i = 0; i < objects.length; i++){
        if(objects[i].get("name") == name){
            setTimeout(function(){
                d.resolve();
            }, 10);
            return d.promise();
        }
    }

    // get the defined bucket belonging to this user
    var bucket = Kii.bucketWithName(BUCKET_BRUERY);
    
    // create the object
    var object = bucket.createObject();

    // set a key/value pair
    object.set("name", name);
    
    // perform an asynchronous creation, with callbacks
    object.save({

        // callback for a successful deletion
        success: function(theSavedObject) {
            d.resolve();
        },
        
        // callback for a failed creation
        failure: function(theObject, anErrorString) {
            d.resolve();
        }
    });

    return d.promise();
}

/**
 * 
 * Async function
 * すでに存在する場合は追加されない
 *
 */
function addCategoryAsync(name){
    var d = $.Deferred();

    var objects = _categoryObjects;
    for(var i = 0; i < objects.length; i++){
        if(objects[i].get("name") == name){
            setTimeout(function(){
                d.resolve();
            }, 10);
            return d.promise();
        }
    }

    // get the defined bucket belonging to this user
    var bucket = Kii.bucketWithName(BUCKET_CATEGORY);
    
    // create the object
    var object = bucket.createObject();

    // set a key/value pair
    object.set("name", name);
    
    // perform an asynchronous creation, with callbacks
    object.save({

        // callback for a successful deletion
        success: function(theSavedObject) {
            d.resolve();
        },
        
        // callback for a failed creation
        failure: function(theObject, anErrorString) {
            d.resolve();
        }
    });

    return d.promise();
}



/**
 * Async function
 * addBeerToUserBeerAsync
 *
 */

function addBeerToUserBeerAsync(beerId){
    var d = $.Deferred();

    //add beer to user
    var user = KiiUser.getCurrentUser();
    var beerList = user.get("beerList");
    if(beerList != null){
        //check if it will duplicate
        for(var i = 0; i < beerList.length; i++){
            if(beerList[i] == beerId){
                setTimeout(function(){
                    d.resolve();
                }, 10);
                return d.promise();
            }
        }
        beerList.push(beerId);
    }else{
        beerList = [beerId];
    }
    user.set("beerList", beerList);
    user.save({
        success: function(theUser) {
            console.log("User's beerList is added.");
            d.resolve();
        },
        failure: function(theUser, errorString) {
            console.log("Error: " + errorString);
            d.reject(errorString);
        }
    });

    return d.promise();
}


/**
 * Async function
 * addOpinionAsync
 *
 */
function addOpinionAsync(opinionBucket){
    var d = $.Deferred();

    //add opinion bucket
    var bucket = Kii.bucketWithName(opinionBucket);
    var object = bucket.createObject();

    var koku = 0;
    var kire = 0;
    var bitter = 0;
    var body = 0;
    var like = 0;
    var smell = "";
    var dish = "";
    var comment = "";
    var username = KiiUser.getCurrentUser().getDisplayName();
    var date = new Date();
    var userId = KiiUser.getUUID();

    object.set("koku", koku);
    object.set("kire", kire);
    object.set("bitter", bitter);
    object.set("body", body);
    object.set("like", like);
    object.set("smell", smell);
    object.set("dish", dish);
    object.set("comment", comment);
    object.set("username", username);
    object.set("date", date);
    object.set("userId", userId);

    // perform an asynchronous creation, with callbacks
    object.save({

        // callback for a successful deletion
        success: function(theSavedObject) {
            d.resolve(theSavedObject);
        },
        
        // callback for a failed creation
        failure: function(theObject, anErrorString) {
            // tell the user
            alert("Unable to create object: " + anErrorString);
            // tell the console
            Kii.logger("Unable to create opinion object: " + anErrorString);
            d.reject(anErrorString);
        }
    });

    return d.promise();
}




/**
 *
 * メンテナンス用(BUCKET_BEER_NAME)
 *
 */
function deleteBeerBucket(){

    // Create Application Scope Bucket
    var bucket = Kii.bucketWithName(BUCKET_BEER_NAME);

    // create an empty KiiQuery (will return all objects in the bucket)
    var queryObject = KiiQuery.queryWithClause(null);

    // sort the results by creation date
    queryObject.sortByAsc("_created");

        // perform the asynchronous query, with callbacks defined
    bucket.executeQuery(queryObject, {

        // callback for a successful query
        success: function(queryPerformed, resultSet) {
            //remove opinion bucket for each beer
            var dl = [];
            for(var i = 0; i < resultSet.length; i++){
                var bucketName = resultSet[i].get("opinion");
                var d = deleteBucketAsync(bucketName);
                dl.push(d);
            }
            $.when.apply($, dl).then(function() {
                //remove beer bucket
                var bucket = Kii.bucketWithName(BUCKET_BEER_NAME); // a KiiBucket
                bucket['delete']({
                    success: function(deletedBucket) {
                        console.log("Removing beer name bucket is successful.");
                    },
                  
                    failure: function(bucketToDelete, anErrorString) {
                        console.log("Removing beer name bucket is failed: " + anErrorString);
                    }
                });
            }, function(){
                // tell the console
                Kii.logger("Error occurs while removeing opinion buckets");
            })
        },
            
        // callback for a failed query
        failure: function(queryPerformed, anErrorString) {
            // tell the user
            alert("Unable to execute query: " + anErrorString);
            
            // tell the console
            Kii.logger("Unable to execute query: " + anErrorString);
        }
    });
}

/**
 *
 * メンテナンス用(BUCKET_BRUERY, BUCKET_CATEGORY, Opinion)
 *
 */
function deleteBucketAsync(bucketName){
    var d = $.Deferred();
    var bucket = Kii.bucketWithName(bucketName); // a KiiBucket
    bucket['delete']({
        success: function(deletedBucket) {
            // do something with the result
            console.log("Removing " + bucketName + " bucket is successful.");
            d.resolve();
        },
      
        failure: function(bucketToDelete, anErrorString) {
            // do something with the error response
            console.log("Removing " + bucketName + " bucket is failed: " + anErrorString);
            d.reject(anErrorString);
        }
    });

    return d.promise();
}


function deleteUserBeer(){
    var user = KiiUser.getCurrentUser();
    user.set("beerList", null);

    user.save({
        success: function (theUser) {
            console.log("User's beerList is cleared!");
        },
        failure: function (theUser, errorString) {
            console.log("Error: " + errorString);
        }
    });
}

