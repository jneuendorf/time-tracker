// // Meteor.subscribe("projects");


// TEMPLATE HELPERS (accessible in all templates)
Template.registerHelper("firstOf", function() {
    let i = 0;
    let maxIndex = arguments.length - 1;
    while (!arguments[i] && i < maxIndex) {
        i++;
    }
    return arguments[i];
});

Template.registerHelper("concat", function() {
    // last argument is the spacebar keyword hash
    return Array.prototype.slice.call(arguments, 0, -1).join("");
});

Template.registerHelper("and", function() {
    // last argument is the spacebar keyword hash
    return Array.prototype.slice.call(arguments, 0, -1).reduce((prev, current, index) => {
        return !!prev && current;
    }, true);
});
Template.registerHelper("or", function() {
    // last argument is the spacebar keyword hash
    return Array.prototype.slice.call(arguments, 0, -1).reduce((prev, current, index) => {
        return !!prev || current;
    }, false);
});
Template.registerHelper("equals", function(a, b) {
    return a === b;
});
Template.registerHelper("not", function(a) {
    return !a;
});

Template.registerHelper("attachToThis", function(kwargs) {
    kwargs = kwargs.hash;
    for (var key in kwargs) {
        if (kwargs.hasOwnProperty(key) && !this[key]) {
            this[key] = kwargs[key];
        }
    }
    return "";
});
