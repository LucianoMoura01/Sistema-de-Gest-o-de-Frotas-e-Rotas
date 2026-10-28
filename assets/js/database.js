// Base de dados e persistência
const MouraDB = {
  getMotoristas() {
    return JSON.parse(localStorage.getItem('moura_motoristas')) || [
      { id: 1, nome: "Carlos Silva", cnh: "12345678900", categoria: "D" },
      { id: 2, nome: "João Pereira", cnh: "98765432100", categoria: "E" },
      { id: 3, nome: "Ana Souza", cnh: "45678912300", categoria: "D" },
      { id: 4, nome: "Marcos Lima", cnh: "78912345600", categoria: "C" },
      { id: 5, nome: "Nenhum Motorista Vinculado", cnh: "-", categoria: "-" }
    ];
  },

  getVeiculos() {
    return JSON.parse(localStorage.getItem('moura_veiculos')) || [
      {
        id: "1",
        placa: "PE-0101",
        modelo: "Volvo FH 540",
        tipo: "Caminhão",
        disponibilidade: "Em Rota",
        motorista: "Carlos Silva",
        historicoRotas: [
          { rota: "Recife -> Cabo de Santo Agostinho", data: "24/10/2026", status: "Concluída" },
          { rota: "Cabo -> Porto de Suape", data: "26/10/2026", status: "Em Andamento" }
        ]
      },
      {
        id: "2",
        placa: "PE-0205",
        modelo: "Mercedes-Benz Atego (Carro-Pipa)",
        tipo: "Carro-Pipa",
        disponibilidade: "Em Rota",
        motorista: "João Pereira",
        historicoRotas: [
          { rota: "Jaboatão -> Caruaru", data: "25/10/2026", status: "Em Atraso" }
        ]
      },
      {
        id: "3",
        placa: "PE-0312",
        modelo: "Renault Master Van",
        tipo: "Van",
        disponibilidade: "Disponível",
        motorista: "Ana Souza",
        historicoRotas: [
          { rota: "Região Metropolitana Recife", data: "20/10/2026", status: "Concluída" }
        ]
      },
      {
        id: "4",
        placa: "PE-0118",
        modelo: "Scania R450",
        tipo: "Caminhão",
        disponibilidade: "Manutenção",
        motorista: "Nenhum Motorista Vinculado",
        historicoRotas: [
          { rota: "Oficina Central Jaboatão", data: "27/10/2026", status: "Manutenção" }
        ]
      }
    ];
  },

  saveVeiculos(veiculos) {
    localStorage.setItem('moura_veiculos', JSON.stringify(veiculos));
  }
};