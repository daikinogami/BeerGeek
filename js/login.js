/**
*
*   For initilaize Facebook Login
*
*/

window.fbAsyncInit = function() {
    // initialize the Kii SDK!
    Kii.initializeWithSite("54f62f51", "b1e1d513b97af1b3b2d24e6a452778a0", KiiSite.JP);

    // set options required by Facebook's API
    var options = {
      channelUrl : null,
      status : true,
      cookie : true,
      xfbml : true
    };

    // Initialize the SNS for later use
    KiiSocialConnect.setupNetwork(
      KiiSocialNetworkName.FACEBOOK,
      "607479869330916", null, options);
};


function loginByToken(token){
    // initialize the Kii SDK!
    Kii.initializeWithSite("54f62f51", "b1e1d513b97af1b3b2d24e6a452778a0", KiiSite.JP);

    // show a loading animation
    $.mobile.showPageLoadingMsg();

     // SNS Registration
    var loginCallbacks = {
        // successfully connected to facebook
        success : function(user, network) {
            console.log("Connected user " + user + " to network: " + network);

            //set cookie
            var token = user.getAccessToken();
            if(token != null){
                setCookieAsToken(token);
            }

            // tell the console
            Kii.logger("User authenticated: " + user);

            // hide the loading animation
            $.mobile.hidePageLoadingMsg();  

            user.refresh({
                success: function (user) {
                    // show the list of objects
                    moveToMainPage();
                },
                failure: function (user, anErrorString) {
                    // tell the user
                    alert("Unable to refresh user: " + anErrorString);

                    // tell the console
                    Kii.logger("Unable to refresh user: " + anErrorString);
                }
            });
        },
        // unable to connect
        failure : function(user, network, error) {
            console.log("Unable to connect to " + network + ". Reason: " + error);
            // hide the loading animation
            $.mobile.hidePageLoadingMsg();  
            
            // tell the user
            alert("Unable to register: " + error);
            
            // tell the console
            Kii.logger("Unable to register user: " + error);
        }
    };


    KiiUser.authenticateWithToken(token, loginCallbacks);
}


// the user clicked the 'sign in' button
function loginByFacebookAccount() {

    // show a loading animation
    $.mobile.showPageLoadingMsg();

     // SNS Registration
    var loginCallbacks = {
        // successfully connected to facebook
        success : function(user, network) {
            console.log("Connected user " + user + " to network: " + network);

            //set cookie
            var token = user.getAccessToken();
            if(token != null) setCookieAsToken(token);

            //FB flag set
            isFBLogin = true;

            // tell the console
            Kii.logger("User authenticated: " + user);

            // hide the loading animation
            $.mobile.hidePageLoadingMsg(); 

            user.refresh({
                success: function (user) {
                    // show the list of objects
                    moveToMainPage();
                },
                failure: function (user, anErrorString) {
                    // tell the user
                    alert("Unable to refresh user: " + anErrorString);

                    // tell the console
                    Kii.logger("Unable to refresh user: " + anErrorString);
                }
            });

        },
        // unable to connect
        failure : function(user, network, error) {
            console.log("Unable to connect to " + network + ". Reason: " + error);
            // hide the loading animation
            $.mobile.hidePageLoadingMsg();  
            
            // tell the user
            alert("Unable to register: " + error);
            
            // tell the console
            Kii.logger("Unable to register user: " + error);
        }
    };


    KiiSocialConnect.logIn(KiiSocialNetworkName.FACEBOOK, null, loginCallbacks);
}



function setCookieAsToken(token, expire){
    if(token != null){
        var expire_date = new Date();
        // expire date 10days
        expire_date.setTime(expire_date.getTime() + 10*24*60*60*1000);
        var cookie_name = "beergeek_token";
        var cookie_value = token;
        cookie_name = encodeURIComponent( cookie_name );
        cookie_value = encodeURIComponent( cookie_value );
        document.cookie = cookie_name + "=" + cookie_value + "; expires=" + expire_date.toGMTString();
    }
}

function removeCookieAsToken(){
    var expire_date = new Date();
    expire_date.setTime(expire_date.getTime() - 1000);

    var cookie_name = "beergeek_token";
    document.cookie = cookie_name + "=; expires=" + expire_date.toGMTString();
}


function getCookieAsToken(){
    var full_cookie_data = document.cookie;

    var array_cookies = full_cookie_data.split(";");
    var hash_cookies = new Array();
    for(var i=0; i<array_cookies.length; i++){
        array_cookies[i] = array_cookies[i].replace(/^ +| +$/,'');
        var tmp = array_cookies[i].split("=");
        hash_cookies[tmp[0]] = tmp[1];
    }

    var return_data = "";
    return_data = hash_cookies["beergeek_token"];
    return return_data != null ? return_data : ""; 
}



  // required to load the Facebook API connections
(function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script');
    js.id = id; js.async = true;
    js.src = "http://connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);

}(document));


/**
*
*   Start From this function
*
*/
$(document).ready(function() {

    // bind clicks to our login/sign up methods
    //$("#register-button").click(performRegistration);
    $("#login-button").click(loginByFacebookAccount);


    var token = getCookieAsToken();
    if(token != ""){
        loginByToken(token);
    }
});
