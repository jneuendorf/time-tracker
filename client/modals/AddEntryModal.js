Template.AddEntryModal.onCreated(function() {
    console.log("creating AddEntryModal");
    let projectId = FlowRouter.getParam("id");
    this.autorun(() => {
        this.subscribe("project", projectId);
    });
    this.projectId = projectId;
});

Template.AddEntryModal.onRendered(function() {
    let modal = this.$("#AddEntryModal");
    modal.on("shown.bs.modal", () => {
        modal.find(".date").focus();
        global.temporaryCallbacks.AddEntryModalShown(modal);
        global.temporaryCallbacks.AddEntryModalShown = function() {};
    });
    global.TemplateHooks.initDatetimepickerAndSubmit(modal);
});

Template.AddEntryModal.helpers({
    project: function() {
        let project = Projects.findOne({
            _id: Template.instance().projectId
        });
        return project;
    }
});
