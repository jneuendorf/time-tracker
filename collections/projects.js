Projects = new Mongo.Collection('projects');

// Projects.allow({
//     insert: function(userId, doc) {
//         return !!userId;
//     },
//     update: function(userId, doc) {
//         return !!userId;
//     }
// });

// Schemas = {
//     TestSchema: new SimpleSchema({
//         id: {
//             type: Number
//         },
//         name: {
//             type: String
//         }
//     })
// };

Entry = new SimpleSchema({
    name: {
        type: String
    },
    start: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    },
    end: {
        type: Date,
        autoValue: function () {
            return new Date();
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
        label: "Description"
    },
    entries: {
        type: [Entry],
        defaultValue: [],
        optional: true,
        autoform: {
            type: "hidden"
        }
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
