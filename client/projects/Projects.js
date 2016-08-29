Template.Projects.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
});

Template.Projects.helpers({
    projects: () => {
        let projects = Projects.find({}, {sort: {createdAt: -1}});
        return projects;
    },
    groupedProjects: () => {
        let projects = Projects.find({}, {sort: {createdAt: -1}}).fetch();
        let groupedProjects = [];
        let blockSize = 12;
        let numBlocks = Math.floor(projects.length / blockSize) + 1;
        for (var i = 0; i < numBlocks; i++) {
            groupedProjects.push({projects: projects.slice(i * blockSize, blockSize)});
        }
        return groupedProjects;
    }
});

Template.Projects.events({
    "click .settings": function(event, template){
        // TODO: show modal with settings (i.e. for configuring an api)
    }
});
