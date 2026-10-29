// Gerenciador da Aba de Rotas e Mapas de Missão
const RotasManager = {
  map1: null,
  map2: null,

  init() {
    this.setupCarousel();
  },

  setupCarousel() {
    const track = document.getElementById('carousel-track');
    const btnNext = document.getElementById('btn-carousel-next');
    const btnPrev = document.getElementById('btn-carousel-prev');

    if (btnNext && btnPrev && track) {
      btnNext.addEventListener('click', () => {
        track.scrollBy({ left: 240, behavior: 'smooth' });
      });

      btnPrev.addEventListener('click', () => {
        track.scrollBy({ left: -240, behavior: 'smooth' });
      });
    }
  },

  renderMapas() {
    // Inicializa o Mapa 1 apenas se ainda não tiver sido instanciado
    if (!this.map1 && document.getElementById('active-map-1')) {
      this.map1 = L.map('active-map-1').setView([-8.15, -34.96], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(this.map1);

      // Trajeto Rota 1 (Recife -> Cabo)
      const latlngs1 = [
        [-8.0522, -34.9286], // Ponto A (Recife)
        [-8.1121, -35.0154], // Ponto do Veículo (Caminhão)
        [-8.2833, -35.0333]  // Ponto B (Cabo)
      ];

      L.polyline(latlngs1, { color: '#2563eb', weight: 4, dashArray: '6, 6' }).addTo(this.map1);

      // Marcadores A, B e Veículo
      L.marker([-8.0522, -34.9286]).addTo(this.map1).bindPopup("Origem: Recife (Ponto A)");
      L.marker([-8.2833, -35.0333]).addTo(this.map1).bindPopup("Destino: Cabo (Ponto B)");
      
      const truckIcon = L.divIcon({
        html: `<div class="custom-pin em_rota"><i class="fa-solid fa-truck"></i></div>`,
        className: '', iconSize: [30, 30], iconAnchor: [15, 15]
      });
      L.marker([-8.1121, -35.0154], { icon: truckIcon }).addTo(this.map1).bindPopup("SCANIA R450 em trânsito (70%)");
    }

    // Inicializa o Mapa 2
    if (!this.map2 && document.getElementById('active-map-2')) {
      this.map2 = L.map('active-map-2').setView([-8.2, -35.5], 9);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(this.map2);

      // Trajeto Rota 2 (Jaboatão -> Caruaru)
      const latlngs2 = [
        [-8.1121, -35.0154], // Ponto A (Jaboatão)
        [-8.2000, -35.2000], // Veículo
        [-8.2839, -35.9761]  // Ponto B (Caruaru)
      ];

      L.polyline(latlngs2, { color: '#f97316', weight: 4 }).addTo(this.map2);

      L.marker([-8.1121, -35.0154]).addTo(this.map2).bindPopup("Origem: Jaboatão (Ponto A)");
      L.marker([-8.2839, -35.9761]).addTo(this.map2).bindPopup("Destino: Caruaru (Ponto B)");

      const vanIcon = L.divIcon({
        html: `<div class="custom-pin alerta"><i class="fa-solid fa-van-shuttle"></i></div>`,
        className: '', iconSize: [30, 30], iconAnchor: [15, 15]
      });
      L.marker([-8.2000, -35.2000], { icon: vanIcon }).addTo(this.map2).bindPopup("MERCEDES SPRINTER (30%)");
    }

    // Recalcula dimensões dos mapas ao trocar de aba
    setTimeout(() => {
      if (this.map1) this.map1.invalidateSize();
      if (this.map2) this.map2.invalidateSize();
    }, 200);
  }
};