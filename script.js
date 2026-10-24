// Dados iniciais de simulação da frota
let frota = [
  { id: "MT-0101", tipo: "Caminhão", motorista: "Carlos Silva", rota: "Recife -> Cabo", status: "Em Rota" },
  { id: "MT-0205", tipo: "Carro-Pipa", motorista: "João Pereira", rota: "Jaboatão -> Caruaru", status: "Em Rota" },
  { id: "MT-0312", tipo: "Van", motorista: "Ana Souza", rota: "Região Metropolitana", status: "Disponível" },
  { id: "MT-0118", tipo: "Caminhão", motorista: "Marcos Lima", rota: "Oficina Central", status: "Manutenção" },
  { id: "MT-0402", tipo: "Utilitário", motorista: "Lucas Santos", rota: "Suape -> Recife", status: "Em Rota" }
];

// Elementos do DOM
const fleetTableBody = document.getElementById("fleet-table-body");
const filterStatusSelect = document.getElementById("filter-status");
const modal = document.getElementById("modal-veiculo");
const btnNovoVeiculo = document.getElementById("btn-novo-veiculo");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnCancelar = document.getElementById("btn-cancelar");
const formVeiculo = document.getElementById("form-veiculo");

// Função para renderizar a tabela
function renderTable(dados) {
  fleetTableBody.innerHTML = "";

  dados.forEach((veiculo, index) => {
    const row = document.createElement("tr");

    let statusClass = "";
    if (veiculo.status === "Em Rota") statusClass = "em-rota";
    else if (veiculo.status === "Disponível") statusClass = "disponivel";
    else if (veiculo.status === "Manutenção") statusClass = "manutencao";

    row.innerHTML = `
      <td><strong>${veiculo.id}</strong></td>
      <td>${veiculo.tipo}</td>
      <td>${veiculo.motorista}</td>
      <td>${veiculo.rota}</td>
      <td><span class="status-badge ${statusClass}">${veiculo.status}</span></td>
      <td>
        <button onclick="removerVeiculo(${index})" style="border:none; background:none; color:#ef4444; cursor:pointer;" title="Excluir">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    fleetTableBody.appendChild(row);
  });

  atualizarKPIs();
}

// Atualiza contadores do topo
function atualizarKPIs() {
  document.getElementById("kpi-total").innerText = frota.length;
  document.getElementById("kpi-rota").innerText = frota.filter(v => v.status === "Em Rota").length;
  document.getElementById("kpi-manutencao").innerText = frota.filter(v => v.status === "Manutenção").length;
}

// Filtro da Tabela
filterStatusSelect.addEventListener("change", (e) => {
  const valor = e.target.value;
  if (valor === "todos") {
    renderTable(frota);
  } else {
    const filtrados = frota.filter(veiculo => veiculo.status === valor);
    renderTable(filtrados);
  }
});

// Abertura e Fechamento do Modal
btnNovoVeiculo.addEventListener("click", () => modal.classList.add("active"));
btnCloseModal.addEventListener("click", () => modal.classList.remove("active"));
btnCancelar.addEventListener("click", () => modal.classList.remove("active"));

// Adicionar Novo Veículo
formVeiculo.addEventListener("submit", (e) => {
  e.preventDefault();

  const novoVeiculo = {
    id: document.getElementById("codigo").value,
    tipo: document.getElementById("tipo").value,
    motorista: document.getElementById("motorista").value,
    rota: document.getElementById("rota").value,
    status: document.getElementById("status").value
  };

  frota.push(novoVeiculo);
  renderTable(frota);
  formVeiculo.reset();
  modal.classList.remove("active");
});

// Excluir Veículo
function removerVeiculo(index) {
  if (confirm("Deseja realmente remover este veículo da frota?")) {
    frota.splice(index, 1);
    renderTable(frota);
  }
}

// --- INICIALIZAÇÃO DO MAPA REAL COM LEAFLET ---

// Coordenadas centrais (Região Metropolitana do Recife / Jaboatão)
const map = L.map('map').setView([-8.12, -34.95], 11);

// Camada do OpenStreetMap (Mapa Real de Ruas)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Dados dos veículos no mapa (com coordenadas reais da região)
const marcadoresVeiculos = [
  {
    id: "MT-0101",
    lat: -8.0522,
    lng: -34.9286,
    status: "em_rota",
    info: "Caminhão MT-0101 • Em Rota (Recife)"
  },
  {
    id: "MT-0205",
    lat: -8.1121,
    lng: -35.0154,
    status: "alerta",
    info: "Carro-Pipa MT-0205 • Parada Não Programada (Jaboatão)"
  },
  {
    id: "MT-0312",
    lat: -8.2833,
    lng: -35.0333,
    status: "em_rota",
    info: "Van MT-0312 • Em Rota (Cabo de Santo Agostinho)"
  }
];

let mapMarkers = [];

function carregarMarcadoresNoMapa() {
  mapMarkers.forEach(m => map.removeLayer(m.marker));
  mapMarkers = [];

  marcadoresVeiculos.forEach(v => {
    const iconHtml = `<div class="custom-pin ${v.status}"><i class="fa-solid fa-truck"></i></div>`;
    const customIcon = L.divIcon({
      html: iconHtml,
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker([v.lat, v.lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<strong>${v.info}</strong>`);

    mapMarkers.push({ marker: marker, status: v.status === 'alerta' ? 'alerta' : 'em_rota' });
  });
}

carregarMarcadoresNoMapa();

// Filtros dos marcadores no mapa
const btnFiltersMap = document.querySelectorAll(".btn-filter");

btnFiltersMap.forEach(btn => {
  btn.addEventListener("click", () => {
    btnFiltersMap.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    mapMarkers.forEach(item => {
      if (filter === "todos" || item.status === filter) {
        map.addLayer(item.marker);
      } else {
        map.removeLayer(item.marker);
      }
    });
  });
});

// Renderização Inicial da Tabela
renderTable(frota);