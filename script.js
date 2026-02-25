// Ambil parameter 'jenis' dari URL
function getJenisFromURL() {
    const params = new URLSearchParams(window.location.search);
    // decodeURIComponent digunakan agar karakter spesial/spasi di URL terbaca benar
    return decodeURIComponent(params.get('jenis') || '');
}

// Render card portfolio dengan struktur yang lebih rapi
function renderCard(porto) {
    const card = document.createElement('div');
    card.className = 'cardi';

    card.innerHTML = `
        <a href="${porto.link}" target="_blank" rel="noopener noreferrer">
            <div class="card-image-wrapper">
                <img src="${porto.gambar}" alt="${porto.judul}" loading="lazy" />
            </div>
            <div class="cardi-content">
                <h3>${porto.judul}</h3>
                <p>${porto.deskripsi}</p>
                <span class="view-project">Lihat Project →</span>
            </div>
        </a>
    `;
    return card;
}

async function loadPortofolio() {
    const jenis = getJenisFromURL();
    const judulElement = document.getElementById('judul-jenis');
    
    // Animasi teks judul muncul
    judulElement.textContent = jenis ? `Project ${jenis.charAt(0).toUpperCase() + jenis.slice(1)}` : 'Semua Portofolio';

    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Gagal mengambil data');
        
        const data = await response.json();
        const filtered = data.filter(item => item.jenis.toLowerCase() === jenis.toLowerCase());

        const container = document.getElementById('container');
        container.innerHTML = '';

        if (filtered.length === 0) {
            container.innerHTML = `<p style="grid-column: 1/-1; opacity: 0.5;">Belum ada karya di kategori ini.</p>`;
            return;
        }

        // Render setiap card dengan sedikit delay (efek stagered)
        filtered.forEach((porto, index) => {
            const cardElement = renderCard(porto);
            cardElement.style.animationDelay = `${index * 0.1}s`; // Jika ingin menambah animasi CSS
            container.appendChild(cardElement);
        });

    } catch (error) {
        document.getElementById('container').innerHTML = `<p>Maaf, terjadi kesalahan saat memuat data.</p>`;
        console.error(error);
    }
}

// Inisialisasi
loadPortofolio();

// Back button dengan handling yang lebih aman
const backButton = document.getElementById('back-button');
backButton.addEventListener('click', () => {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html'; // Fallback ke homepage jika tidak ada history
    }
});
