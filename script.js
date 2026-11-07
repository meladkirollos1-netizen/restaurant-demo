/* Tell the CSS that JS is running (enables the scroll-reveal styles) */
document.documentElement.classList.add('js');

/* ===== 0. Settings: edit only this line =====
   WhatsApp number in international format, digits only (Egypt: 20 + number without the leading 0). */
const WHATSAPP_NUMBER = "201206617687";

document.querySelectorAll('[data-wa]').forEach((a) => { a.href = `https://wa.me/${WHATSAPP_NUMBER}`; });
document.querySelectorAll('[data-tel]').forEach((a) => {
  a.href = `tel:+${WHATSAPP_NUMBER}`;
  if (/^20\d{10}$/.test(WHATSAPP_NUMBER)) {
    const l = '0' + WHATSAPP_NUMBER.slice(2);
    a.textContent = `${l.slice(0, 4)} ${l.slice(4, 7)} ${l.slice(7)}`;
  }
});

/* ===== 1. Menu data: edit, add or remove dishes here =====
   cat: grills | mains | starters | drinks | desserts   hot: true = shows in "popular" */
const IMG = (id) => `https://images.unsplash.com/photo-${id}?w=600&q=70`;
const DISHES = [
  { cat: 'grills',   name: 'مشاوي مشكلة',        desc: 'كفتة وكباب وريش وفراخ مع أرز وسلطة.',   price: 320, img: IMG('1555939594-58d7cb561ad1'), hot: true },
  { cat: 'grills',   name: 'كفتة مشوية',         desc: 'كفتة بلدي بالبقدونس والبصل على الفحم.', price: 190, img: IMG('1504674900247-0877df9cc836'), hot: true },
  { cat: 'grills',   name: 'ريش ضاني',           desc: 'ريش طرية متبلة، تقدم مع خضار مشوي.',    price: 380, img: IMG('1544025162-d76694265947') },
  { cat: 'mains',    name: 'كبسة لحم',           desc: 'أرز بهارات مع لحم ضاني ومكسرات.',       price: 210, img: IMG('1512058564366-18510be2db19'), hot: true },
  { cat: 'mains',    name: 'فراخ محشية بالفريك', desc: 'نصف فرخة محمّرة بحشو الفريك.',          price: 175, img: IMG('1598103442097-8b74394b95c6') },
  { cat: 'starters', name: 'حمص بالطحينة',       desc: 'حمص ناعم بزيت الزيتون والبابريكا.',     price: 60,  img: IMG('1577805947697-89e18249d767') },
  { cat: 'starters', name: 'سلطة تبولة',         desc: 'بقدونس وطماطم وبرغل بعصير الليمون.',    price: 70,  img: IMG('1540189549336-e6e99c3679fe') },
  { cat: 'drinks',   name: 'ليمون بالنعناع',     desc: 'مثلج ومنعش، يتقدم في كوب كبير.',        price: 45,  img: IMG('1544145945-f90425340c7e') },
  { cat: 'drinks',   name: 'قهوة تركي',          desc: 'قهوة مظبوطة تتقدم مع ماء.',             price: 40,  img: IMG('1495474472287-4d71bcdd2085') },
  { cat: 'desserts', name: 'كنافة بالقشطة',      desc: 'كنافة ساخنة بالقشطة والشربات.',         price: 85,  img: IMG('1551024601-bec78aea704b'), hot: true },
  { cat: 'desserts', name: 'أم علي',             desc: 'بالمكسرات والقشطة تخرج من الفرن سخنة.', price: 70,  img: IMG('1565958011703-44f9829ba187') }
];

/* ===== 2. Render dish cards ===== */
const fmtPrice = (n) => `${n.toLocaleString('ar-EG')} ج.م`;   // Arabic digits + EGP

function dishCard(d, showBadge) {
  return `<article class="dish">
    <div class="dish-img"><img src="${d.img}" alt="${d.name}" loading="lazy">
      ${showBadge ? '<span class="badge"><i class="fa-solid fa-fire"></i> الأكثر طلبًا</span>' : ''}</div>
    <div class="dish-body">
      <div class="dish-top"><h3>${d.name}</h3><span class="price">${fmtPrice(d.price)}</span></div>
      <p>${d.desc}</p>
    </div></article>`;
}

