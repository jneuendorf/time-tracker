const LABELS_BY_VIEW_MODE = {
    all: "all",
    today: "today",
    weekly: "this week",
    monthly: "this month",
    annually: "this year"
};

Template.EntriesGraph.onRendered(function() {
    let entries = this.data.project.entries;
    let viewModes = this.data.viewModes;
    let data = [];
    let aggregated;

    for (let i = 0; i < viewModes.length; i++) {
        aggregated = global.filterEntriesByViewMode(entries, viewModes[i]).map((entry) => {
            return moment(entry.duration, global.timeFormat).unix();
        }).reduce((prev, current) => {
            return prev + current;
        }, 0);

        data.push(
            [LABELS_BY_VIEW_MODE[viewModes[i]]].concat(
                // for logarithmic y axis
                // aggregated !== 0 ? Math.log(aggregated) / Math.LN10 : 0
                aggregated
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
                        return moment.unix(timestamp).format("D[d] H[h] mm[min]");
                        // for logarithmic y axis
                        // return moment.unix(Math.pow(10, timestamp)).format("D[d] H[h] mm[min]");
                    }
                }
            }
        }
    });
});
