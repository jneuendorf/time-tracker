// FlowRouter.triggers.enter([function(context, redirect) {
//     FlowRouter.go("home");
// }]);

FlowRouter.notFound = {
    action: () => {
        FlowRouter.go("home");
    }
};


FlowRouter.route("/", {
    name: "home",
    action: () => {
        BlazeLayout.render("HomeLayout", {main: "Projects"});
    }
});

FlowRouter.route("/projects/:id", {
    name: "project",
    action: () => {
        BlazeLayout.render("HomeLayout", {main: "Project"});
    }
});

FlowRouter.route("/projects/:id/delete", {
    name: "deleteProject",
    action: () => {
        BlazeLayout.render("HomeLayout", {main: "DeleteProject"});
    }
});
