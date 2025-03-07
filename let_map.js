let map;

function initMap(lat, lng) {
    const mapElement = document.getElementById("collegeMap");
    if (!mapElement) {
        console.error("Map element not found");
        return;
    }

    // Default location (Bangalore) if no lat/lng is provided
    const defaultLocation = [77.5946, 12.9716];  // Mapbox uses [longitude, latitude]

    // Use provided lat/lng or default location
    const location = lat && lng ? [parseFloat(lng), parseFloat(lat)] : defaultLocation;

    // Initialize the map with your API key
    mapboxgl.accessToken = "pk.eyJ1IjoicHVydXNob3RoYW1rdXJjaGF2YXRpIiwiYSI6ImNtN3hpd3IxMDA1bzkyanBlNWkxdXZvbGsifQ.rd0SwLUWnCo5sji7LHJ62w";
    map = new mapboxgl.Map({
        container: "collegeMap",  // Container ID
        style: "mapbox://styles/purushothamkurchavati/cm7yd775z00uy01sd7jtd3c9c",  // Your custom style
        center: location,  // Initial map center [longitude, latitude]
        zoom: 15,  // Initial zoom level
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl());

    // Add a marker
    new mapboxgl.Marker()
        .setLngLat(location)
        .addTo(map);
        
    // Add popup to the marker
    new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true
    })
    .setLngLat(location)
    .setHTML('<h3>University Location</h3>')
    .addTo(map);
}

// Call initMap when the page loads
window.initMap = initMap;