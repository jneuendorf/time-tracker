Template.AddEntriesModal.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
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
    "click .btn.autoform-add-item": function(event, template) {
        // TODO: find a better way
        setTimeout(() => {
            template.$(".duration").datetimepicker({
                format: "HH:mm",
                keyBinds: {
                    "up": function(widget) {
                        this.date(this.date().clone().add(5, 'm'));
                        // if (widget.find('.datepicker').is(':visible')) {
                        //     this.date(this.date().clone().subtract(7, 'd'));
                        // }
                        // else {
                        // }
                    },
                    "down": function(widget) {
                        if (!widget) {
                            this.show();
                        }
                        else {
                            this.date(this.date().clone().subtract(5, 'm'));
                        }
                        // else if (widget.find('.datepicker').is(':visible')) {
                        //     this.date(this.date().clone().add(7, 'd'));
                        // }
                        // else {
                        //     this.date(this.date().clone().subtract(1, 'm'));
                        // }
                    },
                }
            });
        }, 10);
    }
});
