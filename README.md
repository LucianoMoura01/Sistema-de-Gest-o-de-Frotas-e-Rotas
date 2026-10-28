# Sistema de Gestão de Frotas e Rotas

## Moura Tracker

Sistema web de gestão de frotas e operações logísticas desenvolvido para controle de veículos, monitoramento em tempo real, atribuição de motoristas e auditoria de rotas.

### Visão Geral
O projeto foi estruturado a partir de vivências práticas em coordenação operacional e logística, combinando o rigor de processos de campo com padrões modernos de desenvolvimento web e arquitetura limpa.

### Principais Funcionalidades
Dashboard Operacional: Painel com indicadores gerais da frota, contagem de veículos ativos em rota, unidades em manutenção e alertas críticos.

Monitoramento por Mapa: Integração com mapa interativo utilizando Leaflet.js e OpenStreetMap para acompanhamento geolocalizado de rotas na Região Metropolitana.

Gestão de Frotas: Listagem de veículos em formato de cards com controle de status (Disponível, Em Rota, Manutenção), além de cadastro e edição completa.

Atribuição de Motoristas: Sistema de vínculo entre veículos e condutores cadastrados.

Gestão de Equipe: Cadastro de motoristas com suporte a upload de foto de perfil armazenada localmente via FileReader API, acompanhamento de CNH e histórico individual de rotas.

### Arquitetura do Projeto
A aplicação foi desenvolvida em formato modular para facilitar a manutenção e a legibilidade do código:


moura-tracker/
│
├── index.html
│
├── css/
│   ├── main.css
│   ├── components.css
│   ├── dashboard.css
│   ├── frotas.css
│   └── motoristas.css
│
└── js/
    ├── database.js
    ├── navigation.js
    ├── map.js
    ├── frotas.js
    ├── motoristas.js
    └── app.js

### Tecnologias Utilizadas
HTML5 e CSS3 (Flexbox, Grid, Variáveis CSS)

JavaScript (ES6+, Módulos e LocalStorage API)

Leaflet.js e OpenStreetMap

Font Awesome e Google Fonts (Inter)

### Como Executar
Clone o repositório em sua máquina:

git clone https://github.com/seu-usuario/moura-tracker.git

Abra a pasta do projeto.

Abra o arquivo index.html diretamente em seu navegador.

#### Desenvolvido por Luciano Moura Jr.
