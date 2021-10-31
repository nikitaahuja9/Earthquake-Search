let map;
let geocoder;
let service;

function initialize() {

    //Initialize the map
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 32.985771, lng: -96.750003 },
        zoom: 2,
    });

    //Initialize the geocoder - needed for getting coordinates
    geocoder = new google.maps.Geocoder();
}

window.onload = () => {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-10-01&endtime=2021-10-15&minmagnitude=5',

        success: function (data) {
            console.log(data);

            for (var i = 0; i < data.features.length; i++) {

                var lat_lng = new google.maps.LatLng(
                    parseFloat(data.features[i].geometry.coordinates[1]),
                    parseFloat(data.features[i].geometry.coordinates[0])
                );

                function getCircle(magnitude) {
                    return {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: "blue",
                        fillOpacity: 0.2,
                        scale: Math.pow(2, magnitude) / 2,
                        strokeColor: "white",
                        strokeWeight: 0.5
                    };
                }

                new google.maps.Marker({
                    map,
                    title: data.features[i].properties.title,
                    position: lat_lng,
                    icon: getCircle(data.features[i].properties.mag)
                });
            }

            document.getElementById("search").addEventListener("click", () => {
                let address_val = document.getElementById("address").value;
                geocoder.geocode({ address: address_val }, (results, status) => {
                    if (status == "OK") {

                        //Get (lat,long) values from the results
                        let coordinates = results[0].geometry.location;
                        map = new google.maps.Map(document.getElementById("map"), {
                            center: coordinates,
                            zoom: 5
                        });

                        map.setCenter(coordinates);

                        for (var i = 0; i < data.features.length; i++) {

                            let mapFind = data.features[i].properties.place.includes(address_val);

                            if (mapFind == true) {
                                var lat_lng = new google.maps.LatLng(
                                    parseFloat(data.features[i].geometry.coordinates[1]),
                                    parseFloat(data.features[i].geometry.coordinates[0])
                                );

                                function getCircle(magnitude) {
                                    return {
                                        path: google.maps.SymbolPath.CIRCLE,
                                        fillColor: "blue",
                                        fillOpacity: 0.2,
                                        scale: Math.pow(2, magnitude) / 2,
                                        strokeColor: "white",
                                        strokeWeight: 0.5
                                    };
                                }

                                new google.maps.Marker({
                                    map,
                                    title: data.features[i].properties.title,
                                    position: lat_lng,
                                    icon: getCircle(data.features[i].properties.mag)
                                });
                            }
                        }
                    }


                })
            });
        },
        error: function () {
            alert("error");
        }
    })
}