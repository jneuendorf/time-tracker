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
    return $(context.find(selector));
};

global.formatDate = function(date) {
    return moment(date).format("DD.MM.YY");
};

global.parseDate = function(dateString) {
    return moment(dateString, global.dateFormat);
}


// GLOBAL VARIABLES

global.dateFormat = "DD.MM.YY";

global.TemplateHooks = {};

global.temporaryCallbacks = {
    AddEntriesModalShown: function(modal) {}
};
