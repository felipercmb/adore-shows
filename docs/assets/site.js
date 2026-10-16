(() => {
  const $ = (s) => document.querySelector(s);
  const siteBase = document.querySelector('meta[name="site-base"]')?.content || '';
  const sitePath = (path) => siteBase + path;
  const toggle = $('.menu-button');
  const menu = $('#nav-links');
  function closeMenu() { menu?.classList.remove('open'); toggle?.setAttribute('aria-expanded', 'false'); toggle?.setAttribute('aria-label', 'Abrir menu'); document.body.classList.remove('menu-open'); }
  toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; menu.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); document.body.classList.toggle('menu-open', open); });
  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  $('.nav')?.addEventListener('focusout', (event) => {
    if (toggle?.getAttribute('aria-expanded') === 'true' && event.relatedTarget !== toggle && !menu?.contains(event.relatedTarget)) closeMenu();
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
  window.matchMedia('(min-width: 801px)').addEventListener('change', (e) => { if(e.matches) closeMenu(); });
  const catalog = $('[data-catalog]');
  if (catalog) {
    const labels = {gospel:'Gospel',catolico:'Católico',sertanejo:'Sertanejo',forro:'Forró',pregadores:'Pregadores',axe:'Axé','samba-e-pagode':'Samba e pagode',mpb:'MPB',rock:'Rock',internacional:'Internacional'};
    const input = $('#artist-search'), grid = $('#artist-grid'), status = $('#catalog-status'), more = $('#load-more');
    let data, pending, genre = catalog.dataset.genre, limit = Number(catalog.dataset.limit), query = '', catalogUnavailable = false;
    const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
    const esc = (s) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function getData() { return data ? Promise.resolve(data) : (pending ||= fetch(sitePath('/assets/catalog.json')).then(r => { if (!r.ok) throw Error('catalog'); return r.json(); }).then(rows => { data = rows.map(a => ({...a, search: normalize(a.name)})); catalogUnavailable = false; return data; }).catch(err => { pending = null; catalogUnavailable = true; throw err; })); }
    const arrow = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M6 6h12v12"/></svg>';
    async function render() {
      status.textContent = 'Consultando catálogo…'; more.disabled = true;
      catalog.classList.remove('is-curated');
      catalog.classList.add('is-browsing');
      try {
        const rows = await getData();
        const result = rows.filter(a => (!genre || a.genres.includes(genre)) && a.search.includes(normalize(query)));
        grid.innerHTML = result.slice(0,limit).map(a => `<a class="artist-card" href="${sitePath('/'+encodeURIComponent(a.slug)+'/')}"><div class="artist-photo"><img src="${esc(sitePath(a.image))}" alt="${esc(a.name)}" width="640" height="800" loading="lazy" decoding="async"><span class="card-arrow">${arrow}</span></div><div class="artist-info"><h3>${esc(a.name)}</h3><small>${esc(labels[a.genre] || a.genre)}</small></div></a>`).join('');
        if (!result.length) {
          grid.innerHTML = '<div class="empty-state"><h3>Vamos encontrar outro caminho.</h3><p>Nenhum artista corresponde a essa busca neste segmento. Tente outro nome ou explore todos os artistas.</p><button type="button" class="button dark" id="reset-search">Limpar busca e filtros</button></div>';
          $('#reset-search').addEventListener('click', () => { input.value=''; query=''; genre=''; limit=12; updateFilters(); render(); input.focus(); });
        }
        status.textContent = `${result.length} ${result.length === 1 ? 'artista encontrado' : 'artistas'} · ${Math.min(limit,result.length)} em exibição`;
        more.hidden = result.length <= limit;
      } catch { status.textContent = 'Não foi possível carregar a busca. Recarregue a página ou navegue pelos segmentos.'; }
      more.disabled = false;
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches && document.body.dataset.motion !== 'off') { grid.animate([{opacity:.55,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'cubic-bezier(.16,1,.3,1)'}); }
    }
    function updateFilters() { catalog.querySelectorAll('[data-genre]').forEach(a => { const active = a.dataset.genre === genre; a.classList.toggle('active',active); if(active) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current'); }); }
    input.addEventListener('input', () => { query=input.value.trim(); limit=12; render(); });
    catalog.querySelectorAll('a[data-genre]').forEach(a => a.addEventListener('click', e => { if(e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || catalog.dataset.genre || catalogUnavailable) return; e.preventDefault(); genre=a.dataset.genre; limit=12; updateFilters(); render(); }));
    more.addEventListener('click', async () => { const previous=grid.children.length; limit+=12; await render(); grid.children[previous]?.focus({preventScroll:true}); });
    input.addEventListener('focus', () => { getData().catch(() => {}); },{once:true});
  }
  const form = $('#event-form');
  if (form) {
    const params = new URLSearchParams(location.search); const artist = params.get('artista');
    if (artist) $('#artist').value = artist.slice(0,150);
    if(params.get('tipo') === 'prefeitura') $('#event-type').value = 'Festa municipal ou festival';
    else if(params.get('segmento') === 'gospel') { $('#event-type').value = 'Evento gospel ou encontro de louvor'; if(!artist) $('#artist').value = 'Gostaria de sugestões de artistas gospel'; }
    const today = new Date(); const local = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    $('#date').min = local;
    const requiredTextFields = [[$('#name'), 'Informe seu nome.'], [$('#city'), 'Informe a cidade e o estado do evento.']];
    requiredTextFields.forEach(([field]) => field.addEventListener('input', () => field.setCustomValidity('')));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      requiredTextFields.forEach(([field, message]) => field.setCustomValidity(field.value.trim() ? '' : message));
      if(!form.reportValidity()) return;
      const values = new FormData(form), value = key => String(values.get(key)||'').trim();
      const date = value('date') ? value('date').split('-').reverse().join('/') : 'A definir';
      const message = ['Olá, equipe Adore Shows! Gostaria de consultar uma atração para meu evento.', '', `Nome: ${value('name')}`, value('organization') ? `Prefeitura, empresa ou instituição: ${value('organization')}` : '', `Artista ou estilo: ${value('artist') || 'Gostaria de sugestões'}`, `Cidade/UF: ${value('city')}`, `Data: ${date}`, `Tipo de evento: ${value('type')}`, value('message') ? `Mais informações: ${value('message')}` : ''].filter(Boolean).join('\n');
      const result = $('#form-result'); $('#whatsapp-request').href = 'https://wa.me/5562985450777?text='+encodeURIComponent(message); result.hidden=false; result.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'nearest'}); $('#whatsapp-request').focus({preventScroll:true});
    });
    form.addEventListener('input', () => { $('#form-result').hidden=true; });
    $('#form-fields').disabled = false;
  }
})();
