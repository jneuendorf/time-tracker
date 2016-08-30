Template.EntriesTable.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
    this.viewMode = new ReactiveVar("all");
    this.viewModeOffset = new ReactiveVar(0);
});

let filterBy = (entries, kind) => {
    let refValue = moment()[kind]();
    // console.log(kind + "ly", refValue);
    return entries.filter((entry) => {
        return global.parseDate(entry.date)[kind]() === refValue;
    });
};

Template.EntriesTable.helpers({
    entries: function() {
        let template = Template.instance();
        let entries = this.project.entries.map((entry, index) => {
            entry.index = index;
            return entry;
        });
        let viewMode = template.viewMode.get();
        switch (viewMode) {
            case "all":
                break;
            case "today":
                let todayStr = global.formatDate(new Date());
                entries = entries.filter((entry) => {
                    return entry.date === todayStr;
                });
                break;
            case "weekly":
                entries = filterBy(entries, "week");
                break;
            case "monthly":
                entries = filterBy(entries, "month");
                break;
            case "annually":
                entries = filterBy(entries, "year");
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
});
