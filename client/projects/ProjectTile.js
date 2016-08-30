Template.ProjectTile.onRendered(function() {
    let template = this;

    let light = "#ffffff";
    let lightShadow = "rgb(219, 219, 219)";
    let dark = "#3b3434";
    let darkShadow = dark;
    let over = false;
    let initialColor = null;

    let onOut = function(event, ui) {
        over = false;
        $(this).stop(true).animate({
            "background-color": light,
            "box-shadow": "2px 2px 10px 0 " + lightShadow,
            "color": initialColor
        }, 800);
    };

    this.$(".project.box")
        .draggable({
            helper: function() {
                return $(this).clone().css({
                    "pointer-events": "none",
                    "transform": "scale(0.8, 0.8)"
                });
            },
            revert: "invalid",
            revertDuration: 300,
            zIndex: 50
        })
        .droppable({
            over: function(event, ui) {
                if (!over) {
                    over = true;
                    let self = $(this);
                    if (!initialColor) {
                        initialColor = self.css("color");
                    }
                    setTimeout(() => {
                        self.stop(true).animate({
                            "background-color": dark,
                            "box-shadow": "2px 2px 10px 0 " + darkShadow,
                            "color": light
                        }, 800);
                    }, 500);
                }
            },
            out: onOut,
            drop: function(event, ui) {
                onOut.call(this);

                let modal = $("#MergeProjectsModal");
                modal.find(".parentId").val(template.data._id);
                modal.find(".parentName").val(template.data.name);
                modal.find(".childId").val(ui.helper.find(".projectId").val());
                modal.find(".childName").val(ui.helper.find(".name").text().trim());

                modal.modal("show");
            }
        });
});
