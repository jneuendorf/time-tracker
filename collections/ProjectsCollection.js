Projects = new Mongo.Collection('projects');

// Projects.allow({
//     insert: function(userId, doc) {
//         return !!userId;
//     },
//     update: function(userId, doc) {
//         return !!userId;
//     }
// });

Entry = new SimpleSchema({
    createdAt: {
        type: Number,
        label: "Created At",
        autoValue: function(entry) {
            return Date.now();
        },
        autoform: {
            type: "hidden"
        }
    },
    date: {
        type: String,
        autoform: {
            afFieldInput: {
                class: "date",
            }
        }
    },
    duration: {
        type: Number,
        autoform: {
            afFieldInput: {
                class: "duration"
            }
        }
    },
    note: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                class: "note",
                type: "textarea"
            }
        }
    }
});

ProjectSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name"
    },
    description: {
        type: String,
        label: "Description",
        autoform: {
            afFieldInput: {
                type: "textarea"
            }
        }
    },
    entries: {
        type: [Entry],
        defaultValue: [],
        optional: true
    },
    createdAt: {
        type: Date,
        label: "Created At",
        autoValue: function() {
            return new Date();
        },
        autoform: {
            type: "hidden"
        }
    }
});

// Meteor.methods({
//     toggleMenuItem: function(id, currentState) {
//         Projects.update(id, {
//             $set: {
//                 inMenu: !currentState
//             }
//         });
//     },
//     deleteRecipe: function(id) {
//         Projects.remove(id);
//     }
// });

Projects.attachSchema(ProjectSchema);
