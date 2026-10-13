(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const menuToggle = $('#menuToggle');
  const primaryNav = $('#primaryNav');
  const toast = $('#toast');
  let toastTimer;

  $('#currentYear').textContent = new Date().getFullYear();

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3600);
  }

  function scrollToTarget(selector) {
    const target = $(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    primaryNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }

  $$('[data-scroll]').forEach(button => button.addEventListener('click', () => scrollToTarget(button.dataset.scroll)));
  $$('#primaryNav a').forEach(link => link.addEventListener('click', () => {
    primaryNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }));

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    primaryNav.classList.toggle('open', open);
  });

  // Entirely fictional entries for demonstrating the search interface. Never treat as live stock.
  const demoListings = [
    { name: 'Demo Community Blood Centre', area: 'Goregaon, Mumbai', city: 'mumbai', group: 'O+', component: 'Whole blood', distance: '2.4 km (illustrative)', hours: 'Sample listing' },
    { name: 'Sample City Hospital', area: 'Andheri West, Mumbai', city: 'mumbai', group: 'A+', component: 'Red cells', distance: '4.1 km (illustrative)', hours: 'Sample listing' },
    { name: 'Prototype Regional Care Centre', area: 'Malad, Mumbai', city: 'mumbai', group: 'B+', component: 'Platelets', distance: '5.8 km (illustrative)', hours: 'Sample listing' },
    { name: 'Example Medical Centre', area: 'Bandra, Mumbai', city: 'mumbai', group: 'AB-', component: 'Plasma', distance: '8.3 km (illustrative)', hours: 'Sample listing' },
    { name: 'Demo Neighbourhood Blood Bank', area: 'Goregaon, Mumbai', city: 'mumbai', group: 'O-', component: 'Red cells', distance: '3.6 km (illustrative)', hours: 'Sample listing' },
    { name: 'Prototype Community Hospital', area: 'Powai, Mumbai', city: 'mumbai', group: 'B-', component: 'Whole blood', distance: '10.2 km (illustrative)', hours: 'Sample listing' }
  ];

  const results = $('#searchResults');
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

  function renderResults(matches, city, group, component) {
    results.hidden = false;
    const queryDescription = [city || 'any area', group === 'all' ? 'any group' : group, component === 'all' ? 'any component' : component].join(' · ');
    const cards = matches.map(item => `
      <article class="result-card">
        <div>
          <h4>${esc(item.name)}</h4>
          <div class="result-meta">${esc(item.area)}<br>${esc(item.distance)} · ${esc(item.hours)}</div>
          <div class="result-tags"><span class="result-tag">${esc(item.component)}</span><span class="result-tag">DEMO ONLY</span></div>
        </div>
        <span class="blood-type" aria-label="Blood group ${esc(item.group)}">${esc(item.group)}</span>
      </article>`).join('');

    results.innerHTML = `
      <div class="results-header"><strong>${matches.length} demo ${matches.length === 1 ? 'listing' : 'listings'}</strong><span>${esc(queryDescription)}</span></div>
      <div class="demo-alert"><strong>Illustrative data only.</strong> These are fictional sample listings. No stock, eligibility, distance or availability has been verified.</div>
      ${cards || '<p class="result-empty">No matching demo listings. Try another blood group, component or area.</p>'}
      <p class="form-footnote">For an actual blood requirement, contact a licensed blood bank or hospital directly. This website is not live.</p>`;
  }

  $('#bloodSearchForm').addEventListener('submit', event => {
    event.preventDefault();
    const city = $('#cityInput').value.trim();
    const group = $('#bloodGroup').value;
    const component = $('#component').value;
    const cityLower = city.toLowerCase();

    let matches = demoListings.filter(item => {
      const groupMatch = group === 'all' || item.group === group;
      const componentMatch = component === 'all' || item.component === component;
      const cityMatch = !cityLower || item.area.toLowerCase().includes(cityLower) || item.city.includes(cityLower);
      return groupMatch && componentMatch && cityMatch;
    });

    // When the location is another area/city, don't misleadingly show Mumbai results.
    renderResults(matches, city, group, component);
    results.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  });

  $('#donorForm').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    event.currentTarget.hidden = true;
    $('#donorSuccess').hidden = false;
    showToast('Demo form complete — nothing was sent or stored online.');
  });

  $('#partnerForm').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    event.currentTarget.hidden = true;
    $('#partnerSuccess').hidden = false;
    showToast('Prototype complete — no partner details were sent.');
  });
})();
