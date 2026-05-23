/* =====================
   PRESTIJ EMLAK – app.js (Çoklu Sayfa)
   ===================== */

// ---- VERİ: localStorage ile sayfalar arası paylaşım ----
const ORNEK_ILANLAR = [
  {
    id: 1, baslik: "Kadıköy'de Deniz Manzaralı Lüks Daire",
    tip: "Satılık", konum: "Kadıköy, İstanbul",
    fiyat: 8500000, m2: 145, oda: "3+1", kat: "8. Kat", yil: 2019,
    aciklama: "Marmara Denizi manzaralı, her odası ferah ve aydınlık bu eşsiz daire Kadıköy'ün en prestijli sitesinde yer almaktadır. Açık mutfak, geniş balkon, kapalı otopark dahildir.",
    fotolar: [], tarih: "2024-05-10", favori: false
  },
  {
    id: 2, baslik: "Beşiktaş Merkezde Kiralık Modern Ofis",
    tip: "Ticari", konum: "Beşiktaş, İstanbul",
    fiyat: 85000, m2: 220, oda: "—", kat: "4. Kat", yil: 2021,
    aciklama: "Beşiktaş iş merkezinde, şehrin her yerine kolay ulaşım imkânı sunan modern ofis katı. Asansör, güvenlik ve yönetim hizmetleri mevcuttur.",
    fotolar: [], tarih: "2024-06-01", favori: false
  },
  {
    id: 3, baslik: "Çankaya'da Bahçeli Müstakil Villa",
    tip: "Satılık", konum: "Çankaya, Ankara",
    fiyat: 12000000, m2: 380, oda: "5+1", kat: "Müstakil", yil: 2016,
    aciklama: "3.000 m² arsa içinde konumlanan, özel havuz ve çift garajlı bu villa, Çankaya'nın en seçkin semtinde tam gizlilik sunmaktadır.",
    fotolar: [], tarih: "2024-06-15", favori: false
  },
  {
    id: 4, baslik: "Karşıyaka'da 2+1 Kiralık Daire",
    tip: "Kiralık", konum: "Karşıyaka, İzmir",
    fiyat: 18000, m2: 85, oda: "2+1", kat: "2. Kat", yil: 2015,
    aciklama: "Tramvay hattına 3 dakika yürüme mesafesinde, güneş alan, bakımlı ve eşyasız kiralık daire. Kombi ve klima sistemi mevcuttur.",
    fotolar: [], tarih: "2024-07-01", favori: false
  },
  {
    id: 5, baslik: "Nilüfer'de Yeni Bina 1+1 Daire",
    tip: "Satılık", konum: "Nilüfer, Bursa",
    fiyat: 2200000, m2: 55, oda: "1+1", kat: "1. Kat", yil: 2023,
    aciklama: "Sıfır bina, akıllı ev sistemine sahip bu modern 1+1 daire yatırım için de idealdir. Site içi yüzme havuzu ve fitness center mevcuttur.",
    fotolar: [], tarih: "2024-07-10", favori: false
  },
  {
    id: 6, baslik: "Muratpaşa'da Kiralık İş Yeri / Dükkan",
    tip: "Kiralık", konum: "Muratpaşa, Antalya",
    fiyat: 35000, m2: 130, oda: "—", kat: "Zemin", yil: 2010,
    aciklama: "Ana cadde üzerinde yüksek yaya trafiğine sahip, vitrinli, cephe genişliği 8 metre olan bu iş yeri perakende veya restoran olarak uygundur.",
    fotolar: [], tarih: "2024-07-20", favori: false
  }
];

// localStorage'dan oku, yoksa örnek verileri yaz
function ilanlarıYukle() {
  const kayitli = localStorage.getItem('prestij_ilanlar');
  if (kayitli) {
    return JSON.parse(kayitli);
  } else {
    localStorage.setItem('prestij_ilanlar', JSON.stringify(ORNEK_ILANLAR));
    return JSON.parse(JSON.stringify(ORNEK_ILANLAR));
  }
}

function ilanlarıKaydet(data) {
  localStorage.setItem('prestij_ilanlar', JSON.stringify(data));
}

let ilanlar = ilanlarıYukle();
let yuklenenFotolar = [];
let aktifGaleriIndex = 0;
let aktifModalIlan = null;

