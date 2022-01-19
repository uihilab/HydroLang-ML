import * as datasources from "./datasources.js";
import $ from "../../modules/jquery/jquery.js";
import stats from "../analyze/core/stats.js";
import * as visualize from "../visualize/visualize.js"

/**
 * Main function to retrieve data. Requires a callback handler after data has been downloaded.
 * @function retrieve
 * @memberof data
 * @param {Object{}} params - Data parameter containing which source to use, the datatype from the source and type of data (CSV, XML, JSON).
 * @param {Object{}} args - Any arguments required for obtaining the data.
 * @returns {Object{}} res - Object with retrieved data.
 * @example 
 * hydro.
 */

async function retrieve({params,args, data} = {}) {
  //obtain data from parameters set by user.
  var source = params["source"];
  var dataType = params["datatype"];
  var args = args
  var type = params["type"];
  var result = []

  //verify if the data is contained within the hydrolang databases.
  if (!(datasources[source] && datasources[source].hasOwnProperty(dataType))) {
    callback({
      info: "No data has been found for given specifications.",
    });
    return;
  }

  //if source exists, then obtain the object from sources.
  var dataSource = datasources[source][dataType];
  var endpoint = dataSource["endpoint"];
  var met = datasources[source]["requirements"]["method"];

  //define proxy if required by the source
  var proxy = "";
  var proxif = datasources[source]["requirements"]["needProxy"];

  if (params.hasOwnProperty("proxyurl")) {
    proxy = params["proxyurl"];
  } else if (proxif == true) {
    callback({ info: "please verify if the resource needs a proxy server." });
  }

  //create headers if required depending on the type supported.
  var head = {};
  var keyname = "";

  //assign key or token to value in case it is required by the source.
  if (datasources[source]["requirements"].hasOwnProperty("keyname")) {
    keyname = datasources[source]["requirements"]["keyname"];
    if (params.hasOwnProperty(keyname)) {
      Object.assign(head, { [keyname]: params[keyname] });
    } else {
      callback({ info: "please verify the keyname of the source." });
    }
  }
  
  //retrieve the data and feed the data into callback.
  $.ajax({
    url: proxy + endpoint,
    data: args,
    type: type,
    method: met,
    headers: head,
    success: function (data, status, xhr) {
      //all keys from the obtained data will be lowecased previous to be saved.
      result.push(lowercasing(data))
      alert(`Data from ${source} has been succesfully downloaded from request.`);
    },
    error: function () {
      alert(`There was an error with the request. Please revise requirements.`)
      return
    },
  });
  return result
}

/**
 * Convert data types to one another.
 * @function transform
 * @memberof data
 * @param {Object{}} params - to be transformed as an object array.
 * @param {Object} config - transformation configuration
 * @returns {Object} Object in different formats with transformed data
 * @example
 * var data = {"temperature": "64"} as Object;
 * var config = {"type": "CSV", "keep": ["date", "value"]};
 * var dataCSV = transform(data, config);
 */

function transform({params, args, data} = {}) {
  if(params.save && args == undefined) {
    data = recursiveSearch({obj: data, searchkey: params.save})
    data = data[0]
  } else if (params.save && args.keep) {
    data = recursiveSearch({obj: data, searchkey: params.save})
    data = data[0]
    args.keep = JSON.parse(args.keep)
  }

  var type = args.type;
  var clean;

  //verify if the object is an object. Go to the following step.
  var arr = data.map((_arrayElement) => Object.assign({}, _arrayElement));
  arr = typeof arr != "object" ? JSON.parse(arr) : arr;

  if (args.hasOwnProperty("keep")) {
    clean = args["keep"];
  //values to be left on the object according to user, fed as array.
  var keep = new RegExp(clean.join("|"));
  for (var i = 0; i < arr.length; i++) {
    for (var k in arr[i]) {
      keep.test(k) || delete arr[i][k];
    }
  }
} if(!args.keep) {
  //if params dont have a keep array, continue.
  arr = arr;
}
  //convert array of objects into array of arrays for further manipulation.
  if (type === "ARR") {
    var arrays = arr.map(function (obj) {
      return Object.keys(obj)
        .sort()
        .map(function (key) {
          return obj[key];
        });
    });
    var final = Array(arrays[0].length)
      .fill(0)
      .map(() => Array(arrays.length).fill(0));
    for (var j = 0; j < arrays[0].length; j++) {
      for (var n = 0; n < arrays.length; n++) {
        final[j][n] = arrays[n][j];
      }
    }

    if(args.keep) {
    for (var j=0; j < final.length; j++){
      final[j].unshift(args.keep[j])
    }
  }
    return final;
  }

  // convert from JSON to CSV
  else if (type === "CSV") {
    if (data[0] instanceof Array) {
      arr = stats.arrchange({data: data})
    } else {arr = arr}
    var str = "";
    for (var i = 0; i < arr.length; i++) {
      var line = "";
      for (var index in arr[i]) {
        if (line != "") line += ",";

        line += `\"${arr[i][index]}\"`;
      }
      str += line + "\r\n";
    }
    return str;
  }

  //covert data from Object to JSON
  else if (type === "JSON") {
    var js = JSON.stringify(arr);
    return js;
  }

  //convert data from JSON to XML
  else if (type === "XML") {
    var xml = "";
    for (var prop in arr) {
      xml += arr[prop] instanceof Array ? "" : "<" + prop + ">";
      if (arr[prop] instanceof Array) {
        for (var array in arr[prop]) {
          xml += "<" + prop + ">";
          xml += transform({data: new Object(arr[prop], config)});
        }
      } else if (typeof arr[prop] == "object") {
        xml += transform({data: new Object(arr[prop], config)});
      } else {
        xml += arr[prop];
      }
      xml += arr[prop] instanceof Array ? "" : "</" + prop + ">";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, "");
    return xml;
  } else {
    throw new Error("Please select a supported data conversion type!");
  }
}

