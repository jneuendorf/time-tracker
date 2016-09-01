Template.EntriesGraph.onRendered(function() {
    let entries = this.data.project.entries;
    let viewModes = this.data.viewModes;
    let data = [];

    for (let i = 0; i < viewModes.length; i++) {
        data.push(
            [viewModes[i]].concat(
                global.filterEntriesByViewMode(entries, viewModes[i]).map((entry) => {
                    return moment(entry.duration, global.timeFormat).unix();
                }).reduce((prev, current) => {
                    return prev + current;
                }, 0)
            )
        );
    }

    var chart = c3.generate({
        bindto: this.find('.chart'),
        data: {
            columns: data,
            type: "bar"
        },
        axis: {
            x: {
                tick: {
                    format: function() {
                        return "";
                    }
                }
            },
            y: {
                tick: {
                    format: function(timestamp) {
                        if (timestamp === 0) {
                            return "0h 0min";
                        }
                        return moment.unix(timestamp).format("H[h] mm[min]");
                    }
                }
            }
        },
        tooltip: {
            // grouped: false
        }
    });

    // this.autorun(function(tracker) {
    //     chart.load({
    //         columns: data
    //     });
    // });
});
