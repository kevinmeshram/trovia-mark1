// ── SCROLL PROGRESS + NAV ──
window.addEventListener('scroll', () => {
    const p = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('scroll-progress').style.width = p + '%';
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});
// No hero parallax — hero image is static.

// ── ELEVATION PROFILE ──
// Data points mapped to visually match the 3-peak mountain silhouette:
// Left peak  ≈ Balu Ka Ghera  (medium height)
// Center peak ≈ Hampta Pass   (tallest)
// Right area  ≈ Shea Goru / Chatru (descent)
const elevData = [
    { label: 'Manali', sub: '2,050 m', d: 0 },
    { label: 'Jobra', sub: '3,150 m', d: 130 },
    { label: 'Chika', sub: '3,360 m', d: 270 },
    { label: 'Balu Ka Ghera', sub: '3,810 m', d: 430 },
    { label: 'Hampta Pass', sub: '4,270 m', d: 620 },
    { label: 'Shea Goru', sub: '3,650 m', d: 790 },
    { label: 'Chatru', sub: '3,300 m', d: 1000 }
];

// SVG viewBox: 0 0 1000 240
// Map altitudes so they visually align with the 3-peak silhouette image
const altMap = {
    '2,050 m': 228,   // Manali    - bottom valley
    '3,150 m': 185,   // Jobra     - rising
    '3,360 m': 158,   // Chika     - slope before left peak
    '3,810 m': 95,    // Balu Ka Ghera - LEFT PEAK of silhouette
    '4,270 m': 28,    // Hampta Pass   - CENTER PEAK (tallest)
    '3,650 m': 105,   // Shea Goru - drop after pass
    '3,300 m': 150,   // Chatru    - right valley
};

const pts = elevData.map(e => ({
    x: e.d,
    y: altMap[e.sub],
    label: e.label,
    sub: e.sub
}));

function buildPath(forArea) {
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const cx = (pts[i - 1].x + pts[i].x) / 2;
        d += ` C${cx},${pts[i - 1].y} ${cx},${pts[i].y} ${pts[i].x},${pts[i].y}`;
    }
    if (forArea) d += ` L${pts[pts.length - 1].x},240 L${pts[0].x},240 Z`;
    return d;
}

document.getElementById('elev-line').setAttribute('d', buildPath(false));
document.getElementById('elev-area').setAttribute('d', buildPath(true));

// Elevation labels
const labelsEl = document.getElementById('elev-labels');
elevData.forEach(e => {
    const div = document.createElement('div');
    div.className = 'elev-pt';
    div.innerHTML = `<strong>${e.label}</strong>${e.sub}`;
    labelsEl.appendChild(div);
});

// Hover interaction
const canvas = document.getElementById('elev-canvas');
const tip = document.getElementById('elev-tip');
const vline = document.getElementById('elev-vline');
const dot = document.getElementById('elev-dot');

canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * 1000;

    let near = pts[0], minDist = Infinity;
    pts.forEach(p => {
        const dist = Math.abs(p.x - svgX);
        if (dist < minDist) { minDist = dist; near = p; }
    });

    vline.setAttribute('x1', near.x); vline.setAttribute('x2', near.x); vline.setAttribute('opacity', '1');
    dot.setAttribute('cx', near.x); dot.setAttribute('cy', near.y); dot.setAttribute('opacity', '1');

    tip.innerHTML = `<strong>${near.sub}</strong>${near.label}`;
    tip.style.opacity = '1';
    tip.style.left = Math.min((near.x / 1000) * 100, 78) + '%';
    tip.style.top = '10px';
});

canvas.addEventListener('mouseleave', () => {
    tip.style.opacity = '0';
    vline.setAttribute('opacity', '0');
    dot.setAttribute('opacity', '0');
});

