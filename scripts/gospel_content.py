"""Gospel booking content for the corresponding artist catalogue category."""
from html import escape

GOSPEL_FAQ = [
    ('Como contratar um cantor gospel para minha igreja ou evento?', 'Escolha um artista no catálogo e envie a data, a cidade e o formato do encontro. A Adore consulta a disponibilidade e informa as condições da apresentação. Você também pode conversar com a equipe antes de definir um nome.'),
    ('Quanto custa contratar um show gospel?', 'O valor varia conforme o artista, a data, a cidade e as necessidades da apresentação. Para receber uma proposta, informe os detalhes do evento e, se possível, a faixa de investimento prevista. Confira com a equipe quais itens estão incluídos.'),
    ('A Adore atende congressos e eventos de igrejas?', 'Sim. Atendemos igrejas, produtores e organizadores de congressos, encontros de louvor, festivais e celebrações. Consulte os artistas gospel do catálogo e a disponibilidade para a data do seu evento.'),
    ('Posso consultar artistas gospel para eventos fora de Goiânia?', 'Sim. Nossa agência fica em Goiânia, Goiás, e atende contratantes de todo o Brasil. Informe a cidade e o estado do evento para consultar as condições da apresentação e do deslocamento.'),
    ('Com quanto tempo de antecedência devo consultar um artista?', 'Inicie a conversa assim que houver uma previsão de data e cidade. As agendas variam entre os artistas, e a disponibilidade precisa ser consultada para cada evento. Mesmo com a data próxima, a equipe pode verificar as opções.')
]

def gospel_guide(icon):
    steps = [
        ('Conte o que está planejando', 'Informe a data, a cidade e o formato: congresso, programação da igreja, festival ou outro evento. Público estimado e faixa de investimento também ajudam.'),
        ('Escolha uma voz para o seu público', 'Já sabe quem quer contratar? Envie o nome. Se ainda estiver escolhendo, conte quais músicas e referências fazem sentido para a sua comunidade.'),
        ('Consulte agenda e condições', 'A equipe verifica a disponibilidade do artista e apresenta as condições de contratação para a data e a cidade informadas.'),
        ('Alinhe os próximos passos', 'Com a proposta em mãos, confira valores, prazos, deslocamento e necessidades da apresentação. A equipe orienta os detalhes para seguir com a contratação.')
    ]
    return f'''<section class="section gospel-guide" aria-labelledby="gospel-guide-title"><div class="wrap process"><div class="process-intro"><h2 id="gospel-guide-title">Como contratar um show gospel.</h2><p>A escolha do artista é o começo. Estas informações ajudam a transformar sua ideia em uma proposta para o evento.</p><a class="button dark" href="/contrate/?segmento=gospel">Solicitar proposta {icon('diagonal')}</a></div><ol class="steps">{''.join(f'<li><div><h3>{escape(t)}</h3><p>{escape(d)}</p></div></li>' for t,d in steps)}</ol></div></section><section class="section gospel-formats"><div class="wrap"><h2>Um propósito para cada encontro.</h2><div class="gospel-format-list"><article><h3>Congressos e encontros de louvor</h3><p>Compartilhe o tema, a programação e o perfil dos participantes. Essas informações ajudam a consultar uma atração alinhada ao encontro.</p></article><article><h3>Programação de igrejas</h3><p>Conte como será a celebração, o espaço disponível e a data desejada. A conversa começa pelo que faz sentido para a sua comunidade.</p></article><article><h3>Festivais e eventos gospel</h3><p>Informe a cidade, o público estimado e os horários previstos. Consulte cantores e bandas gospel para compor a programação.</p></article></div></div></section>'''

def gospel_faq():
    return '<section class="faq section gospel-faq"><div class="wrap faq-grid"><h2>Dúvidas sobre shows gospel.</h2><div>' + ''.join(f'<details><summary>{escape(q)}</summary><p>{escape(a)}</p></details>' for q,a in GOSPEL_FAQ) + '</div></div></section>'
