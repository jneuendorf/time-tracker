Template.Entry.onCreated(function() {
    let projectId = FlowRouter.getParam("id");
    this.autorun(() => {
        this.subscribe("project", projectId);
    });
    this.projectId = projectId;
});

Template.Entry.helpers({
    project: function() {
        let project = Projects.findOne({
            _id: Template.instance().projectId
        });
        return project;
    }
});

Template.Entry.events({
    // ENTRY MODIFICATION BUTTONS IN TABLE
    "click .entry .delete": function(event, template) {
        let btn = template.$(event.currentTarget);
        let createdAt = parseInt(btn.attr("data-created-at"), 10);
        let entries = Projects.find({_id: this.projectId}).fetch()[0].entries;
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