// ---- NAVBAR ----
function navbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 50
      ? 'rgba(15,14,12,0.98)'
      : 'rgba(15,14,12,0.96)';
  });
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.toggle('acik');
    });
  }
}

// ---- SAYAÇ ANİMASYONU ----
function sayacAnimasyonu() {
  const el = document.getElementById('cnt-toplam');
  if (!el) return;
  let v = 0;
  const target = ilanlar.length;
  const step = Math.ceil(target / 30);
  const t = setInterval(() => {
    v = Math.min(v + step, target);
    el.textContent = v;
    if (v >= target) clearInterval(t);
  }, 50);
}

// ---- HERO ARAMA ----
function heroAra() {
  const tip = document.getElementById('hero-tip').value;
  const ara = document.getElementById('hero-arama').value.trim();
  let url = 'ilanlar.html?';
  if (tip) url += `tip=${encodeURIComponent(tip)}&`;
  if (ara) url += `ara=${encodeURIComponent(ara)}`;
  window.location.href = url;
}

// ---- FİLTRE ----
function filtrele(aramaQuery) {
  const kategoriEl = document.getElementById('f-kategori');
  const odaEl = document.getElementById('f-oda');
  const fiyatEl = document.getElementById('f-fiyat');
  const siralaEl = document.getElementById('f-sirala');
  if (!kategoriEl) return;

  const kategori = kategoriEl.value;
  const oda = odaEl ? odaEl.value : '';
  const maxFiyat = fiyatEl ? (parseInt(fiyatEl.value) || Infinity) : Infinity;
  const sirala = siralaEl ? siralaEl.value : 'yeni';

  ilanlar = ilanlarıYukle(); // her filtreden önce güncel veriyi çek

  let sonuc = ilanlar.filter(i => {
    if (kategori && i.tip !== kategori) return false;
    if (oda && i.oda !== oda) return false;
    if (i.fiyat > maxFiyat) return false;
    if (aramaQuery) {
      const q = aramaQuery.toLowerCase();
      if (!i.konum.toLowerCase().includes(q) && !i.baslik.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if (sirala === 'fiyat-artan') sonuc.sort((a, b) => a.fiyat - b.fiyat);
  else if (sirala === 'fiyat-azalan') sonuc.sort((a, b) => b.fiyat - a.fiyat);
  else if (sirala === 'm2') sonuc.sort((a, b) => (b.m2 || 0) - (a.m2 || 0));
  else sonuc.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));

  kartlariRender(sonuc, 'ilan-grid');

  const bilgi = document.getElementById('ilan-sonuc-bilgi');
  if (bilgi) {
    bilgi.innerHTML = `<strong>${sonuc.length}</strong> ilan listeleniyor`;
  }
}

function filtreTemizle() {
  ['f-kategori', 'f-oda', 'f-fiyat'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const sirala = document.getElementById('f-sirala');
  if (sirala) sirala.value = 'yeni';
  filtrele();
}

// ---- KARTLARI RENDER ET ----
function kartlariRender(liste, gridId) {
  const grid = document.getElementById(gridId || 'ilan-grid');
  const bos = document.getElementById('bos-mesaj');
  if (!grid) return;

  if (liste.length === 0) {
    grid.innerHTML = '';
    if (bos) bos.style.display = 'block';
    return;
  }
  if (bos) bos.style.display = 'none';

  grid.innerHTML = liste.map(ilan => {
    const tipClass = ilan.tip === 'Satılık' ? 'badge-satilik' : ilan.tip === 'Kiralık' ? 'badge-kiralik' : 'badge-ticari';
    const fiyatStr = ilan.tip === 'Kiralık'
      ? fiyatFormat(ilan.fiyat) + ' TL/ay'
      : fiyatFormat(ilan.fiyat) + ' TL';
    const fotolar = ilan.fotolar || [];
    const kapakFoto = fotolar[0];

    return `
      <div class="ilan-kart" onclick="modalAc(${ilan.id})">
        <div class="ilan-foto-wrap">
          ${kapakFoto
            ? `<img src="${kapakFoto}" alt="${ilan.baslik}" loading="lazy" />`
            : `<div class="no-foto"><span>🏠</span><span>Fotoğraf Yok</span></div>`
          }
          <span class="ilan-badge ${tipClass}">${ilan.tip}</span>
          <button class="fav-btn ${ilan.favori ? 'aktif' : ''}"
            onclick="favoriToggle(event, ${ilan.id})" title="Favorilere Ekle">
            ${ilan.favori ? '❤️' : '🤍'}
          </button>
          ${fotolar.length > 1 ? `<span class="foto-sayac">📷 ${fotolar.length}</span>` : ''}
        </div>
        <div class="ilan-body">
          <div class="ilan-fiyat">${fiyatStr}</div>
          <div class="ilan-baslik">${ilan.baslik}</div>
          <div class="ilan-konum">${ilan.konum}</div>
          <div class="ilan-detaylar">
            <span class="ilan-detay-item">📐 ${ilan.m2 || '—'} m²</span>
            <span class="ilan-detay-item">🛏 ${ilan.oda || '—'}</span>
            ${ilan.kat ? `<span class="ilan-detay-item">🏢 ${ilan.kat}</span>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');
}

// ---- FAVORİ ----
function favoriToggle(e, id) {
  e.stopPropagation();
  ilanlar = ilanlarıYukle();
  const ilan = ilanlar.find(i => i.id === id);
  if (ilan) {
    ilan.favori = !ilan.favori;
    ilanlarıKaydet(ilanlar);
    filtrele();
  }
}

// ---- FORMAT ----
function fiyatFormat(n) {
  return new Intl.NumberFormat('tr-TR').format(n);
}

// ---- MODAL ----
function modalAc(id) {
  ilanlar = ilanlarıYukle();
  const ilan = ilanlar.find(i => i.id === id);
  if (!ilan) return;
  aktifModalIlan = ilan;
  aktifGaleriIndex = 0;

  const fiyatStr = ilan.tip === 'Kiralık'
    ? fiyatFormat(ilan.fiyat) + ' TL/ay'
    : fiyatFormat(ilan.fiyat) + ' TL';
  const tipClass = ilan.tip === 'Satılık' ? 'badge-satilik' : ilan.tip === 'Kiralık' ? 'badge-kiralik' : 'badge-ticari';
  const fotolar = ilan.fotolar || [];

  const galerHTML = fotolar.length > 0
    ? `<div class="modal-foto-galeri">
        <img id="galeri-img" src="${fotolar[0]}" alt="${ilan.baslik}" />
        ${fotolar.length > 1 ? `
          <button class="galeri-nav galeri-prev" onclick="galeriGit(-1)">‹</button>
          <button class="galeri-nav galeri-next" onclick="galeriGit(1)">›</button>
          <span class="galeri-sayac" id="galeri-sayac">1 / ${fotolar.length}</span>` : ''}
      </div>`
    : `<div class="modal-foto-galeri" style="display:flex;align-items:center;justify-content:center;font-size:4rem;color:#aaa;">🏠</div>`;

  document.getElementById('modal-ici').innerHTML = `
    ${galerHTML}
    <div class="modal-ici-icerik">
      <span class="ilan-badge ${tipClass}" style="margin-bottom:0.5rem;display:inline-block">${ilan.tip}</span>
      <div class="modal-fiyat">${fiyatStr}</div>
      <div class="modal-baslik">${ilan.baslik}</div>
      <div class="modal-konum">📍 ${ilan.konum}</div>
      <div class="modal-ozellikler">
        ${ilan.m2 ? `<span class="modal-ozellik">📐 ${ilan.m2} m²</span>` : ''}
        ${ilan.oda && ilan.oda !== '—' ? `<span class="modal-ozellik">🛏 ${ilan.oda}</span>` : ''}
        ${ilan.kat ? `<span class="modal-ozellik">🏢 ${ilan.kat}</span>` : ''}
        ${ilan.yil ? `<span class="modal-ozellik">📅 ${ilan.yil}</span>` : ''}
      </div>
      ${ilan.aciklama ? `<div class="modal-aciklama"><strong>Açıklama:</strong><br/>${ilan.aciklama}</div>` : ''}
      <div class="modal-iletisim">
        <a href="tel:08501234567" class="btn-ara">📞 Hemen Ara</a>
        <a href="mailto:info@prestijemklak.com" class="btn-mesaj">✉️ E-posta Gönder</a>
      </div>
    </div>`;

  document.getElementById('modal-overlay').classList.add('aktif');
  document.body.style.overflow = 'hidden';
}

function galeriGit(yon) {
  const fotolar = aktifModalIlan.fotolar || [];
  if (fotolar.length < 2) return;
  aktifGaleriIndex = (aktifGaleriIndex + yon + fotolar.length) % fotolar.length;
  document.getElementById('galeri-img').src = fotolar[aktifGaleriIndex];
  document.getElementById('galeri-sayac').textContent = `${aktifGaleriIndex + 1} / ${fotolar.length}`;
}

function modalKapat() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('aktif');
  document.body.style.overflow = '';
  aktifModalIlan = null;
}

document.addEventListener('click', (e) => {
  const overlay = document.getElementById('modal-overlay');
  if (e.target === overlay) modalKapat();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') modalKapat(); });

// ---- FOTOĞRAF YÜKLEME ----
function fotolariIsle(e) {
  dosyalariEkle(Array.from(e.target.files));
}
function dragOver(e) {
  e.preventDefault();
  const alan = document.getElementById('foto-yukle-alan');
  if (alan) alan.classList.add('drag-over');
}
function dropFoto(e) {
  e.preventDefault();
  const alan = document.getElementById('foto-yukle-alan');
  if (alan) alan.classList.remove('drag-over');
  const dosyalar = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
  dosyalariEkle(dosyalar);
}
document.addEventListener('dragleave', () => {
  const alan = document.getElementById('foto-yukle-alan');
  if (alan) alan.classList.remove('drag-over');
});

function dosyalariEkle(dosyalar) {
  const maks = 10;
  const kalan = maks - yuklenenFotolar.length;
  if (kalan <= 0) { alert('En fazla 10 fotoğraf yükleyebilirsiniz.'); return; }
  dosyalar.slice(0, kalan).forEach(dosya => {
    const r = new FileReader();
    r.onload = (ev) => {
      yuklenenFotolar.push({ dataUrl: ev.target.result });
      onizlemeGuncelle();
    };
    r.readAsDataURL(dosya);
  });
  const input = document.getElementById('foto-input');
  if (input) input.value = '';
}

function onizlemeGuncelle() {
  const kapsayici = document.getElementById('foto-onizleme');
  if (!kapsayici) return;
  kapsayici.innerHTML = yuklenenFotolar.map((foto, idx) => `
    <div class="foto-onizleme-item ${idx === 0 ? 'kapak' : ''}">
      <img src="${foto.dataUrl}" alt="Fotoğraf ${idx + 1}" />
      <button class="foto-sil-btn" onclick="fotoyuSil(${idx})">×</button>
    </div>`).join('');
}

function fotoyuSil(idx) {
  yuklenenFotolar.splice(idx, 1);
  onizlemeGuncelle();
}

// ---- İLAN EKLE ----
function ilanEkle() {
  const baslik = document.getElementById('f-baslik').value.trim();
  const tip = document.getElementById('f-tip').value;
  const konum = document.getElementById('f-konum').value.trim();
  const fiyatRaw = document.getElementById('f-fiyat2').value;
  const m2 = document.getElementById('f-m2').value;
  const oda = document.getElementById('f-oda2').value;
  const kat = document.getElementById('f-kat').value.trim();
  const yil = document.getElementById('f-yil').value;
  const aciklama = document.getElementById('f-aciklama').value.trim();

  if (!baslik || !tip || !konum || !fiyatRaw) {
    alert('Lütfen zorunlu alanları (*) doldurun.');
    return;
  }

  ilanlar = ilanlarıYukle();
  const yeniIlan = {
    id: Date.now(),
    baslik, tip, konum,
    fiyat: parseInt(fiyatRaw),
    m2: m2 ? parseInt(m2) : null,
    oda: oda || '—',
    kat: kat || null,
    yil: yil ? parseInt(yil) : null,
    aciklama,
    fotolar: yuklenenFotolar.map(f => f.dataUrl),
    tarih: new Date().toISOString(),
    favori: false
  };

  ilanlar.unshift(yeniIlan);
  ilanlarıKaydet(ilanlar);

  const basari = document.getElementById('form-basari');
  if (basari) basari.style.display = 'block';
}

function formuSifirla() {
  ['f-baslik', 'f-tip', 'f-konum', 'f-fiyat2', 'f-m2', 'f-oda2', 'f-kat', 'f-yil', 'f-aciklama'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  yuklenenFotolar = [];
  const onizleme = document.getElementById('foto-onizleme');
  if (onizleme) onizleme.innerHTML = '';
  const input = document.getElementById('foto-input');
  if (input) input.value = '';
  const basari = document.getElementById('form-basari');
  if (basari) basari.style.display = 'none';
}
