Template.AddEntryModal.onCreated(function() {
    console.log("creating AddEntryModal");
    let projectId = FlowRouter.getParam("id");
    this.autorun(() => {
        this.subscribe("project", projectId);
    });
    this.projectId = projectId;
});

let onSubmit = function(event, durationElem) {
    // event.preventDefault();
    let durationVal = durationElem.val();
    let duration = global.parseTime(durationVal);
    durationElem.val(duration.asSeconds());
};

let initDatetimepickerAndSubmit = function(container) {
    $find(".date", container).datetimepicker({
        format: global.dateFormat
    }).focus();
    let durationElem = $find(".duration", container);
    durationElem.attr("type", "text").datetimepicker({
        format: global.timeFormat,
        // "stepping: 5" does not work
        keyBinds: {
            up: function(widget) {
                this.date(this.date().clone().add(5, "m"));
            },
            down: function(widget) {
                this.date(this.date().clone().subtract(5, "m"));
            }
        }
    });
    $find("form", container).submit(function(event) {
        onSubmit.call(this, event, durationElem);
    });
};
global.TemplateHooks.initDatetimepickerAndSubmit = initDatetimepickerAndSubmit;


Template.AddEntryModal.onRendered(function() {
    let modal = this.$("#AddEntryModal");
    modal.on("shown.bs.modal", () => {
        modal.find(".date").focus();
        global.temporaryCallbacks.AddEntryModalShown(modal);
        global.temporaryCallbacks.AddEntryModalShown = function(modal) {};
    });
    initDatetimepickerAndSubmit(modal);
});

Template.AddEntryModal.helpers({
    project: function() {
        let project = Projects.findOne({
            _id: Template.instance().projectId
        });
        return project;
    }
});
