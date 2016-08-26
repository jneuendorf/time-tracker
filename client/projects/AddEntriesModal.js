Template.AddEntriesModal.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
});

Template.AddEntriesModal.onRendered(function() {
    // TODO: make this work. seems not be reactive (get called but no datepicker after 1st submit)
    this.$(".date").datetimepicker({
        format: "DD.MM.YY"
    }).on("dp.hide", () => {
        this.$(".duration").focus();
    });
    this.$(".duration").datetimepicker({
        format: "HH:mm",
        keyBinds: {
            "up": function(widget) {
                this.date(this.date().clone().add(5, 'm'));
            },
            "down": function(widget) {
                this.date(this.date().clone().subtract(5, 'm'));
            }
        }
    }).on("dp.hide", () => {
        this.$(".note").focus();
    });
    let modal = this.$("#AddEntriesModal");
    modal.on("shown.bs.modal", () => {
        this.$(".date").focus();
    });
});

Template.AddEntriesModal.helpers({
    project: () => {
        let id = FlowRouter.getParam("id");
        return Projects.findOne({
            _id: id
        });
    }
});

Template.AddEntriesModal.events({
    "submit": function(event, template) {
        // TODO: make this work. seems not be reactive (get called but nothing's focused)
        template.$(".date").focus();
    }
});
