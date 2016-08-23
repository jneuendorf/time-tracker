// FlowRouter.triggers.enter([function(context, redirect) {
//     FlowRouter.go("home");
// }]);

FlowRouter.route("/", {
    name: "home",
    action() {
        BlazeLayout.render("HomeLayout", {main: "Projects"});
    }
});

FlowRouter.route("/projects/:id", {
    name: "project",
    action() {
        BlazeLayout.render("HomeLayout", {main: "Project"});
    }
});

// FlowRouter.route("/recipe-book", {
//     name: "recipe-book",
//     action() {
//         BlazeLayout.render("MainLayout", {
//             main: "Recipes"
//         });
//     }
// });
//
// FlowRouter.route("/recipe/:id", {
//     name: "recipe",
//     action() {
//         BlazeLayout.render("MainLayout", {
//             main: "RecipeSingle"
//         });
//     }
// });
