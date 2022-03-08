import * as mapsources from "../../modules/maps/mapsources.js";
import tileprov from "../../modules/maps/tileprov.js";
import _ from "../../modules/d3/d3.js";
import * as visualize from "../visualize/visualize.js"

//Controllers, map and layers
//Most variables are left as internal variables for control when the hydrolang instance is live.
var osmap;
var layercontroller;
var drawings;
var drawControl;

//Global variables for library usages.
window.baselayers = {};
window.overlayers = {};

/**
 * Calls the map type according to the user input. The renderMap function is required
 * for map visualization.
 * @function loader
 * @memberof maps
 * @param {Object} params - contains: maptype (google or osm[leaflet]) 
 * @param {Object} args: contains: key (required by google)
 * @returns {Element}  Libraries appended to the header of webpage.
 * @example 
 * hydro.map. = {maptype: "osm"}
 */

 async function loader({params, args, data} = {}) {
  //For google maps API.
  if (params.maptype == "google") {
    const gApiKey = args.key;
    //call the class  constructor.
    const gmapApi = new mapsources.googlemapsapi(gApiKey);
    await gmapApi.load();
  }

  //For leaflet API.
  if (params.maptype == "osm") {
    //call the class constructor.
    const mapper = new mapsources.leafletosmapi();
    await mapper.load();
  }
}


/**
 * Layer function for appending tiles, geodata, markers, kml or drawing tools to a map.
 * @function Layers
 * @memberof maps
 * @param {Object} config - description of the map type, layer type and data.
 * @returns {Object} layer appended to a map div that has already been created.
 */

async function Layers({params, args, data} = {}) {
  var layertype;
  //The mapconfig is set to be as OSM.
  var mapconfig = {maptype: "osm"};
  //Creating configuration object for rendering layers.
  //If a property is not found, is simply set to null.
  //Setting it up as default behavior.
// try{
//   console.log("right here")
var layertype = {
  type: args.type,
  markertype: args.type, 
  geotype: args.geo,
  data: data, 
  name:args.output, 
  coord: data,
}

  try{
  if (mapconfig.maptype === "google") {
  }
  //in case the map required is osm. 
  else if (mapconfig.maptype === "osm") {
    var layer;
    var type = layertype.type;
    var layername = layertype.name;

    if (typeof layercontroller === 'undefined') {
      //Defining the controller for the layers.
      layercontroller = new L.control.layers();}

    if (type === "tile") {
      //Defining a new layertype
      layer = new L.TileLayer(
        tileprov[layername].url,
        tileprov[layername].options
      );
      Object.assign(baselayers, {
        [layername]: layer
      })
      layercontroller.addBaseLayer(layer, layername).addTo(osmap);
    }
  }
      await osmap.whenReady(function(){
    if (type === "geodata") {
      //Caller for the geoJSON data renderer.
      layer = geoJSON({params: mapconfig, data: data});
      Object.assign(overlayers, {[layername]: layer})
      layercontroller.addOverlay(layer, layername).addTo(osmap);
      //osmap.fitBounds(layer.getBounds());

    } else if (type === "marker") {
      //Caller for the marker renderer.
      layer = addMarker({params: mapconfig, args: layertype});
      Object.assign(overlayers, {[layername]: layer})
      layercontroller.addOverlay(layer, layername).addTo(osmap);

    } else if (type === "kml") {
      //Caller for the KML data renderer.
      layer = kml({params: mapconfig, data: data});
      Object.assign(overlayers, {[layername]: layer})
      layercontroller.addOverlay(layer, layername).addTo(osmap);
      //osmap.fitBounds(layer.getBounds());

    } else if (type === "draw"){
      //Caller for drawing tool renderer.
      drawings = new L.FeatureGroup();
      draw({params: mapconfig});
      osmap.addLayer(mapdrawings);

    } else if (type === "removelayers") {
      //If using HydroLang-ML, there is no need to use this functions since the layers that are not to be included in a map
      //Are simply not added into the request as a layer.
      if (baselayers.hasOwnProperty(layername)) {
        osmap.removeLayer(baselayers[layername]);
        layercontroller.removeLayer(baselayers[layername]);
        delete baselayers[layername];

      } else if (overlayers.hasOwnProperty(layername)) {
        osmap.removeLayer(overlayers[layername]);
        layercontroller.removeLayer(overlayers[layername]);
        delete overlayers[layername];
        
      } else if (layername === "map") {
        osmap.remove();

      } else if (layername === "draw"){
        drawControl.remove()
      } else {
        alert("there is no layer with that name!");
      };
    }
  })
}
catch (error){
}
}

/**
 * Rendering function according to the map selected by the user.
 * It requires the library to be alraedy loaded to the header of the page.
 * @function renderMap
 * @memberof maps
 * @param {Object} config - The configuration file with maptype, lat, long
 * zoom.
 * @example // var mapconfig = {maptype: "osm", lat: "40", lon: "-100", zoom: "13", layertype: {type: "tile", name: "OpenStreetMap"}} //
 * @returns {Object} Attaches the required map to a div element on the html file.
 */

