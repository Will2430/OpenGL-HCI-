import 'leaflet';

declare global {
  interface Window {
    map?: L.Map;
  }
}
