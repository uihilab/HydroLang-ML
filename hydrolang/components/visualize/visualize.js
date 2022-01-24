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
    createDiv({params: {
      id: params.divID,
      title: `Graph of ${params.divID}`,
      className: "charts",
      //style: "width: 1000px; height: 500px" 
    }})

    var container
    if(isdivAdded){
      container = document.getElementById(params.divID)
    }

    var d = data;
    var char = params.chartType;
    var dat;

    if (d[0][0] instanceof String) {
      for (var i =0; i < d.length; i++) {
        d[i][0].shift()
      }
    }

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
    createDiv({params:{
      id: params.divID,
      title: `Table of ${params.divID}`,
      className: "tables",
    }})

    var container
    if (isdivAdded) {
      container = document.getElementById(params.divID)
    }

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
 * @returns {Object} chart (graph, table, or json render) appended in body.
 */

function draw({params, args, data} = {}) {
  var dat = data
  var pm;
  var type = params.type;
  if (type !== "json") {
  dat[1] = dat[1].map(Number)
}

console.log(args)

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
  } else if (type === "json") {
    return prettyPrint({params: params, data: data})
  }
}

/**
 * Returns the a render space for json objects saved on local storage.
 * @function prettyPrint
 * @memberof visualize
 * @param {Object{}} params - parameters including type of input (single or all) and type of renderer.
 * @param {Object{}} data - data for running the renderer.
 * @returns {Promise} renders to screen the json object to render. 
 */

function prettyPrint({params, args, data}) {
  //Add div for rendering JSON

    if (!isdivAdded("jsonrender")) {
      createDiv({params : {id: "jsonrender", class: "jsonrender"}})
}

    //Using external library to render json on screen. Could be any type of json file.
    //Documentation + library found at: https://github.com/caldwell/renderjson
    var src = "https://cdn.rawgit.com/caldwell/renderjson/master/renderjson.js"

    var sc = createScript({params: {src: src}})
    sc.addEventListener('load', ()=>{
        //Change 
        renderjson.set_icons('+','-')
        renderjson.set_show_to_level(2)
        if (isdivAdded("jsonrender")) {
            var name
            if (window.localStorage.length === 0) {
                name = document.createTextNode("There are no items stored!")
                document.getElementById("jsonrender").appendChild(name)
            }
            if (params.input === "all") {
                for (var i =0; i < Object.keys(window.localStorage).length; i++) {
                    name = document.createTextNode(Object.keys(window.localStorage)[i])
                    document.getElementById("jsonrender").appendChild(name)
                    document.getElementById("jsonrender").appendChild(renderjson(JSON.parse(window.localStorage[Object.keys(window.localStorage)[i]])))
                }
            }
            else {
            name = document.createTextNode(params.input)
            document.getElementById("jsonrender").appendChild(name)
            document.getElementById("jsonrender").appendChild(renderjson(data))
    }
    }})}

/**
 * Module for visualization of charts and tables.
 * @module visualize
 */
export {
  draw,
  createDiv,
  createform,
  isdivAdded,
  isScriptAdded
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
};

/**
 * Creates a div space for rendering all sorts of imagery.
 * @function createDiv
 * @memberof visualize
 * @param {Object{}} params - arguments for creating div including divid and class
 * @returns {Promise} div space appended to DOM.
 */

function createDiv({params, args, data} = {}){
  var dv = document.createElement('div')
  dv.id = params.id
  dv.title = params.title
  dv.className = params.class
  dv.style = params.style
  document.body.appendChild(dv)
}

/**
 * Creates a form appended to the DOM with a button attached to it.
 * @function createform
 * @memberof visualize
 * @param {Object{}} params - parameters containing classes and names for renderer.
 * @returns {Promise} form appended to the DOM.
 */

function createform({params, args, data} = {}) {
  var fr = document.createElement('form')
  fr.className = params.class
  document.body.appendChild(fr)
}

/**
 * Creates 
 * @function createScript
 * @memberof visualize
 * @param {Object{}} params - parameter including the source of the script to be used. 
 * @returns {Promise} if found, returns the the script library to add listeners and handlers once loaded.
 */

function createScript({params, args, data} = {}) {
  //Add any external script into the DOM for external library usage.
  if (!isScriptAdded(params.src)) {
  var sr = document.createElement("script")
  sr.type = "text/javascript"
  sr.src = params.src
  document.head.appendChild(sr)
//If the user wants to add functionality coming from the script, do after.
} if (isScriptAdded(params.src)){
  var sc = document.querySelector(`script[src="${params.src}"]`)
  return sc
}
}

function isdivAdded(divid) {
  return Boolean(document.querySelector("."+divid))
}

function isScriptAdded(src) {
  return Boolean(document.querySelector(`script[src="${src}"`))
}

/**********************************/
/*** End of Supporting functions **/
/**********************************/