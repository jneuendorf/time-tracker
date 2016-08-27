// GLOBAL FUNCTIONS

global.goHome = function(params) {
    if (!params) {
        location.href = "/";
    }
    else {
        let parts = [];
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                parts.push(key + "=" + params[key]);
            }
        }
        location.href = "/?" + parts.join("&");
    }
};

// wraps Blaze.find and jQuery.find (to always return a jQuery object)
global.$find = function(selector, context) {
    if (!context) {
        context = this;
    }
    // if (!(context.find instanceof Function)) {
    //     context = $(context)
    // }
    return $(context.find(selector));
};

// GLOBAL VARIABLES

global.TemplateHooks = {};
