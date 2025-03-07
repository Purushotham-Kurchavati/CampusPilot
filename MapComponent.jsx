import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapComponent.css';

const MapComponent = ({ universities }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = 'pk.eyJ1IjoicHVydXNob3RoYW1rdXJjaGF2YXRpIiwiYSI6ImNtN3hpd3IxMDA1bzkyanBlNWkxdXZvbGsifQ.rd0SwLUWnCo5sji7LHJ62w';
    
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [77.5946, 12.9716],
      zoom: 9
    });
    
    map.current.addControl(new mapboxgl.NavigationControl());
    
    map.current.on('load', () => {
      if (universities?.length > 0) {
        universities.forEach(uni => {
          const el = document.createElement('div');
          el.className = 'custom-marker';
          
          const marker = new mapboxgl.Marker({
            element: el,
            draggable: true
          })
            .setLngLat(uni.coordinates)
            .addTo(map.current);
          
          marker.on('dragend', () => {
            const lngLat = marker.getLngLat();
            console.log(`New position for ${uni.name}: ${lngLat.lng}, ${lngLat.lat}`);
          });
          
          const popupHtml = `
            <div class="marker-popup">
              <h3>${uni.name}</h3>
              <p><strong>Location:</strong> ${uni.location}</p>
              <p><strong>Coordinates:</strong> ${uni.coordinates[0].toFixed(4)}, ${uni.coordinates[1].toFixed(4)}</p>
              <p><strong>Established:</strong> ${uni.established}</p>
              <p><a href="${uni.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>
            </div>
          `;
          
          const popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
            maxWidth: '300px'
          }).setHTML(popupHtml);
          
          marker.setPopup(popup);
        });
      }
    });
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [universities]);
  
  return <div ref={mapContainer} className="map-wrapper" />;
};

export default MapComponent;