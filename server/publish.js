Meteor.publish('projects', function() {
    // console.log("publishing all");
    return Projects.find();
});

Meteor.publish('project', function(id) {
    // console.log("publishing " + id);
    return Projects.find({_id: id});
});
