Template.Entry.onCreated(function() {
    let projectId = FlowRouter.getParam("id");
    this.autorun(() => {
        this.subscribe("project", projectId);
    });
    this.projectId = projectId;
    this.project = Projects.find({_id: projectId});
});

Template.Entry.helpers({
    project: function() {
        return Template.instance().project.fetch()[0];
    },
    dayOfWeek: function() {
        return parseDate(Template.instance().data.date).format("ddd");
    }
});

Template.Entry.events({
    // ENTRY MODIFICATION BUTTONS IN TABLE
    "click .entry .delete": function(event, template) {
        let btn = template.$(event.currentTarget);
        let createdAt = parseInt(btn.attr("data-created-at"), 10);
        let entries = (template.project.fetch()[0] || {}).entries;
        if (entries) {
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
    }
});
