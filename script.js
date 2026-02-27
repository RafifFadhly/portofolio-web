/* ══════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════ */
const ring = document.getElementById('cursorRing');
const dot  = document.getElementById('cursorDot');
let ringX = 0, ringY = 0, dotX = 0, dotY = 0;
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Scale ring on interactive elements
document.querySelectorAll('a, button, .cat-card, .slide-card, .service-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.transform = 'translate(-50%,-50%) scale(1.7)';
    ring.style.opacity = '0.6';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.opacity = '1';
  });
});

/* ══════════════════════════════════
   PARTICLES CANVAS
══════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.2 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,180,255,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  // Connect nearby particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56,180,255,${(1 - dist/100) * 0.06})`;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ══════════════════════════════════
   NAVBAR
══════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
    });
});

/* ══════════════════════════════════
   ACTIVE NAV ON SCROLL
══════════════════════════════════ */
const sections    = document.querySelectorAll('section[id]');
const navLinkEls  = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

/* ══════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════ */
const revealEls = document.querySelectorAll(
  '.about-card, .service-card, .cat-card, .section-title, .service-sub, .featured-label'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// Stagger children in grids
document.querySelectorAll('.category-grid, .service-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.classList.add('reveal');
    child.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(child);
  });
});

document.querySelectorAll('.nav-link, .btn-primary, .btn-ghost').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Pastikan href adalah internal link (dimulai dengan #)
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navbarHeight = 70; // Sesuaikan dengan var(--nav-h) di CSS Anda
                const targetPosition = targetElement.offsetTop - navbarHeight;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                let startTime = null;

                // Durasi scroll dalam milidetik (1000ms = 1 detik)
                const duration = 1200; 

                // Fungsi matematika untuk membuat gerakan "slow start - slow end"
                function ease(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }

                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = ease(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }

                requestAnimationFrame(animation);

                // Jika di mobile, tutup menu setelah klik
                const navLinks = document.querySelector('.nav-links');
                const navToggle = document.querySelector('.nav-toggle');
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    navToggle.classList.remove('active');
                }
            }
        }
    });
});

/* ══════════════════════════════════
   FEATURED PROJECTS SLIDER DATA
   (Replace placeholder data with your real projects)
══════════════════════════════════ */
const featuredProjects = [
  {
    title: 'Jane Doe Doesnt Know',
    date: '2026',
    link: 'https://rfas-dev.itch.io/jane-doe-doesnt-know',       // replace with real link
    image: 'https://img.itch.zone/aW1nLzI1NDMwMzI1LnBuZw==/original/YhzWxE.png',                                  // replace with real image path e.g. 'img/project1.jpg'
    icon: ''
  },
  {
    title: 'Telik Sandi',
    date: '2025',
    link: 'https://rfas-dev.itch.io/telik-sandi',       // replace with real link
    image: 'https://img.itch.zone/aW1hZ2UvNDAzOTExMy8yNDExMDU3Mi5wbmc=/original/yfPobx.png',                                  // replace with real image path e.g. 'img/project1.jpg'
    icon: ''
  },
  {
    title: 'El Walet',
    date: '2025',
    link: 'https://rfas-dev.itch.io/el-wallet',       // replace with real link
    image: 'https://img.itch.zone/aW1nLzIzMTY0NDQ4LnBuZw==/original/wpb%2BlQ.png',                                  // replace with real image path e.g. 'img/project1.jpg'
    icon: ''
  },
  {
    title: 'Lostway',
    date: '2025',
    link: 'https://rfas-dev.itch.io/lost-way',       // replace with real link
    image: 'https://img.itch.zone/aW1nLzI0NjA3MTA1LnBuZw==/original/YJtYFR.png',                                  // replace with real image path e.g. 'img/project1.jpg'
    icon: ''
  },
  {
    title: 'Devils Kingdom',
    date: '2024',
    link: 'https://rfas-dev.itch.io/devils-kingdom',       // replace with real link
    image: 'https://img.itch.zone/aW1nLzE5MjQ0MDU3LnBuZw==/original/2MG5QY.png',                                  // replace with real image path e.g. 'img/project1.jpg'
    icon: ''
  },
  {
    title: 'VIRTE - VR Exhibition',
    date: '2024',
    link: 'https://virte.diengcyber.com/',
    image: 'foto-pt-web/virte.png',
    icon: ''
  },
  {
    title: 'VIRLI - VR Seminar',
    date: '2024',
    link: 'https://virli.diengcyber.com',
    image: 'foto-pt-web/virli.png',
    icon: ''
  },
  {
    title: 'Bima Suci',
    date: '2024',
    link: 'https://rfas-dev.itch.io/bima-suci-remake',
    image: 'https://img.itch.zone/aW1nLzE2MzU4NjEzLmpwZWc=/original/RmOzwi.jpeg',
    icon: ''
  },
];

function buildSlider() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;

  // Duplicate for infinite loop
  const allProjects = [...featuredProjects, ...featuredProjects];

  allProjects.forEach(project => {
    const card = document.createElement('a');
    card.className = 'slide-card';
    card.href = project.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const imgContent = project.image
      ? `<img src="${project.image}" alt="${project.title}" loading="lazy" />`
      : `<span style="font-size:3rem">${project.icon}</span>`;

    card.innerHTML = `
      <div class="slide-card-img">${imgContent}</div>
      <div class="slide-card-info">
        <h4>${project.title}</h4>
        <span>${project.date}</span>
      </div>
    `;
    track.appendChild(card);
  });
}

buildSlider();

/* ══════════════════════════════════
   SUBTLE PARALLAX ON HOME IMAGE
══════════════════════════════════ */
const homeImage = document.querySelector('.home-image');
document.addEventListener('mousemove', e => {
  if (!homeImage) return;
  const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
  const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
  homeImage.style.transform = `translate(${xRatio * -8}px, ${yRatio * -6}px)`;
});