/**
 * data upload from the local storage of the user for analysis.
 * @function upload
 * @memberof data
 * @param {string} type - type of data to be uploaded (CSV, JSON).
 * @example var xo = hydro1.data.upload('CSV')
 */

function upload({params, args, data} = {}) {
  //Container for the uploading area
  visualize.createDiv({params:{
    id: "drop-area",
  }})

  //form for the uploading area
  var fr = document.createElement('form')
  fr.className = "upload-form"

  var cont1
  if(visualize.isdivAdded()){
    cont1 = document.getElementById("drop-area")
  }

  //create a new element to upload on header.
  var f = document.createElement("input");
  f.type = "file";
  f.id = "fileElem"
  f.accept = params.type;

  //create button label  
  var btn = document.createElement("LABEL")
  btn.className = "button"
  btn.htmlFor = "fileElem"
  btn.innerHTML = "Upload file here!"

  //Append all created elements to div
  fr.appendChild(f)
  cont1.appendChild(fr)
  cont1.appendChild(btn)

  //Preventing default drag behaviors
  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    cont1.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)
  })

  //Highlighting drop area when dragged over it
  ;['dragenter', 'dragover'].forEach(eventName => {
    cont1.addEventListener(eventName, highlight, false)
  })

  ;['dragleave', 'drop'].forEach(eventName => {
    cont1.addEventListener(eventName, unhighlight, false)
  })

  cont1.addEventListener('drop', selectors, false)

  var preventDefaults = ((e) => {e.preventDefault(); e.stopPropagation()})
  var highlight = ((e) => {cont1.classList.add('highlight')})
  var unhighlight = ((e) => {cont1.classList.remove('active')})


  var ret;

  //create a new type of object depending on the type selected by user.
  if (params.type === "CSV") {
    ret = [];
  } else if (params.type === "JSON") {
    ret = new Object();
  }

  //intialize the caller for obtaining the files.
  var selectors = () => {
    //create input file selector.
    f.onchange = (e) => {
      //select file by the user
      var file = e.target.files[0];

      //read the file
      var reader = new FileReader();

      //read as text file.
      reader.readAsBinaryString(file);

      //file reading started.
      reader.addEventListener("loadstart", () => {
        console.log("File is being read.");
      });

      //file reading failed
      reader.addEventListener("error", () => {
        alert("Error: Failed to read file.");
      });

      //file read progress
      reader.addEventListener("progress", (e) => {
        if (e.lengthComputable == true) {
          var percent = Math.floor((e.loaded / e.total) * 100);
          console.log(percent + "% read.");
          performance.now()
        }
      });

      //after the data has been loaded, change it to the required type.
      reader.onload = (readerEvent) => {
        var content = readerEvent.target.result;

        //conversion of the data from CSV to array.
        if (params.type === "CSV") {
          var alltext = content.split(/\r\n|\n/);
          var med = [];
          for (var i = 0; i < alltext.length; i++) {
            var data = alltext[i].split(",");
            var tarr = [];
            for (var j = 0; j < data.length; j++) {
              tarr.push(data[j].replace(/^"|"$/g,''));
            }
            med.push(tarr);
          }
          
          //map the objects from m x n to n x m
          const arraycol = (arr, n) => arr.map((x) => x[n]);

          //the uploaded data contains additional "". Remove them once for dates and twice for data.
          for (var j = 0; j < med[0].length; j++) {
            ret.push(arraycol(med, j));
          }

          ret[1] = stats.numerise({data: ret[1]});

          for (var k = 0; k < ret.length; k++) {
            ret[k].pop()
          };

          for (var j = 0; j < ret.length; j++) {ret[j] = stats.numerise({data: ret[j]})}

          //transfrom from JSON file to new JS Object.
        } else if (params.type === "JSON") {
          Object.assign(ret, JSON.parse(content));
        }
      };
    };
    //f.click();
  };
  return ret;
}

