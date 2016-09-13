const AGGR_LABELS_BY_VIEW_MODE = {
    all: "all",
    today: "today",
    weekly: "this week",
    monthly: "this month",
    annually: "this year"
};
const TREND_LABELS_BY_VIEW_MODE = {
    today: "daily",
    weekly: "weekly",
    monthly: "monthly",
    annually: "annually"
};

const UNITS_BY_VIEW_MODE = {
    today: "days",
    weekly: "weeks",
    monthly: "months",
    annually: "years"
};

const addDurations = function(entries) {
    return entries.map((entry) => {
        return entry.duration;
    }).reduce((prev, current) => {
        return prev + current;
    }, 0);
};

const GRAPH_CONFIG = {
    data: {
        // TODO: this does not work
        // color: {
        //     // aggregated chart
        //     all: "rgb(31, 119, 180)",
        //     today: "rgb(255, 127, 14)",
        //     "this week": "rgb(44, 160, 44)",
        //     "this month": "rgb(214, 39, 40)",
        //     // "this year": "rgb(148, 103, 189)",
        //     "this year": "black",
        //     // trending chart
        //     daily: "rgb(255, 127, 14)",
        //     weekly: "rgb(44, 160, 44)",
        //     monthly: "rgb(214, 39, 40)",
        //     annually: "rgb(148, 103, 189)",
        // }
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
                format: function(seconds) {
                    // for linear y axis
                    // return moment.duration(seconds, "seconds").format("D[d] H[h] mm[min]");
                    // for logarithmic y axis
                    return moment.duration(global.exp10(seconds), "seconds").format("D[d] H[h] mm[min]");
                }
            }
        }
    }
};

const loadGraphData = function() {
    let entries = this.entries;
    let viewModes = this.viewModes;
    let viewMode;
    let aggregatedData = [];
    let trendingData = {};
    let aggregated;
    let xs = {};
    let i;

    /////////////////////////////////////////////////////////////////
    // AGGREGATED CHART
    for (i = 0; i < viewModes.length; i++) {
        viewMode = viewModes[i];
        aggregated = addDurations(global.filterEntriesByViewMode(entries, viewMode));

        aggregatedData.push(
            [AGGR_LABELS_BY_VIEW_MODE[viewMode]].concat(
                // for linear y axis
                // aggregated
                // for logarithmic y axis
                global.log10(aggregated)
            )
        );
        // prepare data for trending data
        if (viewMode !== "all") {
            let label = TREND_LABELS_BY_VIEW_MODE[viewMode];
            xs[label] = "x-" + label;
            trendingData[viewMode] = {
                x: [xs[label]],
                y: [label]
            };
        }
    }
    this.aggregatedChart.load({
        columns: aggregatedData
    });

    /////////////////////////////////////////////////////////////////
    // TRENDING CHART
    // skip viewMode "all"
    viewModes = viewModes.slice(1);
    for (i = 0; i < viewModes.length; i++) {
        viewMode = viewModes[i];
        let unit = UNITS_BY_VIEW_MODE[viewMode];
        let groupFunc = function(entry) {
            return formatDate(parseDate(entry.date).startOf(unit));
        };
        let groupedEntries = groupBy(entries, groupFunc);
        for (let date in groupedEntries) {
            trendingData[viewMode].x.push(moment.min(
                groupedEntries[date].map((entry) => {
                    return parseDate(entry.date);
                })
            ));
            trendingData[viewMode].y.push(
                global.log10(addDurations(groupedEntries[date]))
            );
        }
    }
    this.trendingChart.load({
        columns: (function() {
            let result = [];
            for (let viewMode in trendingData) {
                result.push(trendingData[viewMode].x, trendingData[viewMode].y);
            }
            return result;
        }())
    });
};



Template.EntriesGraphs.onCreated(function() {
    let projectId = FlowRouter.getParam("id");
    this.autorun(() => {
        this.subscribe("project", projectId);
    });
    this.projectCursor = Projects.find({
        _id: projectId
    });
    // convenience property for accessing the project data but always having the latest (reactive) data
    Object.defineProperty(this, "entries", {
        get: function() {
            return this.projectCursor.fetch()[0].entries.sort((a, b) => {
                a = global.parseDate(a.date);
                b = global.parseDate(b.date);
                if (a.isBefore(b)) {
                    return -1;
                }
                if (a.isAfter(b)) {
                    return 1;
                }
                return 0;
            });
        },
        set: function() {
            throw new Error("Can't set entries");
        }
    });
    this.viewModes = this.data.viewModes;
    this.aggregatedChart = null;
    this.trendingChart = null;
});

Template.EntriesGraphs.onRendered(function() {
    let viewModes = this.viewModes;
    let viewMode;
    let aggregatedData = [];
    let trendingData = {};
    let xs = {};
    let i;

    for (i = 0; i < viewModes.length; i++) {
        viewMode = viewModes[i];
        aggregatedData.push([AGGR_LABELS_BY_VIEW_MODE[viewMode]]);

        // prepare data for trending data
        if (viewMode !== "all") {
            let label = TREND_LABELS_BY_VIEW_MODE[viewMode];
            xs[label] = "x-" + label;
            trendingData[viewMode] = {
                x: [xs[label]],
                y: [label]
            };
        }
    }
    // init charts with bare data
    this.aggregatedChart = c3.generate($.extend(true, {}, GRAPH_CONFIG, {
        bindto: this.find(".aggregatedChart"),
        data: {
            columns: aggregatedData,
            type: "bar"
        }
    }));
    this.trendingChart = c3.generate($.extend(true, {}, GRAPH_CONFIG, {
        bindto: this.find(".trendingChart"),
        data: {
            xs: xs,
            xFormat: "%d.%m.%y",
            columns: (function() {
                let result = [];
                for (let viewMode in trendingData) {
                    result.push(trendingData[viewMode].x, trendingData[viewMode].y);
                }
                return result;
            }()),
            type: "line"
        },
        axis: {
            x: {
                type: "timeseries",
                tick: {
                    format: "%d.%m.%y"
                }
            }
        }
    }));
    loadGraphData.call(this);
});

Template.EntriesGraphs.helpers({
    numberOfEntries: function() {
        let template = Template.instance();
        let num = template.entries.length;
        setTimeout(function() {
            loadGraphData.call(template);
        }, 80);
        if (num !== 1) {
            return num + " entries";
        }
        return num + " entry";
    }
});

Template.EntriesGraphs.events({
    "mouseenter .c3": function(event, template) {
        let btn = template.$(".btn.download");
        let chart = template.$(event.currentTarget);
        if (chart.children(".btn.download").length === 0) {
            chart.append(btn);
        }
        btn.fadeIn(50);
    },
    "mouseleave .c3": function(event, template) {
        template.$(".btn.download").fadeOut(50);
    },
    "click .btn.download": function(event, template) {
        let btn = template.$(event.currentTarget);
        exportSvg(btn.closest(".c3").attr("id"), template.$("#exportHelper"));
    }
});
