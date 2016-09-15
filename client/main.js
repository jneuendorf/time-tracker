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
    return Array.prototype.slice.call(arguments, 0, -1).reduce((prev, current) => {
        return !!prev && current;
    }, true);
});
Template.registerHelper("or", function() {
    // last argument is the spacebar keyword hash
    return Array.prototype.slice.call(arguments, 0, -1).reduce((prev, current) => {
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
    for (let key in kwargs) {
        if (kwargs.hasOwnProperty(key) && !this[key]) {
            this[key] = kwargs[key];
        }
    }
    return "";
});

Template.registerHelper("jQuery", function(str) {
    return $(str);
});

Template.registerHelper("nl2br", function(str) {
    return $("<p/>").html(str).text().replace(/\n/g, "<br>");
});



// HOOKS
const changeSubmitBtnState = function(template, state) {
    template.$("button[type='submit']").prop("disabled", state);
};
global.AUTOFORM_SUBMIT_CALLBACKS = {
    beginSubmit: function() {
        console.log("beginSubmit");
        changeSubmitBtnState(this.template, true);
    },
    endSubmit: function() {
        console.log("endSubmit");
        changeSubmitBtnState(this.template, false);
    },
    // formToDoc: function(doc) {
    //     console.log("formToDoc", doc);
    //     doc.duration = global.parseTime(doc.duration).asSeconds();
    //     return doc;
    // },
    // formToModifier: function(modifier) {
    //     console.log("formToModifier", modifier);
    //     return modifier;
    // },
    // before: {
    //     update: function(doc) {
    //         console.log("before", doc);
    //         return doc;
    //     }
    // }
};
global.AUTOFORM_EDIT_ENTRY_CALLBACKS = $.extend({}, global.AUTOFORM_SUBMIT_CALLBACKS, {
    formToModifier: function(modifier) {
        let regex = /entries\.\d\.duration/;
        for (let key in modifier.$set) {
            if (regex.test(key)) {
                modifier.$set[key] = global.parseTime(modifier.$set[key]).asSeconds();
                break;
            }
        }
        console.log("formToModifier", modifier);
        return modifier;
    }
});

AutoForm.hooks({
    AddEntryForm: $.extend(
        {
            formToDoc: function(doc) {
                console.log("formToDoc", doc);
                doc.duration = global.parseTime(doc.duration).asSeconds();
                return doc;
            }
        },
        global.AUTOFORM_SUBMIT_CALLBACKS
    )
});
