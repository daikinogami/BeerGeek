
function initializeUserPage() {
    var user = KiiUser.getCurrentUser();
    user.refresh({
        success: function (user) {
            var username = user.getDisplayName();
            if (username !== undefined) $("#inputUserName").val(username);

            var beerList = user.get("beerList");
            if(beerList != null){
                var count = beerList.length > 0 ? beerList.length : 0;
                $("#userBeerCountOutput").text(beerList.length);
            }else{
                $("#userBeerCountOutput").text(0);
            }

            var userId = user.getUUID();
            if (userId !== undefined) $("#userIdOutput").text(userId);
        },
        failure: function (user, anErrorString) {
            // tell the user
            alert("Unable to refresh user: " + anErrorString);

            // tell the console
            Kii.logger("Unable to refresh user: " + anErrorString);
        }
    });
}


function updateUserInfo() {
    var user = KiiUser.getCurrentUser();
    var userName = $("#inputUserName").val();
    var match = userName.match(/[\w|\s]+$/i);


    if (match != null && match[0].length == userName.length && userName.length >= 4 && userName.length <= 50) {
        user.setDisplayName(userName);
        $("#userNameError").text("");
        user.save({
            success: function (theUser) {
                console.log("User's display name and country changed!");
            },
            failure: function (theUser, errorString) {
                console.log("Error: " + errorString);
            }
        });
    } else {
        $("#userNameError").text("ユーザー名は英数字4-50文字です。");
    }

}

function logOutFromApp() {
    if (!inProgress) {
        // show a loading animation
        $.mobile.showPageLoadingMsg();
        inProgress = true;

        // KiiSocialConnect.unLinkCurrentUserFromNetwork(KiiSocialNetworkName.FACEBOOK, {

        //     success: function (user, network) {
        //         removeCookieAsToken();
        //         FB.logout();

        //         moveToLogInPage();

        //         $.mobile.hidePageLoadingMsg();
        //         inProgress = false;
        //     },

        //     failure: function (user, network, anErrorString) {
        //         $.mobile.hidePageLoadingMsg();
        //         inProgress = false;

        //         // tell the user
        //         alert("Unable to logout: " + anErrorString);

        //         // tell the console
        //         Kii.logger("Unable to logout: " + anErrorString);
        //     }
        // });

        removeCookieAsToken();
        FB.logout();

        moveToLogInPage();

        $.mobile.hidePageLoadingMsg();
        inProgress = false;
    }
}