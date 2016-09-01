Template.Project.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
    this.clockTimer = null;
    this.clockInitValue = null;
    this.currentValue = 0;
    this.clockValue = 0;
    this.projectId = FlowRouter.getParam("id");
    this.entriesView = new ReactiveVar("table");
});

let formatTime = (value) => {
    return numeral(value).format("00:00:00").replace(/^(\d)\:/, "0$1:");
}

let initialTime = () => {
    return formatTime(0);
}

Template.Project.helpers({
    project: function() {
        let project = Projects.findOne({
            _id: Template.instance().projectId
        });
        return project;
    },
    initialTime: function() {
        return initialTime();
    },
    view: function() {
        return Template.instance().entriesView.get();
    },
    viewModes: function() {
        return ["all", "today", "weekly", "monthly", "annually"];
    },
});

Template.Project.events({
    "submit #AddEntryForm": function(event, template) {
        template.$("#clock-reset").click();
    },
    // BACK TO OVERVIEW
    "click .back": function(event, template) {
        if (template.clockTimer) {
            event.preventDefault();
            event.stopPropagation();
        }
    },
    // TOGGLE CHART / TABLE
    "click #toggleEntriesView": function(event, template) {
        // show chart
        if (template.entriesView.get() === "table") {
            template.entriesView.set("chart");
        }
        // show table
        else {
            template.entriesView.set("table");
        }
    },
    // STOPWATCH BEHAVIOR
    "click #clock-save": function(event, template) {
        template.$("#clock-pause").click();
        let val = template.$("#clock").text();
        let modal = $("#AddEntryModal");
        modal.find("input.duration").val(val);
        // auto fill in today's date according to datetimepicker's format
        modal.find("input.date").focus();
        global.temporaryCallbacks.AddEntryModalShown = function(modal) {
            modal.find("input.note").focus();
        };
        template.$("#clock-save").removeClass("pulsing");
        modal.modal("show");
    },
    "click #clock-resume": function(event, template) {
        let clockValue = template.clockValue;
        let clock = template.$("#clock");
        // setting disabled with jquery .prop does not work on label elements
        template.$("#clock-pause").attr("disabled", null);
        template.$("#clock-save").prop("disabled", false);
        template.clockInitValue = Date.now();
        template.clockTimer = setInterval(() => {
            let seconds = (Date.now() - template.clockInitValue) / 1000;
            template.currentValue = seconds;
            clock.text(formatTime(template.clockValue + seconds));
        }, 1000);
        template.$(".back").addClass("disabled");
        let resumeBtn = template.$("#clock-resume");
        if (resumeBtn.hasClass("pulsing")) {
            resumeBtn.removeClass("pulsing");
        }
        resumeBtn.children("span").last().text("Resume");
    },
    "click #clock-pause": function(event, template) {
        template.clockValue += template.currentValue;
        clearInterval(template.clockTimer);
        template.clockTimer = null;
        template.$(".back").removeClass("disabled");
        template.$("#clock-save").addClass("pulsing");
    },
    "click #clock-reset": function(event, template) {
        template.clockValue = 0;
        template.clockInitValue = Date.now();
        template.$("#clock").text(initialTime());
        return true;
    }
});
