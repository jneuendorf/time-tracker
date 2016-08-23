Template.NavBar.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
});

Template.NavBar.helpers({
    projects: () => {
        return Projects.find();
    }
});

Template.NavBar.events({
    'click .nav-tabs a': () => {
        $(this).tab('show');
    }
});
