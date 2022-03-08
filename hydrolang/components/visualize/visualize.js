import stats from "../analyze/core/stats.js";

/**
 * Creates new charts depending on what the user requires. It can
 * generate scatter, histograms, columns, lines, timelines, etc.
 * It creates a new div space for each chart generated.
 * @function chart
 * @memberof visualize
 * @param {Object} params - contains: charType, divID, drawing options (see google charts docs).
 * @param {Object} data - contains: data as JS nd-array.
 * @returns {Element} chart appended to new div in body.
 * @example
 * hydro.visualize.chart({params: {chartType: 'column', divID: 'divID', options: {'some options'}}, data: [data1, data2,...]});
 */

function chart({ params, args, data } = {}) {
  //Create a new div for the visualize options.
  if (isdivAdded({ params: { divID: "visualize" } })) {
    //Google CDN stable library caller.
    var g = googleCdn();
    g[0].addEventListener("load", () => {
      google.charts
        .load("current", {
          packages: ["corechart", "table", "annotatedtimeline"],
        })
        .then(() => {
          createDiv({
            params: {
              id: params.divID,
              title: `Graph of ${params.divID}`,
              class: "charts",
              maindiv: document
                .getElementById("hydrolang")
                .getElementsByClassName("visualize")[0],
            },
          });
          //Creating a container to append the chart to.
          var container;
          if (isdivAdded) {
            container = document.getElementById(params.divID);
          }

          //Data read from the parameters passed by the user.
          var d = data;
          var char = params.chartType;
          var dat;

          //To avoid having to load the entire library, the optional JS evaluator is used
          //to read the requirements for drawing.
          var ch = eval(g[1][char]);
          var t1 = eval(g[2]["data"]);

          if (d[0][0] instanceof String) {
            for (var i = 0; i < d.length; i++) {
              d[i][0].shift();
            }
          }

          //Change the way of creating charts depending on the type of chart required.
          switch (char) {
            case "scatter":
              var dt;
              if (d[0].length !== 2) {
                dt = stats.arrchange({ data: d });
              } else {
                dt = d;
              }
              dat = google.visualization.arrayToDataTable(dt);
              break;

            case "column" || "combo":
              var dt;
              if (d[0].length !== 2) {
                dt = stats.arrchange({ data: d });
              } else {
                dt = d;
              }

              dat = google.visualization.arrayToDataTable(dt);
              break;

            case "histogram":
              var dt;
              if (d[0].length !== 2) {
                dt = stats.arrchange({ data: d });
              } else {
                dt = d;
              }

              dat = google.visualization.arrayToDataTable(dt);
              break;

            case "line" || "timeline":
              dat = new t1();

              d = stats.arrchange({ data: d });

              var temp = [];
              for (var k = 0; k < d[0].length; k++) {
                temp.push(`Value${k}`);
              }
              d.unshift(temp);

              for (var j = 0; j < d[0].length; j++) {
                dat.addColumn(typeof d[1][j], d[0][j]);
              }

              for (var i = 1; i < d.length; i++) {
                dat.addRow(d[i]);
              }

              break;

            default:
              break;
          }

          //Create figure in container.
          var fig = new ch(container);
          //Draw the chart.
          if (params.hasOwnProperty("options")) {
            var options = params.options;
            fig.draw(dat, options);
          } else {
            fig.draw(dat);
          }

          //Listener to add button for the chart to be downloaded once is ready.
          google.visualization.events.addListener(fig, "ready", function () {
            createDiv({
              params: {
                id: `${params.divID}_png`,
                maindiv: container,
              },
            });

            document.getElementById(
              `${params.divID}_png`
            ).outerHTML = `<a download="${
              params.divID
            }" href="${fig.getImageURI()}"><button>Download figure ${
              params.divID
            }</button></a>`;
          });
          //});
          return console.log(
            `Chart ${params.divID} is drawn based on given parameters`
          );
        });
    });
  }
}

/**
 * Generates a new table for the data given by the user.
 * @function table
 * @memberof visualize
 * @param {Object} params - contanis:  divID, dataType and applicable options.
 * @param {Object} data - contains: data
 * @returns {Element} table appended to new div in body.
 * @example
 * hydro.visualize.table({params: {divID: "new", dataType: ["string", "number"]}, data: [data1, data2...]});
 */
