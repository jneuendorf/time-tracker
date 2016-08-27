Template.Project.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
    this.clockTimer = null;
    this.clockInitValue = null;
    this.currentValue = 0;
    this.clockValue = 0;
    this.projectId = FlowRouter.getParam("id");
});

let initialTime = () => {
    return numeral(0).format("00:00:00");
}

let getCurrentProject = function() {
    let id = FlowRouter.getParam("id");
    let project = Projects.findOne({
        // _id: id
        _id: Template.instance().projectId
    });
    return project;
};

Template.Project.helpers({
    project: () => {
        // let id = FlowRouter.getParam("id");
        let project = Projects.findOne({
            _id: Template.instance().projectId
        });
        return project;
    },
    // project: getCurrentProject,
    initialTime: () => {
        return initialTime();
    }
});

Template.Project.events({
    "click #clock-save": function(event, template) {
        let val = template.$("#clock").val();
    },
    // STOPWATCH BEHAVIOR
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
            clock.val(numeral(template.clockValue + seconds).format("00:00:00"));
        }, 1000);
    },
    "click #clock-pause": function(event, template) {
        template.clockValue += template.currentValue;
        clearInterval(template.clockTimer);
    },
    "click #clock-reset": function(event, template) {
        template.clockValue = 0;
        template.clockInitValue = Date.now();
        template.$("#clock").val(initialTime());
        return true;
    },
    // ENTRY BUTTONS
    "click .entry .edit": function(event, template) {
        // let btn = template.$(event.currentTarget);
        // let createdAt = parseInt(btn.attr("data-created-at"), 10);
        // let entries = Projects.findOne({_id: template.projectId}).entries;
        // Projects.update({
        //     _id: template.projectId
        // }, {
        //     $set: {
        //         entries: entries.filter((entry) => {
        //             return entry.createdAt !== createdAt;
        //         })
        //     }
        // });
    },
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
