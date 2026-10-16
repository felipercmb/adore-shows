"""Inline wave contours: no image requests, filters, or frame-by-frame scripts."""
from html import escape
from math import sin, cos, pi


def wave_path(radius, phase=0):
    points = []
    for i in range(361):
        angle = 2 * pi * i / 360
        # A modulated wave around the whole source, not a geometric circle.
        amplitude = 3.2 + 1.5 * sin(3 * angle + phase)
        r = radius + amplitude * sin(18 * angle + phase) + 1.5 * sin(7 * angle - phase)
        points.append(f'{120 + r * cos(angle):.2f},{120 + r * sin(angle):.2f}')
    return 'M' + 'L'.join(points) + 'Z'


def sound_cta(label_intro='Vamos fazer', label_main='um show?', variant=''):
    idle = ''.join(f'<svg class="radio-orbit" viewBox="0 0 240 240" fill="none"><path d="{wave_path(r,p)}"/></svg>' for r,p in [(94,0),(104,1.7),(114,3.4)])
    bursts = ''.join(f'<span class="radio-burst"><svg viewBox="0 0 240 240" fill="none"><path d="{wave_path(96,i*1.4)}"/></svg></span>' for i in range(4))
    return f'''<a class="round-cta sound-cta{" " + escape(variant, quote=True) if variant else ""}" href="/contrate/"><span class="sound-halo" aria-hidden="true"><span class="sound-idle">{idle}</span><span class="sound-propagation">{bursts}</span></span><span class="sound-label"><span class="sound-label-intro">{escape(label_intro)}</span><span class="sound-label-main">{escape(label_main)}</span></span><span class="cta-arrow" aria-hidden="true"><svg class="sound-arrow" viewBox="0 0 40 40" focusable="false"><path d="M18.4 33V15.5C15.9 18.1 12.9 20.1 9.5 21.4V17.7C13.5 15.7 17.2 12.1 20 7.5C22.8 12.1 26.5 15.7 30.5 17.7V21.4C27.1 20.1 24.1 18.1 21.6 15.5V33Z"/></svg></span></a>'''
