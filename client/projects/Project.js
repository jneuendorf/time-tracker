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
//     $("#clock-reset").click(function() {
//         $clock.countdown(new Date());
//         return true;
//     });
//
//     $("#clock-pause").click(function() {
//         $clock.countdown("pause");
//         return true;
//     });
//
//     $("#clock-resume").click(function() {
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
    "click #clock-save": function(event, template) {
        let val = template.$("#clock").val();
    },
    // stopwatch behavior
    "click #clock-resume": function(event, template) {
        let clockValue = template.clockValue;
        let clock = template.$("#clock");
        // setting disabled with jquery .prop does not work on label elements
        template.$("#clock-pause").attr("disabled", null);
        template.$("#clock-save").prop("disabled", false);
        template.clockInitValue = Date.now();
        template.clockTimer = setInterval(() => {
            let seconds = (Date.now() - template.clockInitValue) / 1000;
            template.currentValue = seconds;
            clock.val(numeral(template.clockValue + seconds).format("00:00:00"));
        }, 1000);
    },
    "click #clock-pause": function(event, template) {
        template.clockValue += template.currentValue;
        clearInterval(template.clockTimer);
    },
    "click #clock-reset": function(event, template) {
        template.clockValue = 0;
        template.clockInitValue = Date.now();
        template.$("#clock").val(initialTime());
        return true;
    }
});
