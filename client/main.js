// Meteor.subscribe("projects");

global.goHome = (params) => {
    if (!params) {
        location.href = "/";
    }
    else {
        let parts = [];
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                parts.push(key + "=" + params[key]);
            }
        }
        // setTimeout(() => {
        //     location.href = "/?" + parts.join("&");
        // }, 4000);
        location.href = "/?" + parts.join("&");
    }
}
