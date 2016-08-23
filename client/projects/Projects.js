Template.Projects.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
});

Template.Projects.helpers({
    projects: () => {
        return Projects.find();
    }
});
