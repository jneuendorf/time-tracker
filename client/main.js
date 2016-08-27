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
