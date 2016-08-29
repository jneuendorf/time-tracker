Template.AddEntriesModal.onCreated(function() {
    console.log("creating AddEntriesModal");
    this.autorun(() => {
        this.subscribe("projects");
    });
});

let initDatetimepicker = function(container) {
    $find(".date", container).datetimepicker({
        format: global.dateFormat
    }).focus();
    $find(".duration", container).datetimepicker({
        format: "HH:mm:ss",
        // stepping: 5
        keyBinds: {
            up: function(widget) {
                this.date(this.date().clone().add(5, 'm'));
            },
            down: function(widget) {
                this.date(this.date().clone().subtract(5, 'm'));
            }
        }
    });
};
global.TemplateHooks.initDatetimepicker = initDatetimepicker;

Template.AddEntriesModal.onRendered(function() {
    let modal = $(this.find("#AddEntriesModal"));
    modal.on("shown.bs.modal", () => {
        modal.find(".date").focus();
        global.temporaryCallbacks.AddEntriesModalShown(modal);
        global.temporaryCallbacks.AddEntriesModalShown = function(modal) {};
    });
    initDatetimepicker(modal);
});

Template.AddEntriesModal.helpers({
    project: () => {
        let id = FlowRouter.getParam("id");
        return Projects.findOne({
            _id: id
        });
    }
});
