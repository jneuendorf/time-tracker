Template.EntriesTable.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
    this.viewMode = new ReactiveVar("all");
    this.viewModeOffset = new ReactiveVar(0);
    this.entries = [];
});

// let filterBy = (entries, kind) => {
//     let refValue = moment()[kind]();
//     // console.log(kind + "ly", refValue);
//     return entries.filter((entry) => {
//         return global.parseDate(entry.date)[kind]() === refValue;
//     });
// };

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
    console.log(array);
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

Template.EntriesTable.helpers({
    entries: function() {
        let template = Template.instance();
        let entries = this.project.entries.map((entry, index) => {
            entry.index = index;
            return entry;
        });
        let viewMode = template.viewMode.get();
        entries = global.filterEntriesByViewMode(entries, viewMode);
        template.entries = entries;
        return entries;
    },
    viewModes: function() {
        let viewModes = ["all", "today", "weekly", "monthly", "annually"];
        let currentViewMode = Template.instance().viewMode.get();
        return viewModes.map((viewMode) => {
            return {
                name: viewMode,
                labelClass: (currentViewMode === viewMode ? "active" : ""),
                iconClass: (currentViewMode === viewMode ? "eye-open" : "eye-close")
            };
        });
    },
    viewMode: function() {
        return Template.instance().viewMode.get();
    }
});

Template.EntriesTable.events({
    // VIEW MODE BUTTONS
    "click .btn.viewMode": function(event, template) {
        let btn = template.$(event.currentTarget);
        let viewMode = btn.attr("data-view-mode");
        template.viewMode.set(viewMode);
        return true;
    },
    "click #exportCsv": function(event, template) {
        let viewMode = template.viewMode.get();
        let filename = template.data.project.name + "-" + viewMode + ".csv";
        // TODO: get delimiter from settings
        let blob = new Blob([csvStringifyEntries(template.entries, ",")], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
    }
});