/**
 * Download files on different formats, depending on the formatted object. It extends the
 * the transform function to automatically transform the data.
 * @function download
 * @memberof data
 * @param {Object} data to be downloaded, pre processed using transform function.
 * @param {Object} download configuration
 * @returns {Object} downloaded data as link from HTML file.
 */

function download({params, args, data} = {}) {
  var type = params.type;
  var blob;
  var exportfilename = "";

  //if CSV is required to be download, call the transform function.
  if (type === "CSV") {
    var csv = this.transform({data: data, args: params});
    blob = new Blob([csv], {
      type: "text/csv; charset = utf-8;",
    });
    exportfilename = `${params.input}.csv`;

  //if JSON file is required. Similar as before. 
  } else if (type === "JSON") {
    var js = this.transform({data: data,args: params});
    blob = new Blob([js], {
      type: "text/json",
    });
    exportfilename = `${params.input}.json`;
  }

  //if XML file is required for loading. Needs improvement.

  /*else if (type === 'XML') {
		var xs = this.transform(data,config);
		blob = new Blob([xs], {type: 'text/xml'});
		exportfilename = 'export.xml';
	}; */

  /*if (config['convtype'] = 'CSV') {
    	if (config['options'].hasOwnProperty('headers')){
    		var head= config['options']['headers']
    		arr.unshift(head)
    	};
    */

  
  //after the data has been transformed, create a new download file and link. No name is given but "export".
  if (navigator.msSaveOrOpenBlob) {
    msSaveBlob(blob, exportfilename);
  } else {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = exportfilename;
    a.click();
    a.remove();
  }
}

  /***************************/
  /***** Helper functions ****/
  /***************************/

/**
 * Searches for an array with data passed as string.
 * @function recursiveSearch
 * @memberof data
 * @param {Object{}} obj - Object to find the results from.
 * @param {String} searchKey - Key to find inside the object.
 * @param {Object[]} results - default parameter used to save objects. 
 * @returns {Object[]} results - saved object from the search.
 * @example 
 * recursiveSearch({obj: {key1: "thisiskey", data: ["data1", "data2"]}, searchkey: 'data'}) 
 * returns ["data1", "data2"]
 */

 function recursiveSearch ({obj, searchkey, results = []} = {}) {
  const r = results;
  //if (!obj.hasOwnProperty(searchkey)) {return}
  Object.keys(obj).forEach(key => {
     const value = obj[key];
     if(key === searchkey && Array.isArray(value)){
        r.push(value);
        return;
     }else if(typeof value === 'object' && value !== null){
        recursiveSearch({obj: value, searchkey: searchkey, results: r});
     }
  });
  return r;
};

/**
 * Lowercases the keys in an object. Can be nested object with arrays or what not.
 * @function lowercasing
 * @memberof data
 * @param {Object{}} obj - Object keys to lowercase them. 
 * @returns {Object[]} obj - Copy of object with keys in lowercase.
 * @example 
 * lowercasing({NaMe: "myname", OtherName: "nextname"}) 
 * returns {name: "myname", othername: "nextname"}
 */
function lowercasing (obj) {
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(lowercasing)
  return Object.keys(obj).reduce((newObj, key) => {
    let val = obj[key];
    let newVal = (typeof val === 'object') && val !== null ? lowercasing(val) : val;
    newObj[key.toLowerCase()] = newVal;
    return newObj
  }, {})
};

  /**********************************/
  /*** End of Helper functions **/
  /**********************************/

/**
 * Module for dealing with data.
 * @module data
 * @exports data
 */
export { retrieve, transform, download, upload};
