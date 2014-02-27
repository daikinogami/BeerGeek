var _selectedSearch = 0;
var _searchObject = null;

function onChangeSearchType(event, ui){
    var selected = $('[name=selectSearch]:checked').val();
    if(selected != _selectedSearch){
        $.mobile.showPageLoadingMsg();
        _selectedSearch = selected;
        $("#searchValue").val("");
        $("#searchValue").removeAttr("disabled");

        switch(_selectedSearch){
            case "0":
                initializeSearchBeerAsync().then(function(){
                    $.mobile.hidePageLoadingMsg();
                }, function(){
                    $.mobile.hidePageLoadingMsg(); 
                });
                break;
            case "1":
                initializeSearchBrueryAsync().then(function(){
                    $.mobile.hidePageLoadingMsg();
                }, function(){
                    $.mobile.hidePageLoadingMsg(); 
                });
                break;
            case "2":
                initializeSearchCategoryAsync().then(function(){
                    $.mobile.hidePageLoadingMsg(); 
                }, function(){
                    $.mobile.hidePageLoadingMsg(); 
                });
                break;
        }
    }
}

function initializeSearch(){

    $("#listPage input[type='radio']").unbind("change", onChangeSearchType);
	$("#listPage input[type='radio']").bind("change", onChangeSearchType);

	_selectedSearch = 0;
	initializeSearchBeerAsync().then(function(){
		$.mobile.hidePageLoadingMsg();
	}, function(){
		$.mobile.hidePageLoadingMsg(); 
	});
}

function initializeSearchBeerAsync(){
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
            $("#selectSearchValue").empty();
            $("#selectSearchValue").append($("<option value='-1'>フリーワード</option>"));
            for(var i = 0; i < _selectBeerObjects.length; i++){
                var name = _selectBeerObjects[i].get("name");
                var opt = $("<option>" + name + "</option>");
                opt.attr("value", i);
                $("#selectSearchValue").append(opt);
            }
            $("#selectSearchValue").selectmenu("refresh");

            $("#selectSearchValue").unbind();
            $("#selectSearchValue").bind("change", function(){
            	$(this).selectmenu("refresh");
                var index = Number($(this).val());
                if(index > -1){
                    $("#searchValue").val(_selectBeerObjects[index].get("name"));
                    $("#searchValue").attr("disabled", "disabled");
                }else{
                    $("#searchValue").val("");
                    $("#searchValue").removeAttr("disabled");
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




function initializeSearchBrueryAsync(){
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
            $("#selectSearchValue").empty();
            $("#selectSearchValue").append($("<option value='-1'>フリーワード</option>"));
            for(var i = 0; i < resultSet.length; i++){
                var name = resultSet[i].get("name");
                var opt = $("<option>" + name + "</option>");
                opt.attr("value", i);
                $("#selectSearchValue").append(opt);
            }
            $("#selectSearchValue").selectmenu("refresh");

            $("#selectSearchValue").unbind();
            $("#selectSearchValue").bind("change", function(){
            	$(this).selectmenu("refresh");
                var index = Number($(this).val());
                if(index > -1){
                    $("#searchValue").val(resultSet[index].get("name"));
                    $("#searchValue").attr("disabled", "disabled");
                }else{
                    $("#searchValue").val("");
                    $("#searchValue").removeAttr("disabled");
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



function initializeSearchCategoryAsync(){
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
            $("#selectSearchValue").empty();
            $("#selectSearchValue").append($("<option value='-1'>フリーワード</option>"));
            for(var i = 0; i < resultSet.length; i++){
                var name = resultSet[i].get("name");
                var opt = $("<option>" + name + "</option>");
                opt.attr("value", i);
                $("#selectSearchValue").append(opt);
            }
            $("#selectSearchValue").selectmenu("refresh");

            $("#selectSearchValue").unbind();
            $("#selectSearchValue").bind("change", function(){
            	$(this).selectmenu("refresh");
                var index = Number($(this).val());
                if(index > -1){
                    $("#searchValue").val(resultSet[index].get("name"));
                    $("#searchValue").attr("disabled", "disabled");
                }else{
                    $("#searchValue").val("");
                    $("#searchValue").removeAttr("disabled");
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




function searchBeer(){
	var word = $("#searchValue").val();
	var type = $('[name=selectSearch]:checked').val();

	if(word != ""){
		switch(type){
			case "0":
				type = "name";
				break;
			case "1":
				type = "bruery";
				break;
			case "2":
				type = "category";
				break;
		}

		if(!inProgress){
	        // show a loading animation
	        $.mobile.showPageLoadingMsg();
	        inProgress = true;

	        var setSearchDOM = function(){
	            // clear the existing objects from the list
	            $("#search_listview").empty();

	            // iterate through the result set
	            for(var i=0; i<_searchObject.length; i++) {
	            
	                // create a row UI element based on the object
	                var obj = _searchObject[i];
	                var row = createBeerListItem(obj, i);
	                
	                // add the row to the list
	                $("#search_listview").append(row);
	            }
	            
	            // refresh the list to show the added results
	            $("#search_listview").listview('refresh');
	        }


            var clause = KiiClause.equals(type, word);

            // Create Application Scope Bucket
            var bucket = Kii.bucketWithName(BUCKET_BEER_NAME);

            // create an empty KiiQuery (will return all objects in the bucket)
            // var queryObject = KiiQuery.queryWithClause(totalClause);
            var queryObject = KiiQuery.queryWithClause(clause);

            // sort the results by creation date
            queryObject.sortByDesc("_created");

            // perform the asynchronous query, with callbacks defined
            bucket.executeQuery(queryObject, {

                // callback for a successful query
                success: function(queryPerformed, resultSet) {
                    _searchObject = resultSet;
                    setSearchDOM();
                    
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