async function renderMap({params, args, data} = {}) {
  //Reading layer types and map configurations from the user's parameters inputs.
  var layertype
  var mapconfig = {
    maptype: args.maptype,
    lat: args.lat,
    lon: args.lon,
    zoom: 15,
  }

  //Defining a default scenario with zoom over at IFC.
  if(typeof mapconfig.maptype === 'undefined' || typeof mapconfig.maptype === null || !params) {
    layertype = {
      type: "tile",
      output: "OpenStreetMap"
    }

    mapconfig = {
      maptype: "osm",
      lat: 41.6572,
      lon: -91.5414,
      zoom: 13,
    };
}
  //Rendering the map into screen.
  await loader({params: mapconfig})

  //Creating internal divisors for the requested maps.
  visualize.createDiv({params: {
    id: "map",
    class: "maps",
    maindiv: document.getElementById('hydrolang').getElementsByClassName("maps")[0]
  }})

  //Allocating a container object where the map should be set.
  var container
  if (visualize.isdivAdded){
    container = document.getElementById("map")
  }

  //From here onwards, the the library caller renders either Google Maps or Leaflet Maps.
  if (mapconfig.maptype === "google") {
    const options = {
      mapTypeId: "terrain",
      zoom: mapconfig.zoom,
      center: {
        lat: mapconfig.lat,
        lng: mapconfig.lon,
      },
    };
    //append a new map to the map variable.
    osmap = new google.maps.Map(container, options);
  } else if (mapconfig.maptype === "osm") {
    osmap = new L.map(container.id);
    //assign the tile type to the data object for rendering.
    const tiletype = layertype.output;
    //Rendering the tile type the user has requested from the available tile types.
    if (tiletype === "tile" && !tileprov.hasOwnProperty(tiletype)) {
      console.log("No tile found!")
      return;
    }
    //import the tile options from the given data.
    osmap.setView([mapconfig.lat, mapconfig.lon], mapconfig.zoom);
    Layers({params: mapconfig, args: layertype});

    //Allow for popups to be prompted when touching the screen.
    var popup = new L.popup();
    var onMapClick = (e => {
      popup.setLatLng(e.latlng).setContent(`You clicked the map at ${e.latlng.toString()}`).openOn(osmap);
    })
    osmap.on('click', onMapClick)
};
    }

/**
 * Creates different types of markers depending on what is required.
 * The geotype should be of one single feature.
 * @function geoJSON
 * @memberof maps
 * @param {Object} data - Data type must be in standardized geoJSON formats available through OGM standards.
 * @returns {Object} geoJSON rendered file.
 */

function geoJSON({params, args, data} = {}) {
  var geotype
  if(data.type === "FeatureCollection"){
  geotype = data.features[0].geometry.type;
} else if (data.type === "Feature") {
  geotype = data.geometry.type;
}

  if (params.maptype === "google") {
    var geogoogle = osmap.data.addGeoJson(inf);
    return geogoogle;
  } else if (params.maptype === "osm") {

    var onEachFeature = (feature, layer) => {
      if (feature.properties && feature.properties.Name && feature.properties.Lat && feature.properties.Lon) {
        layer.bindPopup(feature.properties.Name + "(" + feature.properties.Lat + "," + feature.properties.Lon + ")", );
      }
    }
    var geopoint = () => {
      var style = {
        radius: 10,
        fillColor: "#2ce4f3",
        color: "#0dc1d3",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      };
      var xo = new L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          return new L.circleMarker(latlng, style)
        },
        onEachFeature: onEachFeature,
        style: style
      })
      return xo;
    };

    var geopoly = () => {
      var style = {
        weight: 2,
        color: "#432"
      };
      var xa = new L.geoJSON(data, {
        style: style,
        onEachFeature: onEachFeature
      })
      return xa;
    };
    if (geotype === "Point") {
      return geopoint();
    } else if (geotype === "Polygon") {
      return geopoly();
    }
  }
}

/**
 * Creates layer of kml data passed through an object to an
 * existing map. Notice that the map most be already created
 * for the method to be used.
 * @function kml
 * @memberof maps
 * @param {Object} data - data object with maptype and KML data.
 * @returns {Object} appends layer to existing map.
 */

function kml({params, args, data} = {}) {
  if (params.maptype == "google") {
    var kmlLayer = new google.maps.KmlLayer(data.kml, {
      suppressInfoWindows: true,
      preserveViewport: false,
      map: osmap,
    });
    kmlLayer.addListener("click", function (event) {
      var content = event.featureData.infoWindowHtml;
      var testimonial = document.getElementById("capture");
      testimonial.innerHTML = content;
    });
  } else if (params.maptype == "osm") {
    const parser = new DOMParser();
    const kml = parser.parseFromString(data.kml, "text/xml");
    const track = new L.KML(kml);
    return track;
  }
}

/**
 * Adds a new marker to the map, given coordinates, map type and marker type.
 * @function addMarker
 * @memberof maps
 * @param {Object} data - configuration with maptype, 
 * @returns {Object} layer object.
 */
