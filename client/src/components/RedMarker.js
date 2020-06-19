import L from 'leaflet';

export const RedMarker = L.icon({
  iconUrl: require('../assets/red_marker.png'),
  iconRetinaUrl: require('../assets/red_marker.png'),
  iconAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: [35, 35],
  className: 'leaflet-venue-icon'
});
