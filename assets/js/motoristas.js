// Gerenciador da Aba Motoristas e Modais com Upload de Imagem
const MotoristasManager = {
  motoristas: [],
  tempFotoBase64: "", // Armazena temporariamente a imagem convertida

  init() {
    this.motoristas = MouraDB.getMotoristas();
    this.setupEvents();
  },

  render() {
    const container = document.getElementById('driver-grid-container');
    container.innerHTML = '';
    
    this.motoristas = MouraDB.getMotoristas();
    const veiculos = MouraDB.getVeiculos();

    if (this.motoristas.length === 0) {
      container.innerHTML = `<p class="text-muted" style="grid-column: 1/-1;">Nenhum motorista cadastrado.</p>`;
      return;
    }

    this.motoristas.forEach(m => {
      const veiculoVinculado = veiculos.find(v => v.motorista === m.nome);
      const veiculoTexto = veiculoVinculado ? `${veiculoVinculado.placa} (${veiculoVinculado.modelo})` : 'Nenhum veículo vinculado';

      // Usa a imagem em base64 salva ou exibe uma padrão
      const fotoPerfil = m.foto && m.foto.trim() !== "" ? m.foto : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

      const card = document.createElement('div');
      card.className = 'driver-card';
      card.innerHTML = `
        <div>
          <div class="driver-profile-header">
            <img src="${fotoPerfil}" alt="${m.nome}" class="driver-avatar-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'">
            <div class="driver-info-basic">
              <h4>${m.nome}</h4>
              <p>CNH: <strong>${m.cnh}</strong></p>
            </div>
          </div>
          <div class="driver-details">
            <div class="driver-detail-item">
              <i class="fa-solid fa-id-card"></i> <strong>Tipo CNH:</strong> ${m.categoria || 'D'}
            </div>
            <div class="driver-detail-item">
              <i class="fa-solid fa-truck"></i> <strong>Veículo:</strong> ${veiculoTexto}
            </div>
          </div>
        </div>
        <div class="vehicle-actions">
          <span class="text-muted" style="font-size:0.75rem;">Ações:</span>
          <div class="action-btn-group">
            <button class="btn-action-icon" onclick="MotoristasManager.abrirHistorico('${m.id}')" title="Histórico de Rotas"><i class="fa-solid fa-route"></i></button>
            <button class="btn-action-icon" onclick="MotoristasManager.abrirEditar('${m.id}')" title="Editar Motorista"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-action-icon btn-delete" onclick="MotoristasManager.excluir('${m.id}')" title="Excluir Motorista"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  },

  setupEvents() {
    // Listener para o input de arquivo (Upload)
    const inputFile = document.getElementById('motorista-foto-file');
    inputFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          this.tempFotoBase64 = uploadEvent.target.result; // Salva a imagem convertida
        };
        reader.readAsDataURL(file);
      }
    });

    // Botão Adicionar Motorista
    document.getElementById('btn-add-motorista').addEventListener('click', () => {
      document.getElementById('modal-motorista-title').innerText = "Cadastrar Novo Motorista";
      document.getElementById('motorista-id-edit').value = "";
      document.getElementById('form-motorista').reset();
      this.tempFotoBase64 = "";
      document.getElementById('modal-motorista').classList.add('active');
    });

    // Submissão do Formulário de Motorista (Criar/Editar)
    document.getElementById('form-motorista').addEventListener('submit', (e) => {
      e.preventDefault();
      const idEdit = document.getElementById('motorista-id-edit').value;
      const nome = document.getElementById('motorista-nome').value;
      const cnh = document.getElementById('motorista-cnh').value;
      const categoria = document.getElementById('motorista-categoria').value;

      if (idEdit) {
        const m = this.motoristas.find(i => i.id == idEdit);
        if (m) {
          m.nome = nome;
          m.cnh = cnh;
          m.categoria = categoria;
          if (this.tempFotoBase64) {
            m.foto = this.tempFotoBase64; // Atualiza apenas se uma nova foto foi enviada
          }
        }
      } else {
        const novoMotorista = {
          id: Date.now(),
          nome: nome,
          cnh: cnh,
          categoria: categoria,
          foto: this.tempFotoBase64 || "", // Salva a imagem convertida ou vazia
          historicoRotas: [
            { rota: "Integração Operacional Região Metropolitana", data: "26/10/2026", status: "Concluída" }
          ]
        };
        this.motoristas.push(novoMotorista);
      }

      localStorage.setItem('moura_motoristas', JSON.stringify(this.motoristas));
      this.render();
      document.getElementById('modal-motorista').classList.remove('active');
    });
  },

  abrirEditar(id) {
    const m = this.motoristas.find(i => i.id == id);
    if (!m) return;

    document.getElementById('modal-motorista-title').innerText = "Editar Motorista";
    document.getElementById('motorista-id-edit').value = m.id;
    document.getElementById('motorista-nome').value = m.nome;
    document.getElementById('motorista-cnh').value = m.cnh;
    document.getElementById('motorista-categoria').value = m.categoria || 'D';
    document.getElementById('motorista-foto-file').value = ""; // Reseta o input file
    this.tempFotoBase64 = m.foto || ""; // Mantém a foto anterior por padrão

    document.getElementById('modal-motorista').classList.add('active');
  },

  abrirHistorico(id) {
    const m = this.motoristas.find(i => i.id == id);
    if (!m) return;

    document.getElementById('historico-motorista-nome').innerText = `${m.nome} (CNH: ${m.cnh})`;
    const container = document.getElementById('history-driver-list-container');
    
    const historico = m.historicoRotas || [
      { rota: "Operação Logística Base Recife", data: "22/10/2026", status: "Concluída" }
    ];

    container.innerHTML = historico.map(h => `
      <div class="history-item">
        <p><strong>Rota:</strong> ${h.rota}</p>
        <p><strong>Status:</strong> ${h.status}</p>
        <span class="history-date">Data: ${h.data}</span>
      </div>
    `).join('');

    document.getElementById('modal-historico-motorista').classList.add('active');
  },

  excluir(id) {
    if (confirm("Tem certeza que deseja excluir este motorista?")) {
      this.motoristas = this.motoristas.filter(m => m.id != id);
      localStorage.setItem('moura_motoristas', JSON.stringify(this.motoristas));
      this.render();
    }
  }
};