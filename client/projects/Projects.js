Template.Projects.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
});

Template.Projects.helpers({
    projectCount: () => {
        return Projects.find().count();
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
