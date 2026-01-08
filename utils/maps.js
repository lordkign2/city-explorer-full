// utils/maps.js

/**
 * Generate map embed URL for a location
 * @param {Object} coordinates - Latitude and longitude
 * @param {number} coordinates.lat - Latitude
 * @param {number} coordinates.lng - Longitude
 * @param {Object} options - Map options
 * @param {number} options.zoom - Zoom level (default: 13)
 * @param {string} options.mapProvider - Map provider (leaflet, mapbox)
 * @returns {string} Map embed URL
 */
function generateMapEmbed(coordinates, options = {}) {
  const { lat, lng } = coordinates;
  const { zoom = 13, mapProvider = 'leaflet' } = options;
  
  switch (mapProvider) {
    case 'mapbox':
      if (process.env.MAPBOX_ACCESS_TOKEN) {
        return `https://api.mapbox.com/styles/v1/mapbox/streets-v11.html?access_token=${process.env.MAPBOX_ACCESS_TOKEN}#/${lat}/${lng}/${zoom}`;
      }
      // Fallback to Leaflet if Mapbox token not available
      return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
      
    case 'leaflet':
    default:
      return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
  }
}

/**
 * Generate static map image URL
 * @param {Object} coordinates - Latitude and longitude
 * @param {number} coordinates.lat - Latitude
 * @param {number} coordinates.lng - Longitude
 * @param {Object} options - Image options
 * @param {number} options.width - Image width (default: 600)
 * @param {number} options.height - Image height (default: 400)
 * @param {number} options.zoom - Zoom level (default: 13)
 * @param {string} options.mapProvider - Map provider (leaflet, mapbox)
 * @returns {string} Static map image URL
 */
function generateStaticMap(coordinates, options = {}) {
  const { lat, lng } = coordinates;
  const { width = 600, height = 400, zoom = 13, mapProvider = 'leaflet' } = options;
  
  switch (mapProvider) {
    case 'mapbox':
      if (process.env.MAPBOX_ACCESS_TOKEN) {
        return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+555(${lng},${lat})/${lng},${lat},${zoom}/${width}x${height}?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;
      }
      // Fallback to OpenStreetMap static map
      return `https://www.mapquestapi.com/staticmap/v5/map?locations=${lat},${lng}&size=${width},${height}&zoom=${zoom}&key=${process.env.MAPQUEST_API_KEY || ''}`;
      
    case 'leaflet':
    default:
      // Using MapQuest as a Leaflet-friendly static map provider
      return `https://www.mapquestapi.com/staticmap/v5/map?locations=${lat},${lng}&size=${width},${height}&zoom=${zoom}&key=${process.env.MAPQUEST_API_KEY || ''}`;
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} coord1 - First coordinate
 * @param {Object} coord2 - Second coordinate
 * @returns {number} Distance in kilometers
 */
function calculateDistance(coord1, coord2) {
  const R = 6371; // Earth radius in kilometers
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLon = deg2rad(coord2.lng - coord1.lng);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c;
  return d;
}

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} Radians
 */
function deg2rad(deg) {
  return deg * (Math.PI/180);
}

/**
 * Cluster nearby places
 * @param {Array} places - Array of places with coordinates
 * @param {number} maxDistance - Maximum distance in km for clustering (default: 1)
 * @returns {Array} Clustered places
 */
function clusterPlaces(places, maxDistance = 1) {
  const clusters = [];
  const placed = new Set();
  
  places.forEach((place, index) => {
    if (placed.has(index)) return;
    
    const cluster = {
      center: place.coordinates,
      places: [place],
      count: 1
    };
    
    // Find nearby places
    places.forEach((otherPlace, otherIndex) => {
      if (index === otherIndex || placed.has(otherIndex)) return;
      
      const distance = calculateDistance(place.coordinates, otherPlace.coordinates);
      if (distance <= maxDistance) {
        cluster.places.push(otherPlace);
        cluster.count++;
        placed.add(otherIndex);
      }
    });
    
    clusters.push(cluster);
    placed.add(index);
  });
  
  return clusters;
}

/**
 * Generate directions URL
 * @param {Object} origin - Starting coordinates
 * @param {Object} destination - Destination coordinates
 * @param {string} mode - Transportation mode (driving, walking, cycling)
 * @returns {string} Directions URL
 */
function generateDirectionsUrl(origin, destination, mode = 'driving') {
  const originStr = `${origin.lat},${origin.lng}`;
  const destStr = `${destination.lat},${destination.lng}`;
  
  // Google Maps directions
  if (process.env.GOOGLE_MAPS_API_KEY) {
    return `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}&travelmode=${mode}`;
  }
  
  // OpenStreetMap directions
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_${mode}&route=${origin.lat}%2C${origin.lng}%3B${destination.lat}%2C${destination.lng}`;
}

module.exports = {
  generateMapEmbed,
  generateStaticMap,
  calculateDistance,
  clusterPlaces,
  generateDirectionsUrl
};