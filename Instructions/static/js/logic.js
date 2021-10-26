var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map", {
    center: [40.76078, -111.89105],
    zoom: 5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

function markerFillColor(depth) {
  switch (true) {
    case depth > 90:
      return "#FF0D0D";
    case depth > 70:
      return "#FF4E11";
    case depth > 50:
      return "#FF8E15";
    case depth > 30:
      return "#FAB733";
    case depth > 10:
      return "#ACB334";
    default:
      return "#69B34C";
  }
};

d3.json(queryUrl).then(function(data) {
    L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return new L.circleMarker(latlng, {
                radius: feature.properties.mag * 5,
                fillColor: markerFillColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.5,
                weight: 1
            }).addTo(myMap);
        }
    });
});

function onEachFeature(feature, layer) {
  var format = d3.timeFormat("%d-%b-%Y at %H:%M");
  var popupText = (layer.bindPopup("<h5>" + feature.properties.place + "</h5>" + "<hr>" + "<h6>" + "Date & Time: " + (format(new Date(feature.properties.time))) + "</h6>" + "<h6>" + "Magnitude: " + feature.properties.mag + "</h6>" + "<h6>" + "Depth: " + feature.geometry.coordinates[2] + "</h6>"
  )).addTo(myMap)
};

var legend = L.control({position: "bottomright"});
legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = ["#69B34C", "#ACB334", "#FAB733", "#FF8E15", "#FF4E11", "#FF0D0D"]
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style = \"width: 10px ; height: 10px; background: " + colors[i] + " \">__</i> " + grades[i] +
      (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
    legend.addTo(myMap);