Template.Projects.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
    // Template.instance().projects = new ReactiveVar([]);
    // this.projectsData = new ReactiveDict();
    // this.projectsData.set("projects", []);
    // this.projectsData.set("projectCount", 0);
});

Template.Projects.helpers({
    // projectData: () => {
    //     let projects = Projects.find({}, {sort: {createdAt: -1}});
    //     return {
    //         projects,
    //         projectCount: projects.count()
    //     };
    // },
    projects: () => {
        let projects = Projects.find({}, {sort: {createdAt: -1}});
        // Template.instance().projects.set(projects.fetch());
        // Template.instance().projectsData.set("projects", projects.fetch());
        // Template.instance().projectsData.set("projectCount", projects.count());
        return projects;
    },
    // projectCount: () => {
    //     return Template.instance().projects.get().length;
    // },
    groupedProjects: () => {
        // let projects = Template.instance().projects.get();
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
