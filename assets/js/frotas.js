// Gerenciador da Aba Frotas e seus Modais
const FrotasManager = {
  veiculos: [],

  init() {
    this.veiculos = MouraDB.getVeiculos();
    this.setupEvents();
    this.render();
  },

  render(lista = this.veiculos) {
    const container = document.getElementById('fleet-grid-container');
    container.innerHTML = '';

    if (lista.length === 0) {
      container.innerHTML = `<p class="text-muted" style="grid-column: 1/-1;">Nenhum veículo encontrado.</p>`;
      return;
    }

    lista.forEach(v => {
      let badgeClass = 'disponivel';
      if (v.disponibilidade === 'Em Rota') badgeClass = 'em-rota';
      if (v.disponibilidade === 'Manutenção') badgeClass = 'manutencao';

      const card = document.createElement('div');
      card.className = 'vehicle-card';
      card.innerHTML = `
        <div>
          <div class="vehicle-card-header">
            <div class="vehicle-title">
              <h4>${v.placa}</h4>
              <span>${v.tipo}</span>
            </div>
            <span class="status-badge ${badgeClass}">${v.disponibilidade}</span>
          </div>
          <div class="vehicle-info">
            <div class="vehicle-info-item"><i class="fa-solid fa-truck-front"></i> <strong>Modelo:</strong> ${v.modelo}</div>
            <div class="vehicle-info-item"><i class="fa-solid fa-user"></i> <strong>Motorista:</strong> ${v.motorista || 'Não Vinculado'}</div>
          </div>
        </div>
        <div class="vehicle-actions">
          <span class="text-muted" style="font-size:0.75rem;">Ações:</span>
          <div class="action-btn-group">
            <button class="btn-action-icon" onclick="FrotasManager.abrirHistorico('${v.id}')" title="Histórico"><i class="fa-solid fa-route"></i></button>
            <button class="btn-action-icon" onclick="FrotasManager.abrirVincular('${v.id}')" title="Vincular Motorista"><i class="fa-solid fa-user-plus"></i></button>
            <button class="btn-action-icon" onclick="FrotasManager.abrirEditar('${v.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-action-icon btn-delete" onclick="FrotasManager.excluir('${v.id}')" title="Excluir"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    this.atualizarKPIs();
  },

  atualizarKPIs() {
    document.getElementById('kpi-total').innerText = this.veiculos.length;
    document.getElementById('kpi-rota').innerText = this.veiculos.filter(v => v.disponibilidade === 'Em Rota').length;
    document.getElementById('kpi-manutencao').innerText = this.veiculos.filter(v => v.disponibilidade === 'Manutenção').length;

    document.getElementById('count-todos').innerText = this.veiculos.length;
    document.getElementById('count-disponivel').innerText = this.veiculos.filter(v => v.disponibilidade === 'Disponível').length;
    document.getElementById('count-emrota').innerText = this.veiculos.filter(v => v.disponibilidade === 'Em Rota').length;
    document.getElementById('count-manutencao').innerText = this.veiculos.filter(v => v.disponibilidade === 'Manutenção').length;
  },

  setupEvents() {
    // Filtros
    document.querySelectorAll('.btn-fleet-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-fleet-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const status = btn.getAttribute('data-status');
        this.render(status === 'todos' ? this.veiculos : this.veiculos.filter(v => v.disponibilidade === status));
      });
    });

    // Fechar modais
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', () => document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active')));
    });

    // Form Veículo
    document.getElementById('btn-add-veiculo').addEventListener('click', () => {
      document.getElementById('modal-veiculo-title').innerText = "Cadastrar Novo Veículo";
      document.getElementById('veiculo-id-edit').value = "";
      document.getElementById('form-veiculo').reset();
      document.getElementById('modal-veiculo').classList.add('active');
    });

    document.getElementById('form-veiculo').addEventListener('submit', (e) => {
      e.preventDefault();
      const idEdit = document.getElementById('veiculo-id-edit').value;
      if (idEdit) {
        const v = this.veiculos.find(i => i.id === idEdit);
        v.placa = document.getElementById('placa').value;
        v.modelo = document.getElementById('modelo').value;
        v.tipo = document.getElementById('tipo').value;
        v.disponibilidade = document.getElementById('disponibilidade').value;
      } else {
        this.veiculos.push({
          id: Date.now().toString(),
          placa: document.getElementById('placa').value,
          modelo: document.getElementById('modelo').value,
          tipo: document.getElementById('tipo').value,
          disponibilidade: document.getElementById('disponibilidade').value,
          motorista: "Não Vinculado",
          historicoRotas: []
        });
      }
      MouraDB.saveVeiculos(this.veiculos);
      this.render();
      document.getElementById('modal-veiculo').classList.remove('active');
    });

    // Form Vincular
    document.getElementById('form-vincular').addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('vincular-veiculo-id').value;
      const v = this.veiculos.find(i => i.id === id);
      if (v) {
        v.motorista = document.getElementById('select-motorista').value;
        MouraDB.saveVeiculos(this.veiculos);
        this.render();
      }
      document.getElementById('modal-vincular').classList.remove('active');
    });
  },

  abrirEditar(id) {
    const v = this.veiculos.find(i => i.id === id);
    if (!v) return;
    document.getElementById('modal-veiculo-title').innerText = "Editar Veículo";
    document.getElementById('veiculo-id-edit').value = v.id;
    document.getElementById('placa').value = v.placa;
    document.getElementById('modelo').value = v.modelo;
    document.getElementById('tipo').value = v.tipo;
    document.getElementById('disponibilidade').value = v.disponibilidade;
    document.getElementById('modal-veiculo').classList.add('active');
  },

  abrirVincular(id) {
    const v = this.veiculos.find(i => i.id === id);
    if (!v) return;
    document.getElementById('vincular-veiculo-id').value = v.id;
    document.getElementById('vincular-veiculo-nome').innerText = `${v.placa} (${v.modelo})`;
    const select = document.getElementById('select-motorista');
    select.innerHTML = '';
    MouraDB.getMotoristas().forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.nome; opt.innerText = m.nome;
      if (v.motorista === m.nome) opt.selected = true;
      select.appendChild(opt);
    });
    document.getElementById('modal-vincular').classList.add('active');
  },

  abrirHistorico(id) {
    const v = this.veiculos.find(i => i.id === id);
    if (!v) return;
    document.getElementById('historico-veiculo-nome').innerText = `${v.placa} - ${v.modelo}`;
    const container = document.getElementById('history-list-container');
    container.innerHTML = v.historicoRotas.length ? v.historicoRotas.map(h => `
      <div class="history-item">
        <p><strong>Rota:</strong> ${h.rota}</p>
        <p><strong>Status:</strong> ${h.status}</p>
        <span class="history-date">Data: ${h.data}</span>
      </div>
    `).join('') : '<p class="text-muted">Nenhuma rota registrada.</p>';
    document.getElementById('modal-historico').classList.add('active');
  },

  excluir(id) {
    if (confirm("Excluir este veículo?")) {
      this.veiculos = this.veiculos.filter(v => v.id !== id);
      MouraDB.saveVeiculos(this.veiculos);
      this.render();
    }
  }
};