function table({ params, args, data } = {}) {
  //Verify if the visualize div has already been added into screen.
  if (isdivAdded({ params: { divID: "visualize" } })) {
    //Call the google charts CDN
    var g = googleCdn();
    g[0].addEventListener("load", () => {
      google.charts.load("current", { packages: ["table"] }).then(() => {
        createDiv({
          params: {
            id: params.divID,
            title: `Table of ${params.divID}`,
            class: "tables",
            maindiv: document
              .getElementById("hydrolang")
              .getElementsByClassName("visualize")[0],
          },
        });

        //Create container for table.
        var container;
        if (isdivAdded) {
          container = document.getElementById(params.divID);
        }

        //Call the data types required for table generation.
        var t1 = eval(g[2]["data"]);
        var t2 = eval(g[2]["view"]);
        var t3 = eval(g[2]["table"]);

        //Assign data into new variables for manipulation.
        var d = data;
        var types = params.datatype;
        var dat = new t1();
        var temp = [];

        for (var k = 0; k < types.length; k++) {
          dat.addColumn(types[k]);
        }
        var tr = stats.arrchange({ data: d });

        for (var l = 0; l < tr.length; l++) {
          temp.push(tr[l]);
        }

        dat.addRows(temp);

        var view = new t2(dat);
        var table = new t3(container);

        //Draw table.
        if (params.hasOwnProperty("options")) {
          var options = params.options;
          table.draw(view, options);
        } else {
          table.draw(view);
        }
        return console.log(
          `Table ${params.divID} drawn on the given parameters.`
        );
      });
    });
  }
}

/**
 * Preset styles for both charts and tables. The user can access by
 * passing parameters of data, type(chart or table).
 * @function draw
 * @memberof visualize
 * @param {Object} params - contains: type (chart, table, or json), name.
 * @param {Object} args - contains: charttype (column, scatter, line, timeline) only use if drawing charts.
 * @param {Object} data - contains: data as JS nd-array.
 * @returns {Element} chart (graph, table, or json render) appended in body.
 * @example
 * hydro.visualize.draw({params: {type: 'chart', name: 'someName'}, args: {charttype: 'column'}}, data: [data1, data2,...]});
 */

