Template.Project.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
});

Template.Entry.events({
    // ENTRY MODIFICATION BUTTONS IN TABLE
    "click .entry .delete": function(event, template) {
        let btn = template.$(event.currentTarget);
        let createdAt = parseInt(btn.attr("data-created-at"), 10);
        let entries = template.data.project.entries;
        // console.log("new entries:", entries.filter((entry) => {
        //     return entry.createdAt !== createdAt;
        // }));
        // db.coll.update({<cond to identify document}, {$pull: {'comments': {'name': <name>}}} )
        Projects.update({
            _id: template.data.project._id
        }, {
            $set: {
                entries: entries.filter((entry) => {
                    return entry.createdAt !== createdAt;
                })
            }
        });
    }
});
