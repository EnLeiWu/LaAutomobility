var mymap;
var fuelLevel;
var currentData;
let C = undefined;

window.onload = function() {
  document
    .getElementById("toggle-pulse-btn")
    .addEventListener("onclick", this.didPressToggleBtn, false);
};

function didPressToggleBtn() {
  console.log('did click')
  if (C == undefined) {
    setVariableRange(currentData)
  } else {
    mymap.removeLayer(C);
    C = undefined;
  }
}

gm.info.getCurrentPosition(processPosition, true); // defaults to detroit (42, -83)

function processPosition(position) {
  setMapPosition(34.04, -118.21); // coordinates for Los Angeles

  gm.info.getVehicleData(getFuelLevel, ["fuel_level"]);

  function getFuelLevel(data) {
    setVariableRange(data);
  }

  gm.info.watchVehicleData(watchVehicleData, failedToWatchVehicleData, [
    "fuel_level"
  ]);

  function watchVehicleData(data) {
    currentData = data;
    setVariableRange(data);
  }

  function failedToWatchVehicleData(err) {
    console.log("there was an error watching data" + err);
  }

  function setVariableRange(data) {
    //fuelEconomy varies according to vehicle
    let fuelEconomy = 100;

    // depending on the vehicle, the number of miles from a 100% charge will vary.
    let maximumMilesForVehicle = 200;

    let fuelPercentage = data.fuel_level / fuelEconomy;

    // miles left in the current charge
    let milesLeft = fuelPercentage * maximumMilesForVehicle;

    let colorWarning;

    if (fuelPercentage >= 0.6) {
      colorWarning = "green";
    } else if (fuelPercentage < 0.6 && fuelPercentage > 0.2) {
      colorWarning = "yellow";
    } else if (fuelPercentage <= 0.2) {
      colorWarning = "red";
    }

    // Battery div max width is 113px
    // 10% = 11.3px
    // 25% = 28.25px
    // 50% = 56.5px
    // 75% = 84.30px
    // 90% = 101.7px

    document.getElementById("battery-charge").style.width =
      fuelPercentage * 113 + "px";
    document.getElementById(
      "battery-charge"
    ).style.backgroundColor = colorWarning;
    document.getElementById("battery-percentage").textContent =
      data.fuel_level + "%";

    // circle radius is in meters
    // 1609 meters = 1 mile
    // assume 1% = 1 mile
    // therefore: fuelPercentage * 100 * 1609 = radius AND milesLeft * 1609 = radius

    if (C != undefined) {
      mymap.removeLayer(C);
    }

    C = L.circle([34.04, -118.21], {
      radius: milesLeft * 1609,
      color: colorWarning,
      fillColor: colorWarning,
      fillOpacity: 0.2
    });
    C.addTo(mymap);
  }
}

function setMapPosition(incomingLat, incomingLng) {
  mymap = L.map("mapid").setView([incomingLat, incomingLng], 12);

  L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
      maxZoom: 18,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox.streets"
    }
  ).addTo(mymap);
}

// L.marker([51.5, -0.09]).addTo(mymap)
//   .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

// L.circle([51.508, -0.11], 500, {
//   color: 'red',
//   fillColor: '#f03',
//   fillOpacity: 0.2
// }).addTo(mymap).bindPopup("I am a circle.");

// L.polygon([
//   [51.509, -0.08],
//   [51.503, -0.06],
//   [51.51, -0.047]
// ]).addTo(mymap).bindPopup("I am a polygon.");

// var popup = L.popup();

// function onMapClick(e) {
//   popup
//     .setLatLng(e.latlng)
//     .setContent("You clicked the map at " + e.latlng.toString())
//     .openOn(mymap);
// }

// mymap.on('click', onMapClick);
