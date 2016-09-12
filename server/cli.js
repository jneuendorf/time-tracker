let child_process = Npm.require('child_process');

let ls = child_process.spawn("ls");

ls.stdout.setEncoding("utf8");
ls.stdout.setEncoding("utf8");
ls.stdout.on("data", function(data) {
    process.stdout.write(data);
});

ls.stderr.setEncoding("utf8");
ls.stderr.on("data", function(data) {
    process.stderr.write(data);
});
