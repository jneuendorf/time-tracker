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
    let modalContent = modal.find(".modal-content");
    let setMinHeight = false;
    modal.on("shown.bs.modal", () => {
        if (!setMinHeight) {
            // set min height to prevent flickering when autoform is rendering
            modalContent.css("min-height", modalContent.outerHeight());
            setMinHeight = true;
        }
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
