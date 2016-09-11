// GLOBAL FUNCTIONS

global.goHome = function(params) {
    if (!params) {
        location.href = "/";
    }
    else {
        let parts = [];
        for (let key in params) {
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
};

global.parseTime = function(timeString) {
    let date = moment(timeString, global.timeFormat);
    date.set("year", 1970);
    date.set("month", 0);
    date.set("date", 1);
    return moment.duration(date.diff(moment("1970-01-01")));
};

global.filterBy = (entries, kind, refDate) => {
    let refValue = moment(refDate)[kind]();
    // console.log(kind + "ly", refValue);
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

global.activeTooltips = function(template) {
    setTimeout(() => {
        console.log("activating tooltips");
        template.$("[data-toggle='tooltip']")
            .not(".has-tooltip")
            .tooltip()
            .addClass("has-tooltip");
    }, 200);
};


// GLOBAL VARIABLES

global.dateFormat = "DD.MM.YY";
global.timeFormat = "HH:mm:ss";

global.TemplateHooks = {
    // initDatetimepickerAndSubmit in AddEntryModal
};

global.temporaryCallbacks = {
    // set in Template.Project.events "click #clock-save"
    AddEntryModalShown: function(modal) {}
};
