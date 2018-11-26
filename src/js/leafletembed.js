
    

        var mymap;
        var fuelLevel;
        var myLat;
        var myLng;
        
        gm.info.getCurrentPosition(processPosition, true)

        function processPosition(position){
            var myLat = position.coords.latitude;
            var myLng = position.coords.longitude;

            setMapPosition(myLat, myLng);


            gm.info.getVehicleData(getFuelLevel, ['fuel_level']);

          
            function getFuelLevel(data) {           
            setVariableRange(data);
            }
    
            function setVariableRange(fuelLevel) {
                //fuelEconomy varies according to vehicle
                let fuelEconomy = 100;
                let fuelPercentage = fuelLevel.fuel_level;
                let range = fuelLevel.fuel_level * fuelEconomy;
                let colorWarning;


                if (fuelPercentage > 60) {
                    colorWarning = 'blue'
                } else if (fuelPercentage < 60 && fuelPercentage > 20) {
                    colorWarning = 'yellow'
                } else if (fuelPercentage < 20) {
                    colorWarning = 'red'
                }

                //there is probably a problem with resolution
                //causing this circle to be offcenter
                // L.circle([myLat+.04, myLng-.08], {radius:range}, {
                //     color: 'red',
                //     fillColor: 'red',
                //     fillOpacity: 0.2
                //   }).addTo(mymap).bindPopup("I am a circle.");

                L.circle([myLat+.04, myLng-.08], range, {
                color: colorWarning,
                fillColor: colorWarning,
                fillOpacity: 0.2
                }).addTo(mymap).bindPopup("I am a circle.");
  
            }
        }



      
     
        function setMapPosition(incomingLat, incomingLng) {
        mymap = L.map('mapid').setView([incomingLat, incomingLng], 12);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
              '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
              'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox.streets'
          }).addTo(mymap);

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
    