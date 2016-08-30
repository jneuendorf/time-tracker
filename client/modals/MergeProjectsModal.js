Template.MergeProjectsModal.onRendered(function() {
});

Template.MergeProjectsModal.events({
    "show.bs.modal": function(event, template) {
        template.parentId = template.$("input.parentId").val();
        template.parentName = template.$("input.parentName").val();
        template.childId = template.$("input.childId").val();
        template.childName = template.$("input.childName").val();

        template.$("span.childName").text(template.childName);
        template.$("span.parentName").text(template.parentName);
    },
    "click .modal-footer .btn-primary": function(event, template) {
        console.log("merging " + template.childName + " (" + template.childId + ") into " + template.parentName + " (" + template.parentId + ")");
    }
});
