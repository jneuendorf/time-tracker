Template.Project.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
    this.clockTimer = null;
    this.clockInitValue = null;
    this.currentValue = 0;
    this.clockValue = 0;
    this.projectId = FlowRouter.getParam("id");
    // this.viewMode = new ReactiveVar("all");
    // this.viewModeOffset = new ReactiveVar(0);
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
    }
});

Template.Project.events({
    "submit #AddEntriesForm": function(event, template) {
        template.$("#clock-reset").click();
    },
    // BACK TO OVERVIEW
    "click .back": function(event, template) {
        if (template.clockTimer) {
            event.preventDefault();
            event.stopPropagation();
        }
    },
    // STOPWATCH BEHAVIOR
    "click #clock-save": function(event, template) {
        template.$("#clock-pause").click();
        let val = template.$("#clock").val();
        let modal = $("#AddEntriesModal");
        modal.find("input.duration").val(val);
        // auto fill in today's date according to datetimepicker's format
        modal.find("input.date").focus();
        global.temporaryCallbacks.AddEntriesModalShown = function(modal) {
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
            clock.val(formatTime(template.clockValue + seconds));
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
        template.$("#clock").val(initialTime());
        return true;
    },
    // ENTRY MODIFICATION BUTTONS IN TABLE
    "click .entry .delete": function(event, template) {
        let btn = template.$(event.currentTarget);
        let createdAt = parseInt(btn.attr("data-created-at"), 10);
        let entries = Projects.findOne({_id: template.projectId}).entries;
        // console.log("new entries:", entries.filter((entry) => {
        //     return entry.createdAt !== createdAt;
        // }));
        // db.coll.update({<cond to identify document}, {$pull: {'comments': {'name': <name>}}} )
        Projects.update({
            _id: template.projectId
        }, {
            $set: {
                entries: entries.filter((entry) => {
                    return entry.createdAt !== createdAt;
                })
            }
        });
    }
});
