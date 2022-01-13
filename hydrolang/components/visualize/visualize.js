import googlecharts, {
  isGooglechartsLoaded,
} from "../../modules/googlecharts/googlecharts.js";
import stats from "../analyze/core/stats.js";

// Chart types of Google Charts
var chartMap;
var tableData;

/**
 * Creates new charts depending on what the user requires. It can
 * generate scatter, histograms, columns, lines, timelines, etc.
 * It also generates new div per every chart generated.
 * @function chart
 * @memberof visualize
 * @param {Object} params - requires: charType, data, divID, applicable options.
 * @returns {Object} chart appended to new div in body.
 * @example
 * hydro1.visualize.chart({chartType: 'column', data: x, divID: "new"});
 */

function chart({params, args, data} = {}) {
  ensureGoogleChartsIsSet().then(function () {
    var container = document.createElement("div");
    container.id = params.divID;
    container.title = `Graph of ${container.id}`;
    container.className = "chart";
    container.style = "width: 1000px; height: 500px";
    document.body.appendChild(container);

    var d = data;
    var char = params.chartType;
    var dat;

    switch (char) {
      case "scatter":
        var dt;
        if (d[0].length !== 2) {
          dt = stats.arrchange({data: d});
        } else {
          dt = d
        }

        dat = googlecharts.visualization.arrayToDataTable(dt);
        break;

      case "column":
        var dt;
        if (d[0].length !== 2) {
          dt = stats.arrchange({data: d});
        } else {
          dt = d
        }

        dat = googlecharts.visualization.arrayToDataTable(dt);
        break;


      case "histogram":
        var dt;
        if (d[0].length !== 2) {
          dt = stats.arrchange({data: d});
        } else {
          dt = d
        }

        dat = googlecharts.visualization.arrayToDataTable(dt);
        break;

      case ("line" || "timeline"):
        dat = new tableData.data();

        if (typeof d[0][1] === 'string') {
          dat.addColumn("date", d[0][0]);
          dat.addColumn("number", d[1][0]);

          for (var i = 1; i < d[0].length; i++) {
            dat.addRow([new Date(Date.parse(d[0][i])), d[1][i]]);
          }
        } else {
          dat.addColumn("number", d[0][0]);
          dat.addColumn("number", d[1][0]);

          for (var i = 1; i < d[0].length; i++) {
            dat.addRow([d[0][i], d[1][i]]);
          }
        }
        break;

      default:
        break;
    }

    var fig = new chartMap[char](container);

    if (params.hasOwnProperty("options")) {
      var options = params.options;
      fig.draw(dat, options);
    } else {
      fig.draw(dat);
    }


    if (params.hasOwnProperty("savechart")) {
      googlecharts.visualization.events.addListener(
        fig,
        "ready",
        function () {
          container.innerHTML = '<img src="' + fig.getImageURI() + ' ">';
          console.log(container.innerHTML)
        }
      );
    }
  });
  return console.log("A chart is drawn based on given parameters");
}

/**
 * Generates a new table depending on the data provided by the user.
 * @function table
 * @memberof visualize
 * @param {Object} params - requires data, divID, dataType and applicable options.
 * @returns {Object} table appended to new div in body.
 * @example
 * hydro1.visualize.table({data: x, divID: "new", dataType: ["string", "number"]});
 */
function table({params, args, data} = {}) {
  ensureGoogleChartsIsSet().then(function () {
    var container = document.createElement("div");
    container.id = params.divID;
    container.className = "table"
    container.title = `Table of ${container.id}`;
    document.body.appendChild(container);

    var d = data;
    var types = params.dataType;
    var dat = new tableData.data();
    var temp = [];

    for (var k = 0; k < d[0].length; k++) {
      dat.addColumn(types[k], d[0][k]);
    }

    for (var i = 0; i < d[1].length; i++) {
      if (typeof temp[i] == "undefined") {
        temp[i] = [];
      }
      for (var l = 0; l < d[1][0].length; l++) {
        temp[i][l] = d[1][i][l];
      }
    }

    dat.addRows(temp);

    var view = new tableData.view(dat);
    var table = new tableData.table(container);

    if (params.hasOwnProperty("options")) {
      var options = params.options;
      table.draw(view, options);
    } else {
      table.draw(view);
    }
  });
  return "table drawn on the given parameters.";
}

