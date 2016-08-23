Template.Project.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
});

Template.Project.helpers({
    project: () => {
        let id = FlowRouter.getParam("id");
        return Projects.findOne({_id: id});
    }
});
