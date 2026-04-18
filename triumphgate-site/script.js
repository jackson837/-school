
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));


const navToggle = $('.nav-toggle');
const navList = $('#nav-list');
navToggle?.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});


$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start'});
      navList.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});


const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{ threshold: 0.12 });
$$('.reveal').forEach(el => observer.observe(el));

function animateCount(el){
  const target = Number(el.dataset.count || 0);
  const duration = 1200;
  const start = performance.now();
  function step(ts){
    const p = Math.min((ts - start)/duration, 1);
    el.textContent = Math.floor(p * target).toLocaleString();
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
$$('.stat-num').forEach(animateCount);

const backToTop = $('#backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 600);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

function handleForm(formId, msgId, storeKey){
  const form = document.getElementById(formId);
  const msg = document.getElementById(msgId);
  form?.addEventListener('submit', e => {
    e.preventDefault();
    if(!form.checkValidity()){
      msg.textContent = 'Please complete all required fields.';
      msg.style.color = 'crimson';
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    
    const prev = JSON.parse(localStorage.getItem(storeKey) || '[]');
    prev.push({ ...data, ts: new Date().toISOString() });
    localStorage.setItem(storeKey, JSON.stringify(prev));
    form.reset();
    msg.textContent = 'Thank you! Your submission has been received.';
    msg.style.color = 'green';
    setTimeout(()=> msg.textContent = '', 4500);
  });
}
handleForm('applyForm', 'applyMsg', 'tms_applications');
handleForm('contactForm', 'contactMsg', 'tms_contacts');

const themeBtn = $('#themeToggle');
const PREF_KEY = 'tms_theme';
function applyTheme(t){
  document.documentElement.classList.toggle('dark', t === 'dark');
}
function getPref(){
  return localStorage.getItem(PREF_KEY) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}
applyTheme(getPref());
themeBtn?.addEventListener('click', () => {
  const next = getPref() === 'dark' ? 'light' : 'dark';
  localStorage.setItem(PREF_KEY, next);
  applyTheme(next);
});

$('#year').textContent = new Date().getFullYear();
