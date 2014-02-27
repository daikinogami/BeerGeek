


function initializeBeerNameDialog(){
	if(results.length > 0){
		// clear the existing objects from the list
        $("#dialogNameList").empty();

        // iterate through the result set
        for(var i=0; i<results.length; i++) {
        
            // create a row UI element based on the object
            var obj = results[i];
            var row = createDialogListItem(obj, i, "name");
            
            // add the row to the list
            $("#dialogNameList").append(row);
        }
        
        // refresh the list to show the added results
        $("#dialogNameList").listview('refresh');

	}else{
		if(!inProgress){
	        // show a loading animation
	        $.mobile.showPageLoadingMsg();
	        inProgress = true;

	        // Create Application Scope Bucket
	        var bucket = Kii.bucketWithName(BUCKET_BEER_NAME);

	        // create an empty KiiQuery (will return all objects in the bucket)
	        var queryObject = KiiQuery.queryWithClause(null);

	        // sort the results by creation date
	        queryObject.sortByAsc("name");

	        // perform the asynchronous query, with callbacks defined
	        bucket.executeQuery(queryObject, {

	            // callback for a successful query
	            success: function(queryPerformed, resultSet) {
	                results = resultSet;
	            
	                // clear the existing objects from the list
	                $("#dialogNameList").empty();

	                // iterate through the result set
	                for(var i=0; i<resultSet.length; i++) {
	                
	                    // create a row UI element based on the object
	                    var obj = resultSet[i];
	                    var row = createDialogListItem(obj, i, "name");
	                    
	                    // add the row to the list
	                    $("#dialogNameList").append(row);
	                }
	                
	                // refresh the list to show the added results
	                $("#dialogNameList").listview('refresh');

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


function createDialogListItem(obj, index, field){
	var str = obj.get(field);

	if(str != null && str != ""){
	    // generate some DOM elements.
	    // set the KiiObject URI to an attribute so it can be tracked
	    var row = $("<li></li>").attr("uri", index);
	    //var block = $("<div class='flexbox'></div>");
	    var link = $("<a></a>").attr("href", "javascript:onSelectDialogList('" + str + "','" + field + "')");
	    $(link).append("<h3>" + str + "</h3>");

	    // build the element
    	$(row).append(link);
    	
    	// return the entire row
    	return row;
	}else{
		return $("<li></li>");
	}
}

function onSelectDialogList(str, field){
	switch(field){
		case "name":
			$("#inputName").val(str);
			break;
		case "bruery" :
			$("#inputBruery").val(str);
			break;
		case "category" :
			$("#inputCategory").val(str);
			break;
	}
}