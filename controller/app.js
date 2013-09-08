var config = require('../config.json');
var configApis = require('../config/apis.json');
appInfo = function() {
    var appInfo = {
        headerTitle : "WSO2 Mobile Device Management",
        title : "WSO2 Mobile Device Management",
        copyright : "Copyright (c) 2013 - WSO2 Mobile .Inc",
        server_url: config.MDM_UI_URI
    };
    return appInfo;
}

if(session.get("mdmConsoleUserLogin") != "true" && request.getRequestURI() != appInfo().server_url + "console/login"){
    response.sendRedirect(appInfo().server_url + "console/login");
}

getServiceURLs = function(item){

    var serverURL = config.HTTP_URL + config.MDM_API_URI;

    var urls = configApis.APIS;

    arguments[0] = urls[item];

    var returnURL;
    var log = new Log();

    if(session.get("mdmConsoleUser") != null) {
        var log = new Log();
        returnURL = serverURL + String.format.apply(this, arguments) + "?tenantId=" + session.get("mdmConsoleUser").tenantId;
        log.info("Calling URL From server: " + returnURL);
    } else {
        returnURL = serverURL + String.format.apply(this, arguments);
        log.info("Calling URL From server: " + returnURL);
    }

    return returnURL;

}

String.format = function() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
}




navigation = function(role) {

    switch(role) {
        case "admin":
            var topNavigation = [{
                name : "Home"
            }]
            break;
        case "manager":

            break;
        default:

    };

    var currentUser = session.get("mdmConsoleUser");

    var topNavigation = [];
    var configNavigation = [];

    if(currentUser){

        if(role == 'masteradmin'){
            topNavigation = [
                {name : "Dashboard"	, link: appInfo().server_url + "console/dashboard", displayPage: "dashboard", icon: "icon-th-large"},
                {name : "Configurations", link: appInfo().server_url + "users/configuration", displayPage: "configuration", icon:"icon-wrench"},
                {name : "Management"	, link: appInfo().server_url + "roles/management", displayPage: "management", icon:"icon-briefcase"},
            ];

            var configNavigation =	[
                //{name : "MDM Settings", link: "/mdm/console/configuration",  displayPage: "mdmsettings", icon: "icon-edit"},
                {name : "Users", link: appInfo().server_url + "users/configuration", displayPage: "users", icon:"icon-user"},
                {name : "Roles", link: appInfo().server_url + "roles/configuration", displayPage: "roles", icon:"icon-globe"},
                //{name : "Permissions", link: appInfo().server_url + "permissions/configuration", displayPage: "permissions", icon:"icon-globe"},
                {name : "Policies", link: appInfo().server_url + "policies/configuration", displayPage: "policies", icon:"icon-edit"},
            ];



        }else if(role == 'admin'){
            topNavigation = [
                {name : "Dashboard"	, link: appInfo().server_url + "console/dashboard", displayPage: "dashboard", icon: "icon-th-large"},
                {name : "Configurations", link: appInfo().server_url + "users/configuration", displayPage: "configuration", icon:"icon-wrench"},
                {name : "Management"	, link: appInfo().server_url + "roles/management", displayPage: "management", icon:"icon-briefcase"},
            ];


            var configNavigation =	[
                //{name : "MDM Settings", link: "/mdm/console/configuration",  displayPage: "mdmsettings", icon: "icon-edit"},
                {name : "Users", link: appInfo().server_url + "users/configuration", displayPage: "users", icon:"icon-user"},
                {name : "Roles", link: appInfo().server_url + "roles/configuration", displayPage: "roles", icon:"icon-globe"},
                //{name : "Permissions", link: appInfo().server_url + "permissions/configuration", displayPage: "permissions", icon:"icon-globe"},
                {name : "Policies", link: appInfo().server_url + "policies/configuration", displayPage: "policies", icon:"icon-edit"},
            ];



        }else{
            topNavigation = [
                {name : "My Devices"	, link: appInfo().server_url + "users/devices", displayPage: "management", icon:"icon-briefcase"}
            ];
        }

    }








    return {
        topNavigation : topNavigation,
        configNavigation: configNavigation
    };

}



theme = function() {

    var theme = {
        name : config.MDM_THEME,
        default_layout : "1-column"
    }

    return theme;

}



context = function() {

    var contextData = {};


    var currentUser = session.get("mdmConsoleUser");

    if(currentUser){
        if(currentUser.isMasterAdmin){
            contextData.user = {
                name : "Master Admin",
                role : "masteradmin"
            };

        }else if(currentUser.isAdmin){
            contextData.user = {
                name : "Admin",
                role : "admin"
            };

        }else{
            contextData.user = {
                name : "User",
                role : "user"
            };
        }
    }else{
        contextData.user = {
            name : "Guest",
            role : "guest"
        };
    }




    var appDefault = {
        layout : this.theme().default_layout,
        title : this.appInfo().title,
        appInfo : this.appInfo(),
        theme : this.theme(),
        userLogin : session.get("mdmConsoleUserLogin"),
        currentUser : session.get("mdmConsoleUser"),
        resourcePath: "../themes/" + this.theme().name + "/img/",
        contextData : contextData,
        navigation : this.navigation(contextData.user.role),
        deviceImageService: config.DEVICES_IMAGE_SERVICE
    }

    return appDefault;
}




