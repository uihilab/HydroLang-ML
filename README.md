<p align="center">
    <img width="200" src = https://github.com/uihilab/HydroLang-ML/blob/devo/figures/logo_200x200.png>
</p>

# Markup Language for Environmental Analyzes (HL-ML): Web Components for Hydrological and Environmental Sciences
## Table of Contents
* [Introduction](https://github.com/uihilab/HydroLang-ML#Introduction)
* [How to Use](https://github.com/uihilab/HydroLang-ML#How-to-Use)
* [Test Examples](https://github.com/uihilab/HydroLang-ML#Test-Examples)
* [Demo](https://github.com/uihilab/HydroLang-ML#Demo)
* [Community](https://github.com/uihilab/HydroLang-ML#Community)
* [Feedback](https://github.com/uihilab/HydroLang-ML#Feedback)
* [License](https://github.com/uihilab/HydroLang-ML#License)
* [Acknowledgements](https://github.com/uihilab/HydroLang-ML#Acknowledgements)
* [References](#references)

## Introduction
This project aimed to the development and implementation of markup language usage for hydrological sciences using web components. It enables the usage of the modules already developed within the HydroLang.js framework using simple and semantic markup language that enables the use of complex functions. The developed library  contains modular components that enables the following:
* **Data**: used for data retrieval, manipulation, download and upload.
* **Analyze**: contains three different components, each aiming towards a similar purpose:
    - *hydro*: functions for precipitation analysis and rainfall-runoff lumped models.
    - *stats*: functions for statistical characterization of data.
* **Visualization**: used for rendering different types of charts and tables on screen using [Google Charts](https://developers.google.com/chart).
* **Maps**: used for rendering of maps with option of adding/removing/downloading layers of different formats (geoJSON, KML) using two options on map engines [Google Maps](https://developers.google.com/maps/documentation) and [Leaflet](https://leafletjs.com/).

HydroLang-ML is using the last version of the [HydroLang.js](https://github.com/uihilab/HydroLang) framework as a main engine.

## How to Use
Please download the library and run any of the provided examples, or create a new HTML file onloading the library on the header of the page as a script:

```html
<link rel="stylesheet" href="../lib/libraries/hydrolang/external/css/hydrolang.css"/>
<script type="module" src="../lib/main.js"></script>
```
The library enables for the use of components as HTML tags that can access most of the functions in the framework following the parameter, argument, data ontology of the framework. They must be wrapped around a div element that encapsulates the whole library.

```html
<body>
    <div id="hydrolang">
      <hydrolang-ml>
        <!--Components go here!-->
      </hydrolang-ml>
  </div>
</body>
```

Each component can be used using its corresponding tag notation. The components enable the use of Hydrolang's modular architecture to access the functions through passing properties into the components, each varying depending on the type of functions needed to be accessed, wrapped inside the ```<hydrolang-ml></hydrolang-ml>``` tags.

Summary of function call for a module (the "-here" separation not required):
```html 
<hydrolang-ml>
    <analyze-mod method="someFunctionName">
        <parameters-here someAtrr="Some Attribute"></parameters-here>
        <arguments-here somArgs="someArguments"></arguments-here>
        <dataset-here>[1,2,3,4]</dataset-here>
    </analyze-mod>
</hydrolang-ml>
```
The usage of ```<dataset></dataset>``` tags is only required whenever a user wants to pass data as an input. For example, if a user has already downloaded data from  a USGS source and is saved in the local storage and would like to transform the data into a JS array, then the following code would work:

```html
<data-mod method="transform">
    <parameters-here input="usgs_data" save="value" output="cleaned_usgs_data1" ></parameters-here>
    <arguments-here type="ARR" keep='["datetime", "value"]'></arguments-here>
</data-mod>
```
The ```input``` tag is used to call data saved in the local storage. To visualize all the objects currently available in the local storage, the user would use the following components:

```html
<visualize-mod method="draw">
    <parameters-here type="json" input="usgs_data"></parameters-here>
</visualize-mod>
```
To use the library, a live server is required. If using VSCode, live server would allow for automatic refresh when putting the HTML tags into screen.

## Test Examples
Specific examples on  each module usage as well as crosses between functionalities can be found in the following links:
* [Analyze](https://github.com/uihilab/HydroLang-ML/blob/devo/examples/analyzexample.html)
* [Data](https://github.com/uihilab/HydroLang-ML/blob/devo/examples/dataexample.html)
* [Map](https://github.com/uihilab/HydroLang-ML/blob/devo/examples/mapexample.html)
* [Visualize](https://github.com/uihilab/HydroLang-ML/blob/devo/examples/visualizexample.html)

The documentation for the steering functions, arguments, and more examples on usage can be found i nthe [documentation page](https://hydrolang-ml.herokuapp.com/). To see the function requirements needed from HydroLang's modules, please [visit the documentation](https://hydro-lang.herokuapp.com/index.html) of the framework.

## Demo
![Demo](https://github.com/uihilab/HydroLang-ML/blob/devo/figures/Animation.gif)

## Community
HL-ML is part of the bigger picture created by HydroLang.js. It is a scalable, reusable, and easily adaptable framework that allows for growth through community-based collaboration from research institutions and individuals with expertise. The modules contained in HL-ML were built to create hands-on experience on hydrological research and its ease of implementation allows for new modules to be added as the HydroLang modules grow. We encourage the users to create new modules for HydroLang following the guidelines established in the framework, and of course:
* filing an issue to request certain features, functionality, and data,
* implementing the desired capability on a fork, and submitting a pull request.

Furthermore, for community building, we encourage users of HydroLang to share their models, codes, and case studies on [HydroLang-Models repository](https://github.com/uihilab/HydroLang-Models).

## Feedback
Please feel free to send feedback to us on any issues found by filing an issue.

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/uihilab/HydroLang/blob/master/LICENSE) file for details.

## Acknowledgements
This project is developed by the University of Iowa Hydroinformatics Lab (UIHI Lab):

https://hydroinformatics.uiowa.edu/

## References

* Ramirez, C.E., Sermet, Y., Molkenthin, F. and Demir, I., 2021. HydroLang: An Open-Source Web-Based Programming Framework for Hydrological Sciences. https://doi.org/10.31223/X5M31D
* More references to go here
