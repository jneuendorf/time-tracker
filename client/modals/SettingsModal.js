Template.SettingsModal.onCreated(function(){
    this.autorun(() => {
        this.subscribe("projects");
    });
});

Template.SettingsModal.onRendered(function() {
    this.$('[data-toggle="tooltip"]')
        .attr("title", this.$(".updateProjectUrlTooltip").html())
        .tooltip({html: true});
});
