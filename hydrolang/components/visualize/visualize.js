//import googlecharts, {
//  isGooglechartsLoaded,
//} from "../../modules/googlecharts/googlecharts.js";
import stats from "../analyze/core/stats.js";

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
  if(isdivAdded('visualize')){
  //ensureGoogleChartsIsSet().then(function () {
    //var g = createScript({params: {src: "https://www.gstatic.com/charts/loader.js", name: "googleloader"}})
    var g = googlecdn()
    g[0].addEventListener('load', () => {
    google.charts.load('current', {packages: ['corechart', 'table', 'annotatedtimeline']}).then(() =>{
    createDiv({params: {
      id: params.divID,
      title: `Graph of ${params.divID}`,
      class: "charts",
      maindiv: document.getElementById('hydrolang').getElementsByClassName("visualize")[0]
    }})


    var container
    if(isdivAdded){
      container = document.getElementById(params.divID)
    }

    var d = data;
    var char = params.chartType;
    var dat;

    var ch = eval(g[1][char])
    var t1 = eval(g[2]["data"])

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

        ///
        ///dat = googlecharts.visualization.arrayToDataTable(dt);
        dat = google.visualization.arrayToDataTable(dt);
        break;

      case "column":
        var dt;
        if (d[0].length !== 2) {
          dt = stats.arrchange({data: d});
        } else {
          dt = d
        }

        dat = google.visualization.arrayToDataTable(dt);
        //dat = googlecharts.visualization.arrayToDataTable(dt);
        break;


      case "histogram":
        var dt;
        if (d[0].length !== 2) {
          dt = stats.arrchange({data: d});
        } else {
          dt = d
        }

        dat = google.visualization.arrayToDataTable(dt);
        //dat = googlecharts.visualization.arrayToDataTable(dt);
        break;

      case ("line" || "timeline"):
        dat = new t1  
      //dat = new g[2].data();

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

    var fig = new ch(container);

    if (params.hasOwnProperty("options")) {
      var options = params.options;
      fig.draw(dat, options);
    } else {
      fig.draw(dat);
    }


    if (params.hasOwnProperty("savechart")) {
      google.visualization.events.addListener(
        fig,
        "ready",
        function () {
          container.innerHTML = '<img src="' + fig.getImageURI() + ' ">';
          console.log(container.innerHTML)
        }
      );
    }
  //});
  return console.log("A chart is drawn based on given parameters");
})})}}

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
  if(isdivAdded('visualize')){
  //ensureGoogleChartsIsSet().then(function () {
    var g = googlecdn()
    g[0].addEventListener('load', () => {
    google.charts.load('current', {packages: ['table']}).then(() =>{
    createDiv({params:{
      id: params.divID,
      title: `Table of ${params.divID}`,
      className: "tables",
      maindiv: document.getElementById('hydrolang').getElementsByClassName("visualize")[0]
    }})

    var container
    if (isdivAdded) {
      container = document.getElementById(params.divID)
    }
    var t1 = eval(g[2]["data"])
    var t2 = eval(g[2]["view"])
    var t3 = eval(g[2]["table"])


    var d = data;
    var types = params.datatype;
    var dat = new t1
    //var dat = new tableData.data();
    var temp = [];

    console.log(params)
    console.log(d)

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

    var view = new t2(dat);
    var table = new t3(container);

    if (params.hasOwnProperty("options")) {
      var options = params.options;
      table.draw(view, options);
    } else {
      table.draw(view);
    }
  //});
  return "table drawn on the given parameters.";
    })
  })
}}

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
  console.log(params)
  if (type !== "json") {
  dat[1] = dat[1].map(Number)
}
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
    return chart({params: pm, args:{maindiv: args.maindiv}, data: dat});
  } else if (type === "table") {
    //Customizable chart for two columns. Will be expanded to n columns.
    pm = {
      divID: params.name,
      datatype: ["number", "number"],
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
      createDiv({params : {id: "jsonrender", class: "jsonrender",
      maindiv: document.getElementById('hydrolang').getElementsByClassName("visualize")[0]
    }})
}

    //Using external library to render json on screen. Could be any type of json file.
    //Documentation + library found at: https://github.com/caldwell/renderjson
    var src = "https://cdn.rawgit.com/caldwell/renderjson/master/renderjson.js"

    var sc = createScript({params: {src: src, name: "jsonrender"}})
    sc.addEventListener('load', ()=>{
        //Change 
        renderjson.set_icons('+','-')
        renderjson.set_show_to_level(1)
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
  params.maindiv.appendChild(dv)
  
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
 * Creates a script given a source, javascript text and name to be appended to the header.
 * @function createScript
 * @memberof visualize
 * @param {Object{}} params - parameter including the source of the script to be used. 
 * @returns {Promise} if found, returns the the script library to add listeners and handlers once loaded.
 */

function createScript({params, args, data} = {}) {
  //Add any external script into the DOM for external library usage.
  if (!isScriptAdded(params.name)) {
  var sr = document.createElement("script")
  sr.type = "text/javascript"
  sr.src = params.src
  sr.text = params.text
  sr.setAttribute('name', params.name)
  document.head.appendChild(sr)
//If the user wants to add functionality coming from the script, do after.
} if (isScriptAdded(params.name)){
  var sc = document.querySelector(`script[name=${params.name}]`)
  return sc
}
}

/**
 * Appends the google charts library to screen, returning the google object for further manipulation.
 * @method googlecdn
 * @member visualize
 * @param {void} - no parameters required.
 * @returns {Promise} - Google object loaded to screen
 */

function googlecdn({params, args, data} = {}) {
  var g = createScript({params: {src: "https://www.gstatic.com/charts/loader.js", name: "googleloader"}})
  var chartMap = {
    bar: "google.visualization.BarChart",
    pie: "google.visualization.PieChart",
    line: "google.visualization.LineChart",
    scatter: "google.visualization.ScatterChart",
    histogram: "google.visualization.Histogram",
    timeline: "google.visualization.AnnotatedTimeLine",
    column: "google.visualization.ColumnChart",
    combo: "google.visualization.ComboChart",
  };
  var tableData = {
    data: "google.visualization.DataTable",
    view: "google.visualization.DataView",
    table: "google.visualization.Table",
  };
  return [g, chartMap, tableData]
}

/**
 * Function for verifying if a div has already been added into the document.
 * @method isdivAdded
 * @memberof visualize
 * @param {String} divid - id given to a specific div. 
 * @returns {Promise} True of a div with the given id is found in the document.
 */

function isdivAdded(divid) {
  return Boolean(document.querySelector("."+divid))
}

/**
 * Function for verifying if a script has been added to the header of the webpage.
 * @method isScriptAdded
 * @memberof visualize
 * @param {String} name - name of the script added, read as an attribute. 
 * @returns {Boolean} - true if the script has been appended to the header.
 */

function isScriptAdded(name) {
  //Select a name passed as an attribute instead of source for selection purposes.
  return Boolean(document.querySelector(`script[name=${name}`))
}

/**********************************/
/*** End of Supporting functions **/
/**********************************/