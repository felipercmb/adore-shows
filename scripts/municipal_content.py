"""A municipal concert invitation, with sound contours generated once at build time."""
from math import cos, sin, pi


def stage_contour(phase):
    points = []
    for i in range(121):
        angle = 2 * pi * i / 120
        wave = 5 * sin(16 * angle + phase) + 2.5 * sin(7 * angle - phase)
        points.append(f'{260 + (224 + wave) * cos(angle):.2f},{310 + (273 + wave) * sin(angle):.2f}')
    return 'M' + 'L'.join(points) + 'Z'


def municipal_feature(icon):
    waves = ''.join(f'<svg class="municipal-wave" viewBox="0 0 520 620" fill="none"><path d="{stage_contour(i * 1.7)}"/></svg>' for i in range(3))
    return f'''<section class="municipal-feature" id="prefeituras" aria-labelledby="municipal-title">
<div class="wrap municipal-layout">
<div class="municipal-copy">
<h2 id="municipal-title"><span class="municipal-topic">Shows para prefeituras</span><span class="municipal-headline">A cidade inteira.<br>No mesmo refrão.</span></h2>
<p>Aniversário da cidade, festival, festa tradicional. A Adore ajuda sua prefeitura a encontrar o artista que vai reunir o público e fazer parte dessa história.</p>
<p class="municipal-detail">Sertanejo, forró, gospel, samba e muito mais. Conte a data, a cidade e o perfil do evento. Nossa equipe consulta a agenda e apresenta as condições de contratação.</p>
<div class="municipal-actions"><a class="button municipal-booking" href="/contrate/?tipo=prefeitura"><span>Planejar o show da prefeitura</span><span class="municipal-button-sound" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path class="municipal-sound-line" d="M2 16h4l3-8 4 16 4-21 4 26 3-13h6" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/></svg></span></a><a class="text-link" href="/artistas/">Conhecer o catálogo {icon('arrow')}</a></div>
<button class="motion-toggle municipal-motion-toggle" type="button" aria-label="Reduzir efeitos" aria-pressed="false" hidden>Efeitos: ativados</button>
</div>
<figure class="municipal-stage">
<div class="municipal-sound-field" aria-hidden="true">{waves}</div>
<div class="municipal-photo-frame"><img src="/assets/hero/gusttavo-lima.webp" alt="Gusttavo Lima no palco, artista do catálogo da Adore Shows" width="984" height="640" loading="lazy"></div>
<figcaption><span>Gusttavo Lima</span><span>Artista do catálogo Adore</span></figcaption>
</figure>
</div>
</section>'''
