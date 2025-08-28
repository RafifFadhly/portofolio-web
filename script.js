// Ambil parameter 'jenis' dari URL
function getJenisFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('jenis') || '';
}

// Render card portfolio
function renderCard(porto) {
    const card = document.createElement('div');
    card.className = 'cardi';

    card.innerHTML = `
        <a href="${porto.link}" target="_blank" rel="noopener noreferrer">
            <img src="${porto.gambar}" alt="${porto.judul}" />
            <h3>${porto.judul}</h3>
            <p>${porto.deskripsi}</p>
        </a>
    `;
    return card;
}

async function loadPortofolio() {
    const jenis = getJenisFromURL();
    document.getElementById('judul-jenis').textContent = `Portofolio ${jenis.charAt(0).toUpperCase() + jenis.slice(1)}`;

    try {
        const response = await fetch('data.json');
        const data = await response.json();

        const filtered = data.filter(item => item.jenis === jenis);

        const container = document.getElementById('container');
        container.innerHTML = '';

        if (filtered.length === 0) {
            container.textContent = 'Portofolio tidak ditemukan untuk jenis ini.';
            return;
        }

        filtered.forEach(porto => {
            container.appendChild(renderCard(porto));
        });
    } catch (error) {
        document.getElementById('container').textContent = 'Gagal memuat data portofolio.';
        console.error(error);
    }
}

loadPortofolio();

const backButton = document.getElementById('back-button');
backButton.addEventListener('click', () => {
    window.history.back();
});
