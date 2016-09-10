Template.DeleteProject.onCreated(function() {
    this.autorun(() => {
        let id = FlowRouter.getParam("id");
        this.subscribe("project", id);
        let project = Projects.findOne({_id: id});
        if (project) {
            Projects.remove({_id: id});
            global.goHome({
                showDeleted: true,
                projectName: project.name
            });
        }
    });
});
