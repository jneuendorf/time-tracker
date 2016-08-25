Template.Project.onCreated(function() {
    this.autorun(() => {
        this.subscribe("projects");
    });
    this.clockTimer = null;
    this.clockInitValue = null;
    this.currentValue = 0;
    this.clockValue = 0;
});

// Template.Project.onRendered(function() {
//     let $clock = this.$("#clock");
//     let initialized = false;
//
//     $("#btn-reset").click(function() {
//         $clock.countdown(new Date());
//         return true;
//     });
//
//     $("#btn-pause").click(function() {
//         $clock.countdown("pause");
//         return true;
//     });
//
//     $("#btn-resume").click(function() {
//         if (!initialized) {
//             $clock.countdown(new Date(), {elapse: true})
//                 .on("update.countdown", function(event) {
//                     $clock.html(event.strftime("%M:%S"));
//                 });
//         }
//         $clock.countdown("resume");
//         return true;
//     });
// });

let initialTime = () => {
    return numeral(0).format("00:00:00");
}

Template.Project.helpers({
    project: () => {
        let id = FlowRouter.getParam("id");
        let project = Projects.findOne({
            _id: id
        });
        return project;
        if (!project) {
            global.goHome();
        } else {
            return project;
        }
    },
    initialTime: () => {
        return initialTime();
    }
});

Template.Project.events({
    "click #btn-resume": function(event, template) {
        let clockValue = template.clockValue;
        let clock = template.$("#clock");
        template.clockInitValue = Date.now();
        template.clockTimer = setInterval(() => {
            let seconds = (Date.now() - template.clockInitValue) / 1000;
            template.currentValue = seconds;
            clock.html(numeral(template.clockValue + seconds).format("00:00:00"));
        }, 1000);
    },
    "click #btn-pause": function(event, template) {
        template.clockValue += template.currentValue;
        clearInterval(template.clockTimer);
    },
    "click #btn-reset": function(event, template) {
        template.clockValue = 0;
        template.clockInitValue = Date.now();
        template.$("#clock").html(initialTime());
        return true;
    }
});
