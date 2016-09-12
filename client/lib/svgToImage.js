// http://stackoverflow.com/questions/37701361/exporting-c3-js-line-charts-to-png-images-does-not-work
global.exportSvg = function(chartId, img) {
    let svg = $("#" + chartId).find("svg").get(0);

    let nodeList = svg.querySelectorAll(".c3-chart path");
    let nodeList2 = svg.querySelectorAll(".c3-axis path");
    let nodeList3 = svg.querySelectorAll(".c3 line");
    let line_graph = Array.from(nodeList);
    let x_and_y = Array.from(nodeList2).concat(Array.from(nodeList3));

    line_graph.forEach(function(element) {
        element.style.fill = "none";
    });

    x_and_y.forEach(function(element) {
        element.style.fill = "none";
        element.style.stroke = "black";
    });

    // let img = document.getElementById("fromcanvas");
    svg.toDataURL("image/png", {
        callback: function(dataUrl) {
            console.log(dataUrl, img);
            img.src = dataUrl;
            img.onload = function() {
                console.log(this.src);
                // save
            };
        },
        renderer: "canvg"
    });
};
