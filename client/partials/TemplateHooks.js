Template.TemplateHooks.onRendered(function() {
    let container = this.$(".container").val();
    if (container.length) {
        container = this.$("*").closest(container);
    }
    else {
        container = this.$("*").parent();
    }
    let funcName = this.$(".onRendered").val();
    global.TemplateHooks[funcName].call(this, container, this.data);
});
