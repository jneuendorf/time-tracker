Template.EntriesTable.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
    this.projectCursor = Projects.find({
        _id: FlowRouter.getParam("id")
    });
    // convenience property for accessing the project data but always having the latest (reactive) data
    Object.defineProperty(this, "project", {
        get: function() {
            return this.projectCursor.fetch()[0];
        },
        set: function() {
            throw new Error("Can't set project");
        }
    });
    this.viewMode = new ReactiveVar("all");
    this.viewModeOffset = new ReactiveVar(0);
    this.earliestEntryDate = this.project.entries.reduce((prev, current) => {
        current = global.parseDate(current.date);
        if (current.isBefore(prev)) {
            return current;
        }
        return prev;
    }, moment());
    // entries are updated when calling entries helper
    this.filteredEntries = [];
});

const VIEW_MODES = ["all", "today", "weekly", "monthly", "annually"];
const UNITS_BY_VIEW_MODE = {
    today: "days",
    weekly: "weeks",
    monthly: "months",
    annually: "years"
};
const MOMENT_FORMATS_BY_VIEW_MODE = {
    today: global.dateFormat,
    weekly: "w",
    monthly: "MMMM",
    annually: "YYYY"
};

let csvStringifyArray = (array, delimiter) => {
    return array.map((item) => {
        if (typeof item === "string") {
            item = item.replace('"', '""');
            if (item.indexOf(delimiter) >= 0) {
                item = '"' + item + '"';
            }
        }
        return item;
    }).join(delimiter);
}

let csvStringifyObject = (object, delimiter, excludeKeys) => {
    let array = [];
    var keys = Object.keys(object).filter((key) => {
        return excludeKeys.indexOf(key) < 0;
    });
    for (let i = 0; i < keys.length; i++) {
        array.push(object[keys[i]]);
    }
    return csvStringifyArray(array, delimiter);
};

let csvStringifyEntries = (entries, delimiter) => {
    if (entries.length === 0) {
        return "";
    }
    if (!delimiter) {
        delimiter = ",";
    }
    let excludeKeys = ["createdAt", "index"];
    let header = csvStringifyArray(
        Object.keys(entries[0]).filter((key) => {
            return excludeKeys.indexOf(key) < 0;
        }),
        delimiter)
    return header + "\n" + entries.map((entry) => {
        return csvStringifyObject(entry, delimiter, excludeKeys);
    }).join("\n");
};

let slickArrow = function(kind) {
    if (kind === "prev") {
        icon = "chevron-left";
        clss = "slickPrev";
    }
    else if (kind === "next") {
        icon = "chevron-right";
        clss = "slickNext";
    }
    return "<button type='button' class='btn btn-primary btn-sm " + clss + "'><span class='glyphicon glyphicon-" + icon + "'></span></button>";
};

// TODO: make this better so it actually happens only when all intervals have been rendered
// TODO: maybe use TemplateHooks Template
let reslick = function(template, timeIntervals) {
    if (!timeIntervals || timeIntervals.length === 0) {
        timeIntervals = $(".timeIntervals");
    }
    let children = timeIntervals.children();
    if (children.length > 1 && children.filter("[data-offset='0']").length > 0) {
        timeIntervals.slick({
            prevArrow: slickArrow("prev"),
            nextArrow: slickArrow("next"),
        }).delay(100).animate({opacity: 1}, 300);
        // work-around because initialSlide does not work
        $(".slickPrev").click();
        // bind click event handler because .on('change') also does not work
        $(".slickPrev, .slickNext").click(function() {
            template.viewModeOffset.set(parseInt(children.filter(".slick-active").attr("data-offset"), 10));
        });
    }
    else {
        setTimeout(function() {
            reslick(template, timeIntervals);
        }, 200);
    }
};


Template.EntriesTable.helpers({
    project: function() {
        console.log("EntriesTable: project helper");
        return Template.instance().project;
    },
    entries: function() {
        console.log("calling entries()...", arguments);
        let template = Template.instance();
        let viewMode = template.viewMode.get();
        let offset = template.viewModeOffset.get();
        let refDate = moment().add(offset, UNITS_BY_VIEW_MODE[viewMode]);
        let filteredEntries = global.filterEntriesByViewMode(
            template.project.entries.map((entry, index) => {
                entry.index = index;
                entry.durationFormatted = moment
                    .duration(entry.duration, "seconds")
                    .format(global.timeFormat, {trim: false});
                return entry;
            }),
            viewMode,
            refDate
        );
        template.filteredEntries = filteredEntries;
        console.log("filteredEntries =", filteredEntries);
        return filteredEntries;
    },
    viewModes: function() {
        let currentViewMode = Template.instance().viewMode.get();
        return VIEW_MODES.map((viewMode) => {
            return {
                name: viewMode,
                labelClass: (currentViewMode === viewMode ? "active" : ""),
                iconClass: (currentViewMode === viewMode ? "eye-open" : "eye-close")
            };
        });
    },
    viewMode: function() {
        return Template.instance().viewMode.get();
    },
    // for the current viewMode -> find out how many entities we can go back
    timeIntervals: function() {
        let template = Template.instance();
        let viewMode = template.viewMode.get();
        if (viewMode !== "all") {
            console.log("calling timeIntervals");
            let unit = UNITS_BY_VIEW_MODE[viewMode].slice(0, -1);
            let earliestEntryDate = template.earliestEntryDate.clone().startOf(unit);
            let date = moment();
            let timeIntervals = [];
            let i = 0;
            while (date.isAfter(earliestEntryDate) || date.isSame(earliestEntryDate)) {
                timeIntervals.push({
                    name: date.format(MOMENT_FORMATS_BY_VIEW_MODE[viewMode]),
                    offset: i--
                });
                date.subtract(1, unit);
            }
            return timeIntervals.reverse();
        }
        return [];
    }
});

Template.EntriesTable.events({
    // VIEW MODE BUTTONS
    "click .btn.viewMode": function(event, template) {
        let timeIntervals = template.$(".timeIntervals");
        timeIntervals.css("opacity", 0).unslick();
        let btn = template.$(event.currentTarget);
        let viewMode = btn.attr("data-view-mode");
        template.viewMode.set(viewMode);
        setTimeout(function() {
            reslick(template, timeIntervals);
        }, 200);
        return true;
    },
    "click #exportCsv": function(event, template) {
        let viewMode = template.viewMode.get();
        let filename = template.project.name + "-" + viewMode + ".csv";
        // TODO: get delimiter from settings
        let blob = new Blob([csvStringifyEntries(template.filteredEntries, ",")], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
    }
});
