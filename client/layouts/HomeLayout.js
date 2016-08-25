Template.HomeLayout.onCreated(() => {
    if (FlowRouter.getQueryParam("showDeleted") === "true") {
        Bert.alert({
            title: "Done",
            message: "Deleted project with name " + FlowRouter.getQueryParam("projectName"),
            type: "success",
            style: "growl-top-right",
            icon: "glyphicon glyphicon-ok"
        });
    }
});
