// Gerenciador de navegação de abas
const Navigation = {
  init() {
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute('data-tab');

        navLinks.forEach(l => l.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        link.classList.add('active');
        document.getElementById(targetTab).classList.add('active');

        if (targetTab === 'tab-frotas') {
          FrotasManager.render();
        }
        if (targetTab === 'tab-motoristas') {
          MotoristasManager.render();
        }
      });
    });
  }
};