/**
 * preset styles for both charts and tables. The user can access by
 * passing parameters of data, type(chart or table), char
 * @function draw
 * @memberof visualize
 * @param {Object} params - overall parameters: data, draw, type.
 * @returns {Object} chart (graph or table) appended in body.
 */

function draw({params, args, data} = {}) {
  var dat = data
  dat[1] = dat[1].map(Number)

  var pm;
  var type = params.type;

  if (type === "chart") {
    if (dat.length == 2) {
      dat[0].unshift('Duration')
      dat[1].unshift('Amount')
    }

    var charts = args.charttype;
    switch (charts) {
      case "column":
        pm = {
          chartType: charts,
          divID: params.name,
          options: {
            title: params.name,
            titlePosition: 'center',
            width: "100%",
            height: "100%",
            fontName: "monospace", 
            legend: {
              position: "top"
            },
            bar: {
              groupWidth: "95%"
            },
            explorer: {
              actions: ["dragToZoom", "rightClickToReset"]
            },
          },
        };
        break;

      case "line":
        pm = {
          chartType: charts,
          divID: params.name,
          options: {
            title: params.name,
            fontName: "monospace",
            curveType: "function",
            lineWidth: 2,
            explorer: {
              actions: ["dragToZoom", "rightClickToReset"],
            },
            legend: {
              position: "bottom",
            },
            style: {
              height: 500,
              width: 900,
            },
          },
        };
        break;

      case "scatter":
        pm = {
          chartType: charts,
          divID: params.name,
          options: {
            title: params.name,
            fontName: "monospace",
            legend: {
              position: "bottom",
            },
            crosshair: {
              tigger: "both",
              orientation: "both"
            },
            trendlines: {
              0: {
                type: "polynomial",
                degree: 3,
                visibleInLegend: true,
              },
            },
          },
        };
        break;

      case "timeline":
        pm = {
          chartType: charts,
          divID: params.name,
          fontName: "monospace",
          options: {
            dateFormat: 'HH:mm MMMM dd, yyyy',
            thickness: 1
          },
        }
        break;

      default:
        break;
    }
    return chart({params: pm, data: dat});
  } else if (type === "table") {
    pm = {
      divID: params.name,
      dataType: ["string", "number"],
      options: {
        width: "50%",
        height: "60%",
      },
    };
    return table({params: pm, data: dat});
  }
}

/**
 * Module for visualization of charts and tables.
 * @module visualize
 */
export {
  chart,
  table,
  draw
};

/***************************/
/*** Supporting functions **/
/***************************/

/**
 * function to call google charts.
 * @function ensureGoogleChartsIsSet
 * @memberof visualize
 * @returns {Promise} calls on the google charts library and assures that is loaded. 
 */
function ensureGoogleChartsIsSet() {
  return new Promise(function (resolve, reject) {
    (function waitForGoogle() {
      if (isGooglechartsLoaded) {
        chartMap = {
          bar: googlecharts.visualization.BarChart,
          pie: googlecharts.visualization.PieChart,
          line: googlecharts.visualization.LineChart,
          scatter: googlecharts.visualization.ScatterChart,
          histogram: googlecharts.visualization.Histogram,
          timeline: googlecharts.visualization.AnnotatedTimeLine,
          column: googlecharts.visualization.ColumnChart,
          combo: googlecharts.visualization.ComboChart,
          // ...
        };
        tableData = {
          data: googlecharts.visualization.DataTable,
          view: googlecharts.visualization.DataView,
          table: googlecharts.visualization.Table,
          //..
        };
        return resolve();
      }
      setTimeout(waitForGoogle, 30);
    })();
  });
}

/**********************************/
/*** End of Supporting functions **/
/**********************************/