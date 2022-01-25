/**
 * Imports external library Google Charts.
 * @external GoogleCharts
 */

import "./loader.js";
import * as visualize from "../../components/visualize/visualize.js"

google.charts.load("current", {
  packages: ["corechart", "table", "annotatedtimeline"],
});
google.charts.setOnLoadCallback(googlechartsLoaded);

var isGooglechartsLoaded = false;

function googlechartsLoaded() {
  isGooglechartsLoaded = true;
}

//export default google;
//export { isGooglechartsLoaded };
