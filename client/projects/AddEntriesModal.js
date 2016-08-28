Template.AddEntriesModal.onCreated(function() {
    console.log("creating AddEntriesModal");
    this.autorun(() => {
        this.subscribe("projects");
    });
});

let initDatetimepicker = function(container) {
    $find(".date", container).datetimepicker({
        format: "DD.MM.YY"
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
    },
    now: () => {
        return Date.now();
    }
});

// Template.AddEntriesModal.events({
//     "submit": function(event, template) {
//         // TODO: make this work. seems not be reactive (get called but nothing's focused)
//         template.$(".date").focus();
//     }
// });
