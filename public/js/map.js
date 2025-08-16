// public/js/map.js

function initMap(listing, apiKey) {
  // Fallback to Nagpur if no coordinates
  const lat = listing.latitude || 21.1458;
  const lng = listing.longitude || 79.0882;

  // Initialize map
  const map = L.map("map").setView([lat, lng], 13);

  // MapTiler tiles
  L.tileLayer(
    `https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=${apiKey}`,
    {
      attribution:
        '<a href="https://www.maptiler.com/">© MapTiler</a> © OpenStreetMap contributors',
      tileSize: 256,
    }
  ).addTo(map);

  // Add marker
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${listing.title}</b><br>${listing.location}`)
    .openPopup();
}
