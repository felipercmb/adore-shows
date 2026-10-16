# Adore Shows

Site da Adore Shows publicado no GitHub Pages:

**https://felipercmb.github.io/adore-shows/**

O projeto reúne a apresentação institucional, catálogo de 500 artistas, páginas por segmento e um formulário que prepara o pedido de contratação no WhatsApp. O conteúdo e a identidade visual foram preservados na migração de hospedagem.

## Publicação

O GitHub Pages publica a pasta `docs/` da branch `main`. Os arquivos já estão gerados. Novos commits nessa branch atualizam a publicação automaticamente.

- `docs/`: HTML publicado, imagens, fontes, CSS e JavaScript.
- `scripts/`: gerador estático em Python e módulos de conteúdo.
- `data/artists.json`: catálogo utilizado pelo gerador.

Não há backend, banco de dados ou etapa de instalação de dependências.

## Atualizar o site

Edite os módulos em `scripts/`, o catálogo em `data/` ou os estilos e scripts em `docs/assets/`. Em seguida:

```sh
python3 scripts/build.py
git add scripts data docs
git commit -m "Atualizar site"
git push
```

O build preserva os ativos de `docs/assets/`; não exclua essa pasta.

O endereço usado nos metadados e o prefixo das rotas vêm de `SITE_URL`. Por padrão, o site usa o endereço GitHub Pages acima. Para visualizar localmente na raiz:

```sh
SITE_URL=http://localhost:4175 python3 scripts/build.py
python3 -m http.server 4175 --directory docs
```

Antes de publicar, gere novamente com `python3 scripts/build.py` para restaurar os endereços do GitHub Pages.

## Indexação e domínio

Esta publicação preserva o `noindex` da versão de apresentação anterior. O domínio oficial `adoreshows.com` continua independente. Após definir o endereço definitivo para busca, a opção `--production` libera a indexação, usando o mesmo `SITE_URL` configurado. A página 404 permanece com `noindex`.

## Conteúdo

Imagens, informações do catálogo, marca e contatos foram obtidos do [site oficial da Adore Shows](https://adoreshows.com/). A presença de um artista no catálogo não implica exclusividade ou disponibilidade imediata. As licenças das fontes estão em `docs/assets/fonts/`.

O formulário prepara a mensagem no navegador. O visitante decide enviá-la no WhatsApp; os dados não são armazenados por este site.