function addMarker({params, args, data} = {}) {
  var layer;
  if (params.maptype === "google") {}

  if (params.maptype === "osm") {
    var type = args.markertype;
    var coord = args.coord;

    switch (type) {
      case "rectangle":
        layer = new L.rectangle(coord, markerstyles({params: {map:'osm', fig: 'rectangle'}}));
        break;
      case "circle":
        layer = new L.circle(coord, markerstyles({params: {map:'osm', fig: 'circle'}}));
        break;
      case "circlemarker":
        layer = new L.circleMarker(coord, markerstyles({params: {map:'osm', fig: 'circlemarker'}}));
        break;
      case "polyline":
        layer = new L.polyline(coord, markerstyles({params: {map:'osm', fig: 'polyline'}}));
        break;
      case "polygon":
        layer = new L.polygon(coord, markerstyles({params: {map:'osm', fig: 'polygon'}}));
        break;
      case "marker":
        layer = new L.marker(coord, markerstyles({params: {map:'osm', fig: 'marker'}}));
        break;
      default:
        alert("no markers with that name");
    }
  }
  return layer
}

/**
 * Creaes different styles for depending on the marker that has been selected for drawing.
 * @function markerstyles
 * @memberof maps
 * @param {string} map - map type: google or osm.
 * @param {string} fig - type of marker to be drawn.
 * @returns {Object} new styles that are used for drawing a marker.
 */

 function markerstyles ({params, args, data} = {}){
   var map = params.map;
   var fig = params.fig
  var layer;

  //Implementation for google markers still ongoing.
   if (map === "google") {
   }

   //Full implementation of the OpenStreetMap ready for usage.
   if (map === "osm") {
     switch (fig) {
       case "rectangle":
         layer = {
           weight: 2,
           color: "#e1e1100",
         }
         break;
       case "circle":
         layer = {
            radius: 200,
            fillColor: "#2ce4f3",
            color: "#0dc1d3",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
          }
          break;
        case "circlemarker":
          layer = {
              radius: 5,
              fillColor: "#2ce4f3",
              color: "#0dc1d3",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.6
            }
            break;
        case "polyline":
          layer = {
            weight: 1,
            color: '#432',
            opacity: 1
          }
          break;
        case "polygon":
          layer = {
            weight: 2,
            color: "#e1e1100",
            opacity: 1
          };
          break;
        case "marker":
          layer ={
            markerIcon: null,
            zIndexOffset: 2000,
          }
          break;
        default:
          break;
        }
      }
   return layer;
 }

 /**
  * @function draw
  * @memberof maps
  * @param {Object} config - configuration of the map.
  * @returns {Object} toolkit added to map.
  */

  function draw({params, args, data} = {}) {

    //Implementation of Google Maps API still ongoing.
    if (params.maptype == "google") {} 
    //Full implementation of OpenStreetMaps ready for usage.
    else if (params.maptype == "osm") {
      var options = {
        position: 'topleft',
        scale: true,
        draw: {
          polyline: {
            metric: true,
            shapeOptions: {
              color: '#bada55',
            }
          },
          polygon: {
            allowIntersection: false,
            metric: true,
            drawError: {
              color: '#e1e1100',
              message: '<strong> You cant do that!',
            },
            shapeOptions: {
              color: '#432'
            }
          },
          rectangle: {
            allowIntersection: false,
            metric: true,
            drawError: {
              color: '#e1e1100',
              message: '<strong> You cant do that!'
            },
            shapeOptions: {
              color: '#432'
            }
          },
          circle: {
            metric: true,
            feet: true,
            shapeOptions: {
              color: '#432'
            }
          },
          marker: {
            markerIcon: null,
            zIndexOffset: 2000
          }
        },
        edit: {
          featureGroup: drawings,
          remove: true
        }
      }

      //Defining a drawing control for the Leaflet library.
      drawControl = new L.Control.Draw(options);
      osmap.addControl(drawControl)

      //Event triggers added to clicking inside the maps through different types of markers and styles..
      osmap.on('draw:created', function (e) {
        var type = e.layerType,
            layer = e.layer;
        if (type === 'marker') {
          layer.on('click', function(){
            layer.bindPopup(`Marker coordinates: ${layer.getLatLng()}.`);
          })
        }
        else if(type === 'rectangle') {
        layer.on('click', function(){
          layer.bindPopup(`Rectangle corners coordinates: ${layer.getLatLngs()}.`)
          })
        }       
        else if (type === 'circle'){
          layer.on('click', function(){
            layer.bindPopup(`Circle coordinates: ${layer.getLatLng()} with radius: ${layer.getRadius()}.`)
          })
        }
        else if(type === 'polygon') {
          layer.on('click', function(){
            layer.bindPopup(`Polygon corners coordinates: ${layer.getLatLngs()} with area.`)
            })
          } 
        drawings.addLayer(layer)
      })
    }
  }

  /**
 * Module for mapping data.
 * @module maps
 */

export {
  loader,
  Layers,
  renderMap,
};