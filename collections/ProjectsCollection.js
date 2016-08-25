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
    duration: {
        type: String,
        autoform: {
            afFieldInput: {
                class: "duration"
            }
        }
    },
    note: {
        type: String,
        optional: true
    }
});

ProjectSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name"
    },
    description: {
        type: String,
        label: "Description"
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
            return new Date()
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