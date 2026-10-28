// Módulo do Mapa Leaflet
const MapManager = {
  init() {
    const map = L.map('map').setView([-8.12, -34.95], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const marcadoresVeiculos = [
      { id: "PE-0101", lat: -8.0522, lng: -34.9286, status: "em_rota", info: "Caminhão PE-0101 • Em Rota (Recife)" },
      { id: "PE-0205", lat: -8.1121, lng: -35.0154, status: "alerta", info: "Carro-Pipa PE-0205 • Parada Não Programada" },
      { id: "PE-0312", lat: -8.2833, lng: -35.0333, status: "em_rota", info: "Van PE-0312 • Em Rota (Cabo)" }
    ];

    marcadoresVeiculos.forEach(v => {
      const iconHtml = `<div class="custom-pin ${v.status}"><i class="fa-solid fa-truck"></i></div>`;
      const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [30, 30], iconAnchor: [15, 15] });
      L.marker([v.lat, v.lng], { icon: customIcon }).addTo(map).bindPopup(`<strong>${v.info}</strong>`);
    });
  }
};