// ── ITINERARY DAY SWITCHER ──
const days = [
    {
        title: 'Manali to Jobra & Trek to Chika',
        dist: '4 km', gain: '1,100 ft',
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75',
        desc: 'Drive from Manali to Jobra (the roadhead). The trail meanders through deodar forests and alpine meadows. You arrive at the beautiful Chika campsite by a crystal-clear mountain stream.'
    },
    {
        title: 'Chika to Balu Ka Ghera',
        dist: '9 km', gain: '1,500 ft',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=75',
        desc: 'A gradual climb through meadows carpeted with wildflowers. Balu Ka Ghera is a wide, flat campsite with sweeping views of snow peaks — ideal for stargazing at night under the Milky Way.'
    },
    {
        title: 'Balu Ka Ghera to Hampta Pass & Shea Goru',
        dist: '8 km', gain: '1,500 ft',
        img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=75',
        desc: 'The crux of the trek. Cross snow bridges, scramble up a steep rocky section, and emerge at Hampta Pass. The landscape shifts dramatically — green to arid. Camp at Shea Goru by a river.'
    },
    {
        title: 'Shea Goru to Chatru (Chandratal Option)',
        dist: '5 km', gain: '−1,300 ft',
        img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&q=75',
        desc: 'Trek down the Lahaul valley to Chatru. Opt for a drive extension to Chandratal Lake — the Crescent Lake at 14,100 ft with turquoise waters surrounded by barren mountains. Truly surreal.'
    },
    {
        title: 'Chatru / Chandratal to Manali',
        dist: 'Drive', gain: '−',
        img: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&q=75',
        desc: 'Drive back to Manali through the Rohtang Pass or Atal Tunnel. Arrive with memories of two worlds — the green valley and the cold desert — packed into 5 incredible days.'
    }
];

const daysNav = document.getElementById('days-nav');
const cards = document.getElementById('itinerary-cards');
days.forEach((d, i) => {
    const btn = document.createElement('button');
    btn.className = 'day-btn' + (i === 0 ? ' active' : '');
    btn.textContent = `Day ${i + 1}`;
    btn.onclick = () => {
        document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.day-card').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`day-${i}`).classList.add('active');
    };
    daysNav.appendChild(btn);

    const card = document.createElement('div');
    card.className = 'day-card' + (i === 0 ? ' active' : '');
    card.id = `day-${i}`;
    card.innerHTML = `
        <div>
            <div class="day-number">0${i + 1}</div>
            <div class="day-info">
                <h3>${d.title}</h3>
                <p>${d.desc}</p>
                <div class="day-meta">
                    <div class="dmeta">🥾 Distance: <span>${d.dist}</span></div>
                    <div class="dmeta">📈 Altitude Gain: <span>${d.gain}</span></div>
                </div>
            </div>
        </div>
        <img class="day-img" src="${d.img}" alt="Day ${i + 1}" loading="lazy"/>
    `;
    cards.appendChild(card);
});

// ── PACKING ACCORDION ──
const packData = [
    { icon: '👕', title: 'Clothing', items: ['Moisture-wicking base layer', 'Fleece mid-layer', 'Waterproof jacket', 'Trekking pants × 2', 'Thermal inner', 'Warm hat & gloves', 'UV-protection sunglasses'] },
    { icon: '🥾', title: 'Footwear', items: ['Waterproof trekking boots (worn-in)', 'Gaiters (for snow)', 'Camp sandals', 'Woollen trekking socks × 3'] },
    { icon: '🎒', title: 'Gear', items: ['40–50 L rucksack', 'Rain cover', 'Trekking poles', 'Headlamp + spare batteries', 'Sleeping bag liner'] },
    { icon: '💊', title: 'Medical & Safety', items: ['Personal first aid kit', 'Diamox (on prescription)', 'Diarrhoea/ORS sachets', 'Knee support brace'] },
    { icon: '🍫', title: 'Food & Hydration', items: ['2 L water bottles / hydration bladder', 'Energy bars & nuts', 'Electrolyte sachets', 'Water purification tablets'] },
    { icon: '📱', title: 'Essentials', items: ['Aadhaar ID copy', 'Offline Gaia GPS map', 'Power bank (20,000 mAh)', 'Sunscreen SPF 50+', 'Lip balm & hand cream'] }
];
const packGrid = document.getElementById('pack-grid');
packData.forEach(cat => {
    const el = document.createElement('div');
    el.className = 'pack-cat';
    el.innerHTML = `
        <div class="pack-cat-head" onclick="this.parentElement.classList.toggle('open')">
            <h4>${cat.icon} ${cat.title}</h4>
            <span class="chevron">▾</span>
        </div>
        <div class="pack-cat-body">
            <ul>${cat.items.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
    `;
    packGrid.appendChild(el);
});

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.stat-item, .highlight-box, .pack-cat');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.15 });
revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
});
