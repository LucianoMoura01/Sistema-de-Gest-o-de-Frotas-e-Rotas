// Gerenciador da Aba de Rotas e Mapas de Missão com Rota Real / Histórica
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

  async renderMapas() {
    // Função auxiliar para buscar a rota exata nas ruas via OSRM
    const buscarRotaRuas = async (coordenadas) => {
      const stringCoords = coordenadas.map(c => `${c[1]},${c[0]}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/driving/${stringCoords}?overview=full&geometries=geojson`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          return data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        }
      } catch (e) {
        console.error("Erro ao buscar rota OSRM:", e);
      }
      return [];
    };

    // --- MAPA 1: Recife -> Cabo de Santo Agostinho ---
    if (!this.map1 && document.getElementById('active-map-1')) {
      this.map1 = L.map('active-map-1').setView([-8.15, -34.96], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(this.map1);

      const pontoA1 = [-8.0522, -34.9286];   // Origem (Ponto A)
      const veiculo1 = [-8.1121, -35.0154];  // Posição Atual do Veículo
      const pontoB1 = [-8.2833, -35.0333];   // Destino (Ponto B)

      // 1. Histórico percorrido (Origem até o Veículo) - Exibido com linha tracejada/estilo histórico
      const coordsHistorico = [pontoA1, [-8.0800, -34.9500], veiculo1];
      const rotaHistorica = await buscarRotaRuas(coordsHistorico);
      if (rotaHistorica.length > 0) {
        L.polyline(rotaHistorica, { color: '#94a3b8', weight: 4, dashArray: '6, 6' }).addTo(this.map1);
      }

      // 2. Melhor trajeto (Do Veículo até o Destino Final) - Linha sólida principal
      const coordsRestante = [veiculo1, [-8.1900, -35.0200], pontoB1];
      const rotaRestante = await buscarRotaRuas(coordsRestante);
      if (rotaRestante.length > 0) {
        L.polyline(rotaRestante, { color: '#2563eb', weight: 5, opacity: 0.85 }).addTo(this.map1);
      }

      // Marcadores
      L.marker(pontoA1).addTo(this.map1).bindPopup("Origem (Ponto A)");
      L.marker(pontoB1).addTo(this.map1).bindPopup("Destino (Ponto B)");

      const truckIcon = L.divIcon({
        html: `<div class="custom-pin em_rota"><i class="fa-solid fa-truck"></i></div>`,
        className: '', iconSize: [30, 30], iconAnchor: [15, 15]
      });
      L.marker(veiculo1, { icon: truckIcon }).addTo(this.map1).bindPopup("SCANIA R450 em trânsito (70%)");
    }

    // --- MAPA 2: Jaboatão -> Caruaru ---
    if (!this.map2 && document.getElementById('active-map-2')) {
      this.map2 = L.map('active-map-2').setView([-8.2, -35.5], 9);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(this.map2);

      const pontoA2 = [-8.1121, -35.0154];  // Origem (Ponto A)
      const veiculo2 = [-8.2000, -35.2000];  // Posição Atual do Veículo
      const pontoB2 = [-8.2839, -35.9761];  // Destino (Ponto B)

      // 1. Histórico percorrido (Origem até o Veículo)
      const coordsHistorico2 = [pontoA2, [-8.1500, -35.1000], veiculo2];
      const rotaHistorica2 = await buscarRotaRuas(coordsHistorico2);
      if (rotaHistorica2.length > 0) {
        L.polyline(rotaHistorica2, { color: '#94a3b8', weight: 4, dashArray: '6, 6' }).addTo(this.map2);
      }

      // 2. Melhor trajeto (Do Veículo até o Destino Final)
      const coordsRestante2 = [veiculo2, [-8.2500, -35.5000], pontoB2];
      const rotaRestante2 = await buscarRotaRuas(coordsRestante2);
      if (rotaRestante2.length > 0) {
        L.polyline(rotaRestante2, { color: '#f97316', weight: 5, opacity: 0.85 }).addTo(this.map2);
      }

      // Marcadores
      L.marker(pontoA2).addTo(this.map2).bindPopup("Origem (Ponto A)");
      L.marker(pontoB2).addTo(this.map2).bindPopup("Destino (Ponto B)");

      const vanIcon = L.divIcon({
        html: `<div class="custom-pin alerta"><i class="fa-solid fa-van-shuttle"></i></div>`,
        className: '', iconSize: [30, 30], iconAnchor: [15, 15]
      });
      L.marker(veiculo2, { icon: vanIcon }).addTo(this.map2).bindPopup("MERCEDES SPRINTER (30%)");
    }

    setTimeout(() => {
      if (this.map1) this.map1.invalidateSize();
      if (this.map2) this.map2.invalidateSize();
    }, 200);
  }
};