function draw({ params, args, data } = {}) {
  var dat = data;
  var pm;
  var type = params.type;
  if (type !== "json") {
    dat[1] = dat[1].map(Number);
  }

  //Chart drawing options.
  if (type === "chart") {
    var charts = args.charttype;
    switch (charts) {
      case "column":
        pm = {
          chartType: charts,
          divID: params.name,
          options: {
            title: params.name,
            titlePosition: "center",
            width: "100%",
            height: "100%",
            fontName: "monospace",
            legend: {
              position: "top",
            },
            bar: {
              groupWidth: "95%",
            },
            explorer: {
              actions: ["dragToZoom", "rightClickToReset"],
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
              orientation: "both",
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
            dateFormat: "HH:mm MMMM dd, yyyy",
            thickness: 1,
          },
        };
        break;

      default:
        break;
    }
    return chart({ params: pm, args: { maindiv: args.maindiv }, data: dat });
  }
  //Table options
  else if (type === "table") {
    var datatype = [];
    for (var i = 0; i < dat.length; i++) {
      datatype.push(typeof dat[0][i]);
    }
    //Customizable chart for two columns. Will be expanded to n columns.
    pm = {
      divID: params.name,
      datatype: datatype,
      options: {
        width: "50%",
        height: "60%",
      },
    };
    return table({ params: pm, data: dat });
  }
  //JSON options.
  else if (type === "json") {
    return prettyPrint({ params: params, data: data });
  }
}

/**
 * Returns a space in screen to visualize JSON formart objects saved in the local storage.
 * Will be expanded to visualize other types of data.
 * @function prettyPrint
 * @memberof visualize
 * @param {Object} params - contains: input (single or all objects), type (currently only JSON)
 * @param {Object} data - contains: data as JS Objects.
 * @returns {Element} renders to screen the json object to render.
 * @example
 * hydro.visualize.prettyPrint({params: {input: 'all', type: 'JSON'} data: {Objects}})
 */

function prettyPrint({ params, args, data } = {}) {
  //Add div for rendering JSON
  if (!isdivAdded({ params: { divID: "jsonrender" } })) {
    createDiv({
      params: {
        id: "jsonrender",
        class: "jsonrender",
        maindiv: document
          .getElementById("hydrolang")
          .getElementsByClassName("visualize")[0],
      },
    });
  }

  //Using external library to render json on screen. Could be any type of json file.
  //Documentation + library found at: https://github.com/caldwell/renderjson
  var src = "https://cdn.rawgit.com/caldwell/renderjson/master/renderjson.js";

  var sc = createScript({ params: { src: src, name: "jsonrender" } });
  sc.addEventListener("load", () => {
    //Change
    renderjson.set_icons("+", "-");
    renderjson.set_show_to_level(1);
    if (isdivAdded({ params: { divID: "jsonrender" } })) {
      var name;
      if (window.localStorage.length === 0) {
        return alert("No items stored!");
      }
      if (params.input === "all") {
        for (var i = 0; i < Object.keys(window.localStorage).length; i++) {
          name = document.createTextNode(Object.keys(window.localStorage)[i]);
          document.getElementById("jsonrender").appendChild(name);
          document
            .getElementById("jsonrender")
            .appendChild(
              renderjson(
                JSON.parse(
                  window.localStorage[Object.keys(window.localStorage)[i]]
                )
              )
            );
        }
      }
      if (!(params.input === "all")) {
        name = document.createTextNode(params.input);
        document.getElementById("jsonrender").appendChild(name);
        document.getElementById("jsonrender").appendChild(renderjson(data));
      }
    }
  });
}

/**
 * Module for visualization of charts and tables.
 * @module visualize
 */
export { draw, createDiv, createForm, isdivAdded, isScriptAdded };

/***************************/
/*** Supporting functions **/
/***************************/

/**
 * Creates a div space for rendering all sorts of required divisors.
 * @function createDiv
 * @memberof visualize
 * @param {Object} params - contains: id, title, class, style
 * @returns {Element} div space appended to DOM.
 * @example
 * hydro.visualize.createDiv({params: {id: 'someid', title: 'sometitle', className: 'someclass'}})
 */

function createDiv({ params, args, data } = {}) {
  var dv = document.createElement("div");
  dv.id = params.id;
  dv.title = params.title;
  dv.className = params.class;
  dv.style = params.style;
  params.maindiv.appendChild(dv);
}

/**
 * Creates a form appended to the DOM with a button attached to it.
 * @function createForm
 * @memberof visualize
 * @param {Object} params - contains: className (name of class to create for from)
 * @returns {Element} form appended to the DOM.
 * @example
 * hydro.visualize.createForm({params: {className: 'some class'}})
 */

function createForm({ params, args, data } = {}) {
  var fr = document.createElement("form");
  fr.className = params.class;
  document.body.appendChild(fr);
}

/**
 * Creates a script given a source, JS text and name to be appended to the header.
 * @function createScript
 * @memberof visualize
 * @param {Object} params - contains: name (script name), src (CDN source)
 * @returns {Element} if found, returns the the script library to add listeners and handlers once loaded.
 * @example
 * hydro.visualize.createScript({params: {name: "someName", src: "somrCDNurl"}})
 */

function createScript({ params, args, data } = {}) {
  //Add any external script into the DOM for external library usage.
  if (!isScriptAdded({ params: { name: params.name } })) {
    var sr = document.createElement("script");
    sr.type = "text/javascript";
    sr.src = params.src;
    sr.setAttribute("name", params.name);
    document.head.appendChild(sr);
    //If the user wants to add functionality coming from the script, do after.
  }
  if (isScriptAdded({ params: { name: params.name } })) {
    var sc = document.querySelector(`script[name=${params.name}]`);
    return sc;
  }
}

/**
 * Appends the google charts library to header for usage on charts and tables.
 * CDN currently stable but needs to be verified and updated if required.
 * @method googlecdn
 * @member visualize
 * @param {void} - no parameters required.
 * @returns {Element} - Google object loaded to header
 * @example
 * hydro.visualize.googleCdn()
 */

function googleCdn({ params, args, data } = {}) {
  var g = createScript({
    params: {
      src: "https://www.gstatic.com/charts/loader.js",
      name: "googleloader",
    },
  });
  //Charts loaded from the Google Charts API
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
  //Table element loaded from the Google Charts API
  var tableData = {
    data: "google.visualization.DataTable",
    view: "google.visualization.DataView",
    table: "google.visualization.Table",
  };
  //Returning the elements as accessible array with [0] - google element, [1] - chart loader [2] - table loader
  return [g, chartMap, tableData];
}

/**
 * Function for verifying if a div has already been added into the document.
 * @method isdivAdded
 * @memberof visualize
 * @param {Object} params - contains: divID (specific name for the divisor).
 * @returns {Boolean} True of a div with the given id is found in the document.
 * @example
 * hydro.visualize.isdivAdded({params: {divId: 'someDivName'}})
 */

function isdivAdded({ params, args, data } = {}) {
  return Boolean(document.querySelector("." + params.divID));
}

/**
 * Function for verifying if a script has been added to the header of the webpage.
 * @method isScriptAdded
 * @memberof visualize
 * @param {Object} params - contains: name (script on screen, or not)
 * @returns {Boolean} True if the script has been appended to the header.
 * @example
 * hydro.visualize.isScriptAdded ({params: {name: 'someName'}})
 */

function isScriptAdded({ params, args, data } = {}) {
  //Select a name passed as an attribute instead of source for selection purposes.
  return Boolean(document.querySelector(`script[name=${params.name}`));
}

/**********************************/
/*** End of Supporting functions **/
/**********************************/
