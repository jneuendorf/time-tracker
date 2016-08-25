Template.NewProjectModal.onRendered(() => {
    let modal = $("#NewProjectModal");
    modal.on("shown.bs.modal", function () {
        modal.find("input:first").focus();
    })
});

Template.NewProjectModal.events({
    "submit #newProjectForm": function(event, template) {
        $("#NewProjectModal").find("input:first").focus();
    }
});
