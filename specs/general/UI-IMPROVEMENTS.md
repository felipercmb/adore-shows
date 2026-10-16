# Conferência do site Adore Shows

Data: 16/10/2026. Site: https://felipercmb.github.io/adore-shows/

## Resultado

A conferência não encontrou páginas ou arquivos internos ausentes. As falhas funcionais identificadas em navegação e validação foram corrigidas, mantendo a composição visual. A indexação continua desativada, conforme a configuração de prévia preservada na migração.

## Problemas críticos

Nenhum bloqueio crítico encontrado nos fluxos verificados.

## Correções realizadas

| Área | Problema encontrado | Correção e verificação |
| --- | --- | --- |
| Menu mobile | Tab saía para o conteúdo mantendo o menu aberto e a rolagem bloqueada | O menu fecha ao foco sair; testado em 390 px, preservando Tab entre links e Escape |
| Navegação sem JavaScript | Links ficavam ocultos no celular e o botão não funcionava | Fallback noscript mantém links visíveis no fluxo; layout verificado em uma representação local sem scripts com conteúdo noscript exposto |
| Formulário | Nome/cidade com apenas espaços geravam pedido vazio | Validação após trim, com mensagens em português; valores vazios/espaços bloqueiam e valores válidos permitem preparar o pedido |
| Falha no catálogo | A mensagem recomendava categorias, mas os links repetiam o carregamento com erro | Links passam a navegar para páginas estáticas após falha; testado com resposta 503 simulada localmente |
| Foco de teclado | Contraste baixo em superfícies claras | Verde profundo no claro e ciano no escuro; pares de cores calculados, com pelo menos 4,65:1 nos contextos alterados |
| Busca | Placeholder com contraste de 4,18:1 | Cor ajustada para 5,35:1 sobre o fundo da busca |
| Textos de categorias | Flexões inadequadas em três segmentos | “Artistas católicos”, “artistas internacionais” e “pregadores” |

## Evidências de conferência

- 519 arquivos HTML, 500 artistas, 517 URLs do sitemap e 23.696 referências HTML validados localmente; nenhum destino interno/fragmento/arquivo ausente.
- Crawl da publicação: 1.044 URLs, sendo 1.043 respostas 200 e uma 404 esperada para uma rota inexistente; zero falhas inesperadas.
- Títulos, descrições, H1, atributos alt, canonical, Open Graph, JSON-LD e prefixo /adore-shows/ conferidos. A ausência de alt foi verificada; isso não certifica a qualidade de todas as descrições.
- Busca sem acentos, estado vazio, limpar filtros, filtro Rock com 16 resultados, carregar mais e foco no primeiro item novo conferidos em navegador.
- Formulário municipal preenche o tipo correto, impede data passada e prepara link WhatsApp codificado com nome, cidade e data. Nenhuma mensagem foi enviada.
- Controle de efeitos sincroniza os três botões; regras de redução de movimento e pausa fora da tela/aba revisadas no código.
- Home a 320, 390, 820 e 1280 px; página institucional a 320 px; formulário a 320/390 px. Nenhum transbordamento horizontal nas páginas e estados medidos.
- FAQ abre e fecha pelo controle nativo; páginas de artista e navegação institucional abriram normalmente.
- Nenhum erro de console observado no site publicado durante os fluxos normais. O erro 503 no teste local é deliberado.
- Sintaxe JavaScript/Python e referências/hashes de ativos verificados após o build.

## Configurações e oportunidades restantes

### Indexação no Google

O site mantém meta noindex,nofollow e robots.txt bloqueado, pois ainda é uma publicação de apresentação. Isso impede sua indexação normal. Para usar o endereço do GitHub como destino definitivo de busca, será necessário liberar a indexação conscientemente. O domínio adoreshows.com continua independente.

### Otimização futura de fontes

As duas fontes principais em TTF somam cerca de 633 KiB sem compressão de transporte. Uma futura conversão a WOFF2 pode reduzir transferência. A abertura usa imagem de aproximadamente 208 KiB, catálogo em WebP com lazy loading, e CSS/JS totalizam cerca de 93 KiB sem compressão. Não foi executado Lighthouse nem medição de Core Web Vitals em rede móvel.

## Limites

Conferência funcional e estrutural no navegador disponível, com larguras simuladas; não substitui testes em aparelhos físicos ou certificação WCAG. Links de terceiros foram inventariados, mas não foi verificada a reprodução de cada vídeo do YouTube, a entrega de mensagens ou a posse das contas de contato. Não houve revisão factual individual das 500 biografias nem auditoria de segurança completa.
