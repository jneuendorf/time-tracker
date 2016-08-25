Template.DeleteProject.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
        let id = FlowRouter.getParam("id");
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
