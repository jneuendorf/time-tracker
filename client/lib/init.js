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

global.filterBy = (entries, kind, refDate) => {
    let refValue = moment(refDate)[kind]();
    console.log(kind + "ly", refValue);
    return entries.filter((entry) => {
        return global.parseDate(entry.date)[kind]() === refValue;
    });
};

global.filterEntriesByViewMode = (entries, viewMode, refDate=moment()) => {
    switch (viewMode) {
        case "all":
            break;
        case "today":
            let todayStr = global.formatDate(refDate);
            entries = entries.filter((entry) => {
                return entry.date === todayStr;
            });
            break;
        case "weekly":
            entries = global.filterBy(entries, "week", refDate);
            break;
        case "monthly":
            entries = global.filterBy(entries, "month", refDate);
            break;
        case "annually":
            entries = global.filterBy(entries, "year", refDate);
            break;

    }
    return entries.sort((a, b) => {
        a = global.parseDate(a.date);
        b = global.parseDate(b.date);
        if (a.isBefore(b)) {
            return -1;
        }
        if (a.isAfter(b)) {
            return 1;
        }
        return 0;
    });
};


// GLOBAL VARIABLES

global.dateFormat = "DD.MM.YY";
global.timeFormat = "HH:mm:ss";

global.TemplateHooks = {
    // initDatetimepicker in AddEntryModal
};

global.temporaryCallbacks = {
    AddEntryModalShown: function(modal) {}
};