const menuGrid = document.getElementById('menuGrid');
const tabs = document.querySelectorAll('.tab');

// Show only the dishes of one category
function showCategory(cat) {
  menuGrid.innerHTML = DISHES.filter((d) => d.cat === cat).map((d) => dishCard(d, d.hot)).join('');
}

tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((t) => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  showCategory(tab.dataset.cat);
}));

showCategory('grills');                                   // first tab on load
document.getElementById('popularGrid').innerHTML =        // "popular" section: dishes with hot: true
  DISHES.filter((d) => d.hot).slice(0, 3).map((d) => dishCard(d, true)).join('');

/* ===== 3. Mobile menu ===== */
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => menuBtn.setAttribute('aria-expanded', nav.classList.toggle('open')));
nav.addEventListener('click', (e) => {                    // close after choosing a link
  if (e.target.closest('a')) { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
});

/* ===== 4. Subtle scroll reveal ===== */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));      // old browsers: just show everything
}

/* ===== 5. Reservation form validation ===== */
const form = document.getElementById('reserveForm');
const formMsg = document.getElementById('formMsg');
const toEnglishDigits = (s) => s.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\s|-/g, '');
// Accept 01012345678, +201012345678, 00201012345678 and 201012345678
const normalizePhone = (s) => toEnglishDigits(s).replace(/^(\+20|0020|20)(?=1[0125]\d{8}$)/, '0');

// No past dates
const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
form.elements.date.min = today;

function setError(field, msg) {
  field.classList.toggle('invalid', Boolean(msg));
  field.parentElement.querySelector('.err').textContent = msg;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formMsg.textContent = '';
  const { name, phone, guests, date, time } = form.elements;
  let valid = true;
  const check = (field, ok, msg) => { setError(field, ok ? '' : msg); if (!ok) valid = false; };

  check(name, name.value.trim().length >= 3, 'اكتب اسمك (٣ أحرف على الأقل).');
  check(phone, /^01[0125][0-9]{8}$/.test(normalizePhone(phone.value)), 'اكتب رقم موبايل مصري صحيح من ١١ رقم.');
  const g = Number(guests.value);
  check(guests, Number.isInteger(g) && g >= 1 && g <= 20, 'عدد الأشخاص من ١ إلى ٢٠.');
  const dateOk = Boolean(date.value) && date.value >= today;
  check(date, dateOk, 'اختر تاريخًا من اليوم فصاعدًا.');

  // Friday opens at 1 PM, other days at 12 PM; closing for bookings 11:30 PM
  const isFriday = dateOk && new Date(date.value + 'T00:00:00').getDay() === 5;
  const openFrom = isFriday ? '13:00' : '12:00';
  let timeOk = Boolean(time.value) && time.value >= openFrom && time.value <= '23:30';
  let timeMsg = isFriday ? 'الجمعة نفتح من ١ ظهرًا حتى ١١:٣٠ مساءً.' : 'اختر وقتًا بين ١٢ ظهرًا و١١:٣٠ مساءً.';
  if (timeOk && date.value === today && time.value <= new Date().toTimeString().slice(0, 5)) {
    timeOk = false;
    timeMsg = 'اختر وقتًا لم يفت بعد.';
  }
  check(time, timeOk, timeMsg);

  if (!valid) return;

  // Build a ready-made WhatsApp message with the reservation details
  const text = [
    'السلام عليكم، أريد حجز طاولة.',
    `الاسم: ${name.value.trim()}`,
    `الموبايل: ${normalizePhone(phone.value)}`,
    `عدد الأشخاص: ${g}`,
    `التاريخ: ${date.value}`,
    `الوقت: ${time.value}`,
  ].join('\n');
  const link = document.createElement('a');
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  link.target = '_blank';
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();

  formMsg.textContent = `شكرًا ${name.value.trim()}! جاري فتح واتساب لإرسال طلب الحجز. إن لم يفتح، اضغط زر واتساب الأخضر.`;
  form.reset();
});
form.addEventListener('input', (e) => setError(e.target, ''));   // clear error while typing

/* ===== 6. A photo that fails to load never shows a broken-image icon ===== */
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') e.target.style.visibility = 'hidden';
}, true);
