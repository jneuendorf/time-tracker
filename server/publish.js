Meteor.publish('projects', function() {
    return Projects.find();
});

Meteor.publish('project', function(id) {
    return Projects.find({_id: id});
});
