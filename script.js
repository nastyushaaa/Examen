document.addEventListener('DOMContentLoaded', () => {

    const domainFilters = document.getElementById('filter-domain');
    const temeAlgebra = document.getElementById('teme-algebra');
    const temeGeometrie = document.getElementById('teme-geometrie');
    const formulaGrid = document.getElementById('formula-grid');
    const allCards = Array.from(formulaGrid.getElementsByClassName('formula-card'));
    const searchInput = document.getElementById('search-input');
    const resultsCount = document.getElementById('results-count');
    const activeFiltersList = document.getElementById('active-filters-list');
    const noResultsMessage = document.getElementById('no-results-message');
    const resetBtn = document.getElementById('reset-filtre');

    const mobileBtn = document.getElementById('mobile-filter-toggle');
    const sidebar = document.getElementById('sidebar');

    let currentDomain = 'algebra'; // Значение по умолчанию
    let currentTema = 'toate';
    let currentSearch = '';

    function applyFilters() {
        let count = 0;

        allCards.forEach(card => {
            const cardDomain = card.dataset.category; // 'algebra' или 'geometrie'
            const cardTema = card.dataset.tema;
            const cardText = card.textContent.toLowerCase();

            const domainMatch = cardDomain === currentDomain;
            const temaMatch = (currentTema === 'toate') || (cardTema === currentTema);
            const searchMatch = (currentSearch === '') || cardText.includes(currentSearch);

            if (domainMatch && temaMatch && searchMatch) {
                card.style.display = 'flex'; // Показываем карточку
                count++;
            } else {
                card.style.display = 'none'; // Скрываем
            }
        });

        resultsCount.textContent = `Găsite: ${count} rezultate`;
        noResultsMessage.style.display = (count === 0) ? 'block' : 'none';

        updateActiveFilterBadges();
        updateThemeButtonsVisibility();
    }


    function updateThemeButtonsVisibility() {
        if (currentDomain === 'algebra') {
            temeAlgebra.style.display = 'block';
            temeGeometrie.style.display = 'none';
        } else {
            temeAlgebra.style.display = 'none';
            temeGeometrie.style.display = 'block';
        }
    }

    function updateDomainButtonsUI() {
        domainFilters.querySelectorAll('.btn-filter').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === currentDomain) {
                btn.classList.add('active');
            }
        });
    }

    function updateActiveFilterBadges() {
        activeFiltersList.innerHTML = '';

        const domainBadge = document.createElement('span');
        domainBadge.classList.add('badge-filter', currentDomain);
        domainBadge.textContent = currentDomain.charAt(0).toUpperCase() + currentDomain.slice(1);
        activeFiltersList.appendChild(domainBadge);

        if (currentTema !== 'toate') {
            const temaBadge = document.createElement('span');
            temaBadge.classList.add('badge-filter', 'tema');

            let activeTemaBtn;
            if (currentDomain === 'algebra') {
                activeTemaBtn = temeAlgebra.querySelector(`.btn-filter-tema[data-filter="${currentTema}"]`);
            } else {
                activeTemaBtn = temeGeometrie.querySelector(`.btn-filter-tema[data-filter="${currentTema}"]`);
            }

            temaBadge.textContent = activeTemaBtn ? activeTemaBtn.textContent : currentTema;
            activeFiltersList.appendChild(temaBadge);
        }

        if (currentSearch !== '') {
            const searchBadge = document.createElement('span');
            searchBadge.classList.add('badge-filter', 'search');
            searchBadge.textContent = `Căutare: "${currentSearch}"`;
            activeFiltersList.appendChild(searchBadge);
        }
    }


    domainFilters.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;

        const newDomain = e.target.dataset.filter;
        if (newDomain === currentDomain) return;

        currentDomain = newDomain;
        currentTema = 'toate';
        temeAlgebra.querySelectorAll('.btn-filter-tema').forEach(b => b.classList.remove('active'));
        temeGeometrie.querySelectorAll('.btn-filter-tema').forEach(b => b.classList.remove('active'));

        if (currentDomain === 'algebra') {
            temeAlgebra.querySelector('[data-filter="toate"]').classList.add('active');
        } else {
            temeGeometrie.querySelector('[data-filter="toate"]').classList.add('active');
        }

        updateDomainButtonsUI();
        applyFilters();

        if (window.innerWidth < 1024) {
            sidebar.classList.remove('active');
        }
    });

    function handleTemaClick(e) {
        if (e.target.tagName !== 'BUTTON') return;

        currentTema = e.target.dataset.filter;

        e.target.parentElement.querySelectorAll('.btn-filter-tema').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        applyFilters();

        if (window.innerWidth < 1024) {
            sidebar.classList.remove('active');
        }
    }

    temeAlgebra.addEventListener('click', handleTemaClick);
    temeGeometrie.addEventListener('click', handleTemaClick);

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        applyFilters();
    });

    resetBtn.addEventListener('click', () => {
        currentDomain = 'algebra';
        currentTema = 'toate';
        currentSearch = '';
        searchInput.value = '';

        updateDomainButtonsUI();

        temeAlgebra.querySelectorAll('.btn-filter-tema').forEach(btn => btn.classList.remove('active'));
        temeAlgebra.querySelector('[data-filter="toate"]').classList.add('active');

        temeGeometrie.querySelectorAll('.btn-filter-tema').forEach(btn => btn.classList.remove('active'));
        temeGeometrie.querySelector('[data-filter="toate"]').classList.add('active');

        applyFilters();
    });
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    const urlParams = new URLSearchParams(window.location.search);
    const domainParam = urlParams.get('domain');

    if (domainParam) {
        const cleanDomain = domainParam.toLowerCase();
        if (cleanDomain === 'algebra' || cleanDomain === 'geometrie' || cleanDomain === 'algebră') {
            currentDomain = cleanDomain === 'algebră' ? 'algebra' : cleanDomain;
            updateDomainButtonsUI();
            if (currentDomain === 'geometrie') {
                temeAlgebra.querySelector('[data-filter="toate"]').classList.remove('active');
                temeGeometrie.querySelector('[data-filter="toate"]').classList.add('active');
            }
        }
    }

    applyFilters();
});