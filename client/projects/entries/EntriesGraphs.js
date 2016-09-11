const LABELS_BY_VIEW_MODE = {
    all: "all",
    today: "today",
    weekly: "this week",
    monthly: "this month",
    annually: "this year"
};

const GRAPH_CONFIG = {
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
                format: function(seconds) {
                    // for linear y axis
                    // return moment.duration(seconds, "seconds").format("D[d] H[h] mm[min]");
                    // for logarithmic y axis
                    return moment.duration(Math.ceil(Math.pow(10, seconds)), "seconds").format("D[d] H[h] mm[min]");
                }
            }
        }
    }
};


Template.EntriesGraphs.onRendered(function() {
    let entries = this.data.project.entries;
    let viewModes = this.data.viewModes;
    let data = [];
    let aggregated;

    for (let i = 0; i < viewModes.length; i++) {
        aggregated = global.filterEntriesByViewMode(entries, viewModes[i]).map((entry) => {
            return entry.duration;
        }).reduce((prev, current) => {
            return prev + current;
        }, 0);

        data.push(
            [LABELS_BY_VIEW_MODE[viewModes[i]]].concat(
                // for linear y axis
                // aggregated
                // for logarithmic y axis
                aggregated !== 0 ? (Math.log(aggregated) / Math.LN10) : 0
            )
        );
    }

    var chart = c3.generate($.extend(true, {
        bindto: this.find('.aggregatedChart'),
        data: {
            columns: data,
            type: "bar"
        }
    }, GRAPH_CONFIG));
});

Template.EntriesGraphs.events({
    "mouseenter svg": function(event, template) {
        // show export button for chart
    }
});
