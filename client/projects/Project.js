Template.Project.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
});

Template.Project.onRendered(function() {
    let $clock = this.$("#clock");
    let initialized = false;

    $("#btn-reset").click(function() {
        $clock.countdown(new Date());
        return true;
    });

    $("#btn-pause").click(function() {
        $clock.countdown("pause");
        return true;
    });

    $("#btn-resume").click(function() {
        if (!initialized) {
            $clock.countdown(new Date(), {elapse: true})
                .on("update.countdown", function(event) {
                    $clock.html(event.strftime("%M:%S"));
                });
        }
        $clock.countdown("resume");
        return true;
    });
});

Template.Project.helpers({
    project: () => {
        let id = FlowRouter.getParam("id");
        let project = Projects.findOne({
            _id: id
        });
        return project;
        if (!project) {
            // alert("this!")
            debugger;
            global.goHome();
        } else {
            // console.log(project.name);
            // Session.set("projectName", project.name);
            return project;
        }
    }
});

// Template.Project.events({
//     "click .deleteProject": () => {
//         // console.log(Session.get("projectName"));
//         global.AjaxLoader.fadeIn(100, () => {
//             let id = FlowRouter.getParam("id");
//             // Projects.remove({_id: id});
//             global.goHome({
//                 showDeleted: true,
//                 projectName: Session.get("projectName")
//             });
//         });
//     }
// });
