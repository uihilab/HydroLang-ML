# HydroLang-ML
Web Components for Hydrological Analyzes

## Table of Contents
* [Introduction](https://github.com/uihilab/HydroLang-ML#Introduction)
* [How to Use](https://github.com/uihilab/HydroLang-ML#How-to-Use)
* [Test Examples](https://github.com/uihilab/HydroLang-ML#Test-Examples)
* [Community](https://github.com/uihilab/HydroLang-ML#Community)
* [Feedback](https://github.com/uihilab/HydroLang-ML#Feedback)
* [Scalability and To Do's](https://github.com/uihilab/HydroLang-ML#Scalability-and-To-Dos)
* [License](https://github.com/uihilab/HydroLang-ML#License)
* [Acknowledgements](https://github.com/uihilab/HydroLang-ML#Acknowledgements)
* [References](#references)

## Introduction
This project aimed to the development and implementation of web components using HydroLang.js. It enables the usage of the modules already developed within the framework using only markup language that enables the use of functions. It contains a modular component with the following scopes:
* **Data**: used for data retrieval, manipulation, download and upload.
* **Analyze**: contains three different components, each aiming towards a similar purpose:
    - *hydro*: functions for precipitation analysis and rainfall-runoff lumped models.
    - *stats*: functions for statistical characterization of data.
* **Visualization**: used for rendering different types of charts and tables on screen using [Google Charts](https://developers.google.com/chart).
* **Maps**: used for rendering of maps with option of adding/removing/downloading layers of different formats (geoJSON, KML) using two options on map engines [Google Maps](https://developers.google.com/maps/documentation) and [Leaflet](https://leafletjs.com/).

HydroLang-ML is using the last updated version of the [HydroLang.js](https://github.com/uihilab/HydroLang) framework.

## How to Use
Please download the library and run any of the provided examples, or create a new HTML file onloading the library on the header of the page as a script:
```html
<link rel="stylesheet" href="./modules/css/hydrolang.css" />
<script type = "module" src= "./hydrolang-ml/main.js"></script>
```
The library enables for the use of components as HTML tags that can access multiple types of parameters, depending on the type of function to be used. They must be wrapped around a div element that encapsulates the whole library.

```html
<body>
    <div id="hydrolang">
      <hydrolang-ml>
        <!--Components go here!-->
      </hydrolang-ml>
  </div>
</body>
```
Each component can be used using its corresponding tag notation. The components enable to use of Hydrolang's modular architecture to access the functions through passing properties into the components, each varying depending on the type of function needed to be accessed and must be wrapped inside the ```<hydrolang-ml></hydrolang-ml>``` tags.

Summary examples for each module:
* Function call for data module
```javascript 
var example: hydro1.data.function(args) 
```
* Function call for any component on the analyze module
```javascript 
var example: hydro1.analyze.component.function(args) 
```
* Function call for visualization module
```javascript 
var example: hydro1.visualize.function(args) 
```
* Function call for maps module
```javascript 
var example: hydro1.map.function(args) 
```
In order to the use, run the environment on a tool that can provide a live server, or 

## Test Examples
Examples on how to use the library can be found within the following files:
* `test-analysis.html`
* `test-data.html`
* `test-maps.html`
* `test-visualization.html`

For argument examples for a specific function, please refer to the library's [documentation page](https://hydro-lang.herokuapp.com/index.html).

## Community
The flexibility of using a modular architecture, open-source libraries, and not requiring installation provides a unique opportunity for scalability and upgrades, thus, creating the potential for the library to grow by becoming a community-based framework with collaborations from research institutions or individuals with expertise. HydroLang can be customized and extended by interested parties to suit for specific use cases, development environments, project requirements, and data resources. We encourage everyone to help extend HydroLang by either:
* filing an issue to request certain features, functionality, and data,
* implementing the desired capability on a fork, and submitting a pull request.

Furthermore, for community building, we encourage users of HydroLang to share their models, codes, and case studies on [HydroLang-Models repository](https://github.com/uihilab/HydroLang-Models).

## Feedback
Please feel free to send feedback to us on any issues found by filing an issue.

## Scalability and To-Do's
The framework is not limited to the functions and modules implemented, but rather provides a boilerplate for new features to be added. Nonetheless, the following should be considered:

* The hydro component contains only lumped models.
* The map module is fully available only on Leaflet engine.

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/uihilab/HydroLang/blob/master/LICENSE) file for details.

## Acknowledgements
This project is developed by the University of Iowa Hydroinformatics Lab (UIHI Lab):

https://hydroinformatics.uiowa.edu/.

## References

* Ramirez, C.E., Sermet, Y., Molkenthin, F. and Demir, I., 2021. HydroLang: An Open-Source Web-Based Programming Framework for Hydrological Sciences. https://doi.org/10.31223/X5M31D
