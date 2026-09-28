# 🏛️ KEYHOUSE PROPERTIES

**A plataforma imobiliária premium de Moçambique.** Anúncios verificados, contactos protegidos, visitas confirmadas.

Este guia explica, passo a passo, como pôr o site no ar — **sem instalar nada no computador**.

---

## ✅ Estado actual: publicado

- **Site:** https://joaquimeugeniomachava-maker.github.io/KEYHOUSE-MZ/
- **Repositório:** https://github.com/joaquimeugeniomachava-maker/KEYHOUSE-MZ
- **Como está montado:** o projecto fica na pasta **`KEYHOUSE/`**. O ficheiro `.github/workflows/publicar.yml` (na raiz) compila dentro dessa pasta (`working-directory: KEYHOUSE`) e publica `KEYHOUSE/dist`. **Settings → Pages → Source = GitHub Actions.**

### 🔄 Actualizar o site (sempre assim, sem código)
1. Descarrega o ZIP novo e extrai-o (botão direito → **Extrair Tudo**). Entra na pasta até veres `public`, `src`, `index`, `package`.
2. Abre **https://github.com/joaquimeugeniomachava-maker/KEYHOUSE-MZ/upload/main/KEYHOUSE**. No topo tem de aparecer **`KEYHOUSE-MZ / KEYHOUSE /`** (desta vez **dentro** da pasta).
3. **Ctrl + A** na pasta extraída → arrasta para a página → ignora o aviso *"This file is hidden"* → marca **Commit directly to the main branch** → **Commit changes**.
4. Separador **Actions**: a execução nova fica ✅ verde em cerca de 1 minuto. No site, carrega em **Ctrl + F5** para ver a versão nova.

> Os ficheiros com o mesmo nome são substituídos; os novos são acrescentados. O aviso amarelo *"Node.js 20 is deprecated"* numa execução verde é só um aviso: ignora.

---

## 🧭 Onde publicar — escolha rápida

| Opção | Quando usar | Descompactar o ZIP? | Tempo |
|---|---|---|---|
| **GitHub Pages** | Já tens GitHub → publicar a demonstração **hoje** | ❌ Não é preciso | 10 min |
| **Vercel Drop** | Alternativa rápida: arrastar o ZIP e pronto | ❌ Não é preciso | 5 min |
| **Cloudflare Pages** | **Lançamento comercial**: repositório privado, tráfego ilimitado, servidor em Maputo | ✅ Sim | 15 min |

> ℹ️ O GitHub Pages grátis exige **repositório público** e não se destina a negócios com transacções comerciais; o plano grátis da Vercel é **só para uso não comercial**. Para a demonstração estão perfeitos. Para o lançamento comercial, usa o **Cloudflare Pages**.

---

## 🇵🇹 O GitHub aparece em português?

O GitHub **não tem versão oficial em português** — é o teu navegador (Chrome/Edge) que está a traduzir a página. Neste guia, cada botão aparece assim: **Nome em português** (*nome original em inglês*).

> 💡 **Antes de colar código no GitHub, desliga a tradução** (ícone de tradução na barra de endereço → **Mostrar original**). O tradutor pode estragar o texto do ficheiro.

| Inglês (original) | Português (tradução do navegador) |
|---|---|
| New repository | Novo repositório |
| Repository name | Nome do repositório |
| Public / Private | Público / Privado |
| Create repository | Criar repositório |
| uploading an existing file | enviando / carregando um arquivo existente |
| Add file → Upload files | Adicionar arquivo → Enviar / Carregar arquivos |
| Add file → Create new file | Adicionar arquivo → Criar novo arquivo |
| Commit changes | Confirmar alterações |
| Commit message | Mensagem de confirmação (pode ficar como está: qualquer texto serve) |
| Extended description | Descrição detalhada (opcional: deixar vazia) |
| Commit directly to the `main` branch | Fazer commit diretamente no branch main ✅ **escolher esta** |
| Create a new branch for this commit and start a pull request | Criar um novo branch para este commit e iniciar uma solicitação de pull ⛔ **não usar** |
| Settings | Configurações |
| Pages | Páginas |
| Build and deployment → Source | Compilação e implantação → Fonte / Origem |
| GitHub Actions (opção da Fonte) | pode aparecer traduzido como «Ações do GitHub» |
| Actions | Ações |
| Run workflow | Executar fluxo de trabalho |
| Visit site | Visitar site |
| Authorize | Autorizar |
| Install & Authorize | Instalar e autorizar |
| Only select repositories | Somente / Apenas repositórios selecionados |
| Danger Zone | Zona de perigo ⚠️ |
| Codespaces · Prebuild configuration | Codespaces · Configuração de pré-compilação ⛔ **não usar** (pode ter custos) |

---

## 📦 Como extrair o ZIP

### Windows

1. No navegador, carrega em **Ctrl + J** (lista de transferências) → no ZIP mais recente, clica em **Mostrar na pasta**. O Explorador de Ficheiros abre com o ZIP já seleccionado.
   - O ZIP tem o ícone de uma pasta com um **fecho** (zíper). Se descarregaste várias vezes, o mais recente pode ter **(1)** ou **(2)** no nome.
2. **Botão direito** no ZIP → **Extrair Tudo…** (*Extract All…*).
   - Com WinRAR ou 7-Zip instalado, escolhe **Extrair para "nome-do-zip\\"**.
3. Na janela que abre, deixa marcada a opção **Mostrar ficheiros extraídos quando concluído** → **Extrair**.
4. Abre-se uma **pasta amarela normal** (sem fecho) com o mesmo nome do ZIP. Entra nas pastas até veres `package.json`: essa é a **pasta do projecto**.

> ⚠️ Abrir o ZIP com duplo clique **não é extrair**: mostra o conteúdo, mas não cria a pasta. Se a barra de endereço tiver **`.zip`**, ainda estás dentro do ZIP.
>
> 💡 O Windows esconde as extensões: `package.json` pode aparecer só como **package** e `index.html` como **index**. É normal.

### Mac

Duplo clique no ZIP → aparece uma pasta ao lado. O Finder esconde as pastas que começam por ponto (como `.github`): carrega em **Cmd + Shift + .** para as ver.

### Telemóvel

Não é preciso extrair: carrega o **ZIP tal como está** (Caminho A, abaixo). Os navegadores dos telemóveis não conseguem carregar pastas.

### ✅ Confirmar que é a versão mais recente

A pasta do projecto deve ter: `.github` · `public` · `src` · `index.html` · `package.json` · `package-lock.json` · `tsconfig.json` · `vite.config.ts` · `README.md` · `netlify.toml` · `vercel.json` · `.gitignore` · `.nvmrc`.

Se faltar `.github`, não faz mal: o passo 4 do Caminho A cria o ficheiro de publicação.

---

## 🐙 OPÇÃO 1 — GitHub Pages (recomendado agora)

Tudo dentro da tua conta GitHub de sempre — a mesma do **Moz Sistafe** e do **Moto Moz**. Os outros projectos **não são tocados**: o KeyHouse fica num repositório só dele.

Nos links abaixo, troca **`UTILIZADOR`** pelo teu nome de utilizador do GitHub e **`REPOSITORIO`** pelo nome do repositório.

### ⭐ Caminho A — Carregar o ZIP tal como está (o mais fácil)

**Não precisas de descompactar nada.** O ficheiro de publicação descompacta o ZIP nos servidores do GitHub, compila o site e publica-o.

> ℹ️ Um ZIP completo tem `public`, `src`, `index.html`, `package.json`, `package-lock.json`, `tsconfig.json` e `vite.config.ts`. Se não tiver a pasta `.github` (versões antigas), não faz mal: o passo 4 cria o ficheiro de publicação.

1. **Criar o repositório:** em **github.com**, canto superior direito: **+** → **Novo repositório** (*New repository*) → escreve o nome → escolhe **Público** (*Public*) → **Criar repositório** (*Create repository*).
2. **Carregar o ZIP:** clica no link **carregando um arquivo existente** (*uploading an existing file*) → arrasta o ficheiro **`.zip`** do projecto → **Confirmar alterações** (*Commit changes*).
3. **Activar o GitHub Pages:** abre `https://github.com/UTILIZADOR/REPOSITORIO/settings/pages` → em **Fonte** (*Source*) escolhe **GitHub Actions**.
   ⚠️ Não cliques nos modelos que o GitHub sugere ("Jekyll", "Static HTML").

   **Onde fica o *Source*:** separador **Settings** ⚙️ (o último à direita; em janelas estreitas está no menu **…**) → menu da esquerda, secção *Code and automation* → **Pages** (logo abaixo de *Codespaces*).

   ```text
   GitHub Pages

   Build and deployment
     Source
     [ Deploy from a branch ▾ ]    ← 1) clicar neste botão
         GitHub Actions            ← 2) escolher esta opção
         Deploy from a branch

     Branch  [ None ▾ ] [ Save ]   ← não mexer
   ```

   - No menu aberto há duas opções. Escolhe a **1.ª**: **GitHub Actions** — *"Best for using frameworks and customizing your build process"*. ⛔ Não escolhas *Deploy from a branch* — *"Classic Pages experience"*.
   - Ao escolher **GitHub Actions**, fica gravado logo: **não há botão *Save*** para esta opção.
   - Com a tradução ligada, os nomes variam: *Build and deployment* = «Compilação e implantação», «Construção e implantação», «Build e implantação» ou «Compilar e implantar» · *Source* = «Fonte» ou «Origem» · *Deploy from a branch* = «Implantar a partir de um branch», «… de uma ramificação» ou «… de uma filial» · *GitHub Actions* = «Ações do GitHub».
   - O parágrafo por baixo do título *GitHub Pages* é só uma **descrição**: não se clica nem se escreve nada lá. Desce até *Build and deployment*.
   - A frase «O GitHub Pages está desativado» (*GitHub Pages is currently disabled*) é normal antes de mudar a Fonte.
   - Se o link der **404** ou não vires o separador **Settings**, não tens sessão iniciada nesse navegador (no canto superior direito tem de aparecer a tua foto, não *Sign in*).
4. **Criar o ficheiro de publicação:** desliga a tradução do navegador e abre `https://github.com/UTILIZADOR/REPOSITORIO/new/main` (página "novo ficheiro" na **raiz**).
   → **Caixa do nome, em cima** (ao lado de `REPOSITORIO /`): escreve exactamente **`.github/workflows/deploy.yml`**. Ao escrever cada `/`, o GitHub transforma a palavra em pasta e o caminho fica **`REPOSITORIO / .github / workflows / deploy.yml`**.
   ⚠️ O caminho tem de começar só por `REPOSITORIO /`. Se aparecer outra pasta pelo meio (ex.: `REPOSITORIO / KEYHOUSE /`), volta a abrir o link acima.
   → **Caixa grande:** cola o conteúdo da secção **[📄 Ficheiro de publicação](#-ficheiro-de-publicação-para-colar)**.
   → Botão verde **Commit changes** (*Confirmar alterações*) → na janela, a mensagem pode ficar como está (qualquer texto serve) → **Commit changes** outra vez.
5. **Acompanhar:** abre o separador **Ações** (*Actions*) → espera 2 a 4 minutos: 🟡 a correr → ✅ concluído.
   - Se não aparecer nada, ou aparecer cinzento: **Publicar no GitHub Pages** → **Executar fluxo de trabalho** (*Run workflow*) → botão verde.
6. O site fica em **`https://UTILIZADOR.github.io/REPOSITORIO/`** — também em **Configurações → Páginas → Visitar site**. 🎉

**Para actualizar depois:** descarrega o ZIP novo → carrega-o para o repositório (**Adicionar arquivo → Carregar arquivos**) → **Confirmar alterações**. O site actualiza-se sozinho em ~3 minutos. O fluxo usa sempre o **ZIP carregado mais recentemente**.
Isto só funciona enquanto o repositório não tiver os ficheiros descompactados: se tiver `package.json`, o ZIP é ignorado (ver Caminho B).

### Caminho B — Carregar os ficheiros descompactados

1. Descompacta o ZIP (botão direito → **Extrair tudo**). Abre as pastas até veres `package.json`. Se existirem `node_modules` e `dist`, **apaga-as**.
2. Abre a página de carregamento na **raiz** do repositório: `https://github.com/UTILIZADOR/REPOSITORIO/upload/main` (ou **Adicionar arquivo → Carregar arquivos**, na página principal, não dentro de uma pasta).
   - Põe as janelas lado a lado: **tecla Windows + ←** no Explorador e **tecla Windows + →** no navegador.
   - Na pasta do projecto: **Ctrl + A** → arrasta a selecção para a página do GitHub. Arrasta o **conteúdo**, não a pasta em si.
   - Espera que a lista mostre todos os ficheiros → **Confirmar alterações** (*Commit changes*), com a opção de commit directo no `main`.
3. Confirma que o repositório mostra `public`, `src`, `package.json`, `vite.config.ts` e `index.html`.
   ℹ️ **Faltam `.github`, `.gitignore` e `.nvmrc`? É normal.** Pelo navegador, o GitHub **recusa ficheiros e pastas que começam por ponto** ("This file is hidden"). O `.gitignore` e o `.nvmrc` não fazem falta; a `.github` cria-se à mão no passo seguinte.
4. Activa o GitHub Pages (passo 3 do Caminho A) e **cria o ficheiro de publicação** (passo 4 do Caminho A). Depois acompanha em **Ações** (passo 5).
5. ✅ **Sinal de que correu bem:** por baixo da lista de ficheiros aparece este guia (🏛️ KEYHOUSE PROPERTIES).

> ℹ️ Se os ficheiros ficaram dentro de uma pasta (ex.: `KEYHOUSE/`), não faz mal: o ficheiro de publicação encontra o projecto em qualquer pasta. Só o ficheiro de publicação tem de estar na **raiz** (`.github/workflows/deploy.yml`).
>
> A pasta `dist` **nunca** aparece no repositório: é o site compilado, criado na máquina do GitHub em cada publicação e enviado directamente para o endereço `github.io`.

**Para actualizar depois:** extrai o ZIP novo → carrega outra vez o **conteúdo** da pasta (os ficheiros novos substituem os antigos) → **Confirmar alterações**. Depois de o repositório ter `package.json`, os ficheiros `.zip` são ignorados. Os ZIPs antigos podem ficar ou ser apagados.

> ⚠️ Arrasta os ficheiros seleccionados, não uses o botão **escolher seus arquivos** (*choose your files*): esse botão não aceita pastas.
>
> Se arrastares a **pasta** em vez do conteúdo, o site compila na mesma (o projecto fica numa subpasta). Em qualquer caso, cria o ficheiro de publicação na raiz (passo 4 do Caminho A).

### ⚡ Atalho: o projecto ficou dentro de uma pasta (ex.: `KEYHOUSE`)

Se o repositório já tem um ficheiro de publicação simples (que corre `npm install` e `npm run build` na raiz e publica a pasta `dist`), basta criar **um** ficheiro pequeno na raiz. Não é preciso arrastar mais pastas.

1. **Desliga a tradução do navegador** (ícone de tradução → **Mostrar original**). Se não o fizeres, o tradutor troca palavras do código ("name" → "nome").
2. Abre `https://github.com/UTILIZADOR/REPOSITORIO/new/main`. No topo tem de aparecer só `REPOSITORIO /`.
3. Na caixa pequena do nome, escreve: **`package.json`**
4. Na caixa grande, cola:

```json
{
  "name": "keyhouse-mz",
  "private": true,
  "scripts": {
    "build": "cd KEYHOUSE && npm install && npm run build && rm -rf ../dist && cp -r dist ../dist"
  }
}
```

5. **Commit changes** → **Commit directly to the main branch** → **Commit changes**.
6. Abre **Actions**: a publicação arranca sozinha e fica ✅ em 3 a 5 minutos.

**Para actualizar depois:** carrega os ficheiros novos **para dentro da pasta `KEYHOUSE`** (`…/upload/main/KEYHOUSE`). O site actualiza-se sozinho.

### ⚠️ Codespaces não é Páginas

No menu das **Configurações**, o **Codespaces** fica mesmo por cima de **Páginas**. O Codespaces é outro serviço (programação na nuvem): o ecrã de "pré-compilação" avisa que *"consomem espaço de armazenamento, o que acarretará uma cobrança"*. **Não cliques em Criar.** Usa o link directo do passo 3 — vais parar à página certa, com o título **"GitHub Pages"**.

Se já criaste uma pré-compilação por engano: `https://github.com/UTILIZADOR/REPOSITORIO/settings/codespaces` → **⋯** ao lado da configuração → **Excluir** → **OK**.

### 📄 Ficheiro de publicação (para colar)

Nome do ficheiro: **`.github/workflows/deploy.yml`** (na raiz do repositório, não dentro de outra pasta).

**⚠️ Onde se cola:** este texto **não é um comando nem um link**. É o **conteúdo de um ficheiro** e cola-se na **caixa grande do editor, dentro da página do GitHub**, que aparece depois de clicar no lápis ✏️.
**Nunca** o coles na **barra de endereço** do navegador (lá em cima, onde está `github.com/…`): essa barra serve **só para links** e o resultado é 404 ou uma pesquisa no Google.

```text
┌────────────────────────────────────────────────────────────┐
│ 🔒 github.com/…/edit/main/.github/workflows/publicar.yml   │ ← barra de endereço: SÓ links ⛔
├────────────────────────────────────────────────────────────┤
│  KEYHOUSE-MZ / .github / workflows / publicar.yml          │
│  [ Edit ] [ Preview ]              [ Commit changes… ] 🟩  │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 1  name: …                                             │ │
│ │ 2                                                      │ │ ← caixa do editor: COLAR AQUI ✅
│ │ 3  on:                                                 │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

**Plano B, sem colar nada (arrastar o ficheiro):** no GitHub, clica em **Code** → `.github` → `workflows` → **Add file ▾** → **Upload files**. Depois arrasta o ficheiro `deploy.yml` que está na pasta extraída do ZIP (`.github` → `workflows` → `deploy`) → **Commit changes**. Por fim, apaga o ficheiro antigo: clica em `publicar.yml` → **⋯** (canto superior direito) → **Delete file** → **Commit changes**.

**Colar sem falhar:**
1. **Antes de abrir o GitHub, desliga a tradução:** ícone de tradução na barra de endereço → **Mostrar original** → no menu desse ícone, **Nunca traduzir este site**. Com o tradutor ligado, o código colado pode ficar estragado.
2. Copia o bloco abaixo com o botão **Copiar** (canto superior direito do bloco), em vez de o seleccionares com o rato.
3. Clica dentro da caixa grande → **Ctrl + A** (se lá houver alguma coisa) → **Ctrl + V**.
4. Confere: a **1.ª linha** é `name: Publicar no GitHub Pages`, a **última** é `uses: actions/deploy-pages@368f8252…` e o editor mostra **88 linhas** com texto.
5. **Commit changes** → deixa marcado **Commit directly to the `main` branch** → **Commit changes**.

```yaml
name: Publicar no GitHub Pages

on:
  push:
    branches: [main, master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    if: github.event_name == 'workflow_dispatch' || github.event.repository.has_pages
    runs-on: ubuntu-latest
    timeout-minutes: 30
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Obter o codigo
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
        with:
          fetch-depth: 0

      - name: Localizar o projecto (descompacta o ZIP se for preciso)
        id: projecto
        run: |
          procurar() {
            find "$1" -name package.json -not -path '*/node_modules/*' -not -path './.git/*' -printf '%d\t%h\n' | sort -n | head -n 1 | cut -f 2
          }
          DIR="$(procurar .)"
          if [ -z "$DIR" ]; then
            ZIP=""
            RECENTE=-1
            while IFS= read -r -d '' F; do
              T="$(git log -1 --format=%ct -- "$F" 2>/dev/null || true)"
              T="${T:-0}"
              if [ "$T" -gt "$RECENTE" ]; then RECENTE="$T"; ZIP="$F"; fi
            done < <(find . -type f -iname '*.zip' -not -path './.git/*' -print0)
            if [ -z "$ZIP" ]; then
              echo "::error::Nao encontrei o projecto. Carregue os ficheiros (com package.json) ou o ZIP do projecto."
              exit 1
            fi
            echo "A descompactar: $ZIP"
            unzip -q -o "$ZIP" -d ./_projeto
            DIR="$(procurar ./_projeto)"
          fi
          if [ -z "$DIR" ]; then
            echo "::error::O ZIP nao contem o ficheiro package.json."
            exit 1
          fi
          echo "Projecto encontrado em: $DIR"
          echo "dir=$DIR" >> "$GITHUB_OUTPUT"

      - name: Preparar Node.js 22
        uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7
        with:
          node-version: 22

      - name: Instalar dependencias e compilar o site
        working-directory: ${{ steps.projecto.outputs.dir }}
        run: |
          if npm install --no-audit --no-fund --replace-registry-host=always --fetch-retries=1 --fetch-timeout=60000 && npm run build; then
            echo "Site compilado com sucesso."
          else
            echo "::warning::Primeira tentativa falhou. A repetir sem o package-lock.json..."
            rm -rf node_modules package-lock.json dist
            npm install --no-audit --no-fund
            npm run build
          fi

      - name: Configurar o GitHub Pages
        uses: actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d # v6

      - name: Enviar a pasta dist
        uses: actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5
        with:
          path: ${{ steps.projecto.outputs.dir }}/dist

      - name: Publicar
        id: deployment
        uses: actions/deploy-pages@368f82528645a54fb793d4d04e342629a3f51346 # v5
```

---

## ⚡ OPÇÃO 2 — Vercel Drop (5 minutos)

A Vercel recebe o ZIP, **compila o projecto sozinha** e publica.

1. Abre **https://vercel.com/drop** no Chrome ou no Edge (desliga a VPN, se usares).
2. **Continue with GitHub** → no GitHub, **Autorizar** (*Authorize*). É seguro: dá acesso apenas ao teu perfil básico.
3. Se perguntar pelo plano, escolhe **Hobby** (grátis).
4. **Arrasta o ZIP** tal como está (sem descompactar). Se tiver mais de 50 MB, descompacta, apaga `node_modules` e arrasta a pasta.
5. *Project name:* `keyhouse-properties` → **Deploy** → em 1 a 3 minutos fica online em `….vercel.app`. 🎉

> Cada novo *drop* cria um projecto novo, com um link novo. O plano Hobby é só para uso não comercial.

---

## 🏆 OPÇÃO 3 — Cloudflare Pages (lançamento comercial)

Grátis, **uso comercial permitido**, **tráfego ilimitado**, **centro de dados em Maputo** e **repositório privado**.

1. Repositório no GitHub com os **ficheiros descompactados** (Caminho B da Opção 1 — aqui o ZIP sozinho não serve). Podes escolher **Privado** (*Private*).
2. Cria conta em **https://dash.cloudflare.com/sign-up** e confirma o email.
3. **Workers & Pages** → **Create application** → **Pages** → **Import an existing Git repository**.
4. No GitHub: **Instalar e autorizar** (*Install & Authorize*) com **Somente repositórios selecionados** (*Only select repositories*) → escolhe apenas o repositório do KeyHouse.
5. Preenche: **Build command** `npm run build` · **Build output directory** `dist` → **Save and Deploy**.
6. Em 1 a 3 minutos fica online em `https://NOME-DO-PROJECTO.pages.dev`. ✅

> Com o GitHub Pages desactivado, o ficheiro de publicação do GitHub fica inactivo automaticamente — não gera erros.

---

## ⚠️ Netlify: "Your account has been suspended"

Bloqueio automático anti-abuso da Netlify em contas novas — **não foi culpa tua**. Não cries outra conta para contornar. Pede revisão em **https://www.netlify.com/support/** (em inglês):

```
Hello, I signed up with my GitHub account (username: SEU_UTILIZADOR) and
immediately got "Your account has been suspended". I'm a legitimate user from
Mozambique deploying a static website for my real estate business,
KEYHOUSE PROPERTIES. Could you please review and lift the suspension? Thank you.
```

> No fórum público (answers.netlify.com), **não escrevas o teu email**.

---

## 🔐 Segurança nas Configurações do GitHub

- Antes de mudar alguma coisa, confirma **no topo da página** que estás no repositório do KeyHouse.
- **Nunca** mexas na **Zona de perigo** (*Danger Zone*) do Moz Sistafe ou do Moto Moz (apagar, transferir ou mudar a visibilidade).
- **Não mudes o teu nome de utilizador** — os links `….github.io` dos teus projectos deixariam de funcionar.
- Quando uma plataforma pedir acesso: **Somente repositórios selecionados** → escolhe apenas o repositório do KeyHouse.
- (Opcional) Retirar o acesso da Netlify: **Configurações → Aplicativos → Aplicativos OAuth autorizados → Netlify → Revogar**.

---

## 🛠️ Problemas comuns

| O que vês | Causa provável | Solução |
|---|---|---|
| "Pré-compilação", "prebuild", "contêiner de desenvolvimento" ou aviso de **cobrança** | Abriste **Codespaces** em vez de **Páginas** | **Não cliques em Criar.** Usa o link directo `…/settings/pages`. Se já criaste: `…/settings/codespaces` → **⋯ → Excluir → OK** |
| O repositório só tem o ficheiro `.zip` | Normal no Caminho A | Faz os passos 3 e 4 do Caminho A — o GitHub descompacta-o sozinho |
| Não aparece "Publicar no GitHub Pages" em **Ações** | Falta o ficheiro de publicação | Passo 4 do Caminho A |
| `.github`, `.gitignore` e `.nvmrc` não subiram / aviso "This file is hidden" | O GitHub recusa, pelo navegador, nomes que começam por ponto | Normal: cria o ficheiro de publicação à mão (passo 4 do Caminho A) |
| A caixa do nome, em cima, está vazia | O link não preencheu o nome | Escreve `.github/workflows/deploy.yml` (cada `/` cria uma pasta) |
| "Invalid workflow file" / erro com número de linha em **Ações** | O texto colado ficou estragado (tradutor ligado ou cópia incompleta) | Abre o ficheiro → ✏️ (*Edit*) → **Ctrl + A** → cola de novo, com a tradução desligada → **Commit changes** |
| O endereço `….github.io/…` dá **404** | Ainda não houve nenhuma publicação com sucesso, ou o Pages está desligado | Normal até aparecer o ✅ verde em **Ações**. Confirma que **Settings → Pages → Source** está em **GitHub Actions** |
| Um link de **edição** (`…/edit/main/…`) dá **404** | Sessão não iniciada nesse separador, ou link copiado incompleto | Vai pelos cliques: separador **Code** → `.github` → `workflows` → ficheiro → lápis ✏️ (*Edit this file*) |
| O ❌ antigo continua na lista de **Ações** | É o histórico das tentativas anteriores | Ignora. Conta só a execução mais recente, no topo da lista. (Opcional: abre a execução vermelha → **⋯** no canto superior direito → **Delete workflow run** → confirma. Não afecta o site) |
| Aviso amarelo "**workflows** had recent pushes" (ou outro nome) + botão **Compare & pull request** | A alteração foi gravada num **ramo novo**, não no `main` (na janela de gravação ficou escolhida a opção "Create a new branch") | Juntar ao `main`: **Compare & pull request** → **Create pull request** → **Merge pull request** → **Confirm merge**. O Pages só publica a partir do `main`. Da próxima vez, escolhe **Commit directly to the main branch** |
| Arrastar pastas para a raiz é difícil / o projecto está numa subpasta | O ficheiro de publicação procura o `package.json` na raiz | Usa o **⚡ Atalho**: criar só o ficheiro `package.json` (7 linhas) na raiz, que manda compilar dentro da pasta `KEYHOUSE` |
| Anotação amarela "O Node.js 20 está obsoleto… forçadas a serem executadas no Node.js 24" | Aviso do GitHub: o ficheiro simples usa versões antigas das peças `actions/…@v4` | **Ignora.** É só um aviso (amarelo), não impede a publicação. O erro que conta é o vermelho |
| Anotação vermelha "Processo concluído com código de saída 254" (em *construir* / *build*) | O `npm install` não encontrou o `package.json` na raiz | Carrega o **conteúdo** da pasta do projecto na **raiz** (`…/upload/main`). Depois disso, a execução seguinte fica verde |
| Nomes de pastas e ficheiros aparecem traduzidos (ex.: `KEYHOUSE` → «CASA DA CHAVE», `workflows` → «fluxos de trabalho») | O tradutor do navegador traduz tudo, até nomes de pastas | Desliga a tradução para o GitHub: ícone de tradução na barra de endereço → **Mostrar original** → **Nunca traduzir este site**. Os nomes verdadeiros são os que interessam para conferir |
| Settings → Pages: **Enforce HTTPS** aparece marcado e cinzento (bloqueado) | Normal: todos os sites `.github.io` usam HTTPS obrigatoriamente | Nada a fazer. Se aparecer desmarcado e clicável, marca-o |
| Settings → Pages: campo **Custom domain** | Serve só para um domínio próprio | **Deixa em branco** até comprares o domínio (ex.: `keyhouse.co.mz`) e configurares o DNS. Escrever lá um domínio que não controlas **tira o site do ar** |
| Settings → Pages: "**Last deployed … há X dias**" | Data da última publicação com sucesso | Se carregaste uma versão nova e a data não mudou, vê o separador **Actions** |
| Android/Chrome: "**Este site não suporta uma ligação segura** / os atacantes podem ver e alterar as informações… sugerir que atualize para HTTPS" | O site **já é HTTPS**: o GitHub obriga a HTTPS em todos os sites `.github.io`. O aviso aparece quando a tentativa segura falha **no caminho** (rede lenta ou com filtro, data/hora errada, VPN, poupança de dados, antivírus, Chrome desactualizado) ou quando o endereço é escrito sem `https://` | 1) Abrir o link completo, a começar por **`https://`** · 2) **Data e hora automáticas** · 3) Trocar de rede (Wi-Fi ↔ dados móveis); em Wi-Fi público, fazer primeiro o login da rede · 4) Actualizar o **Chrome** e o **Android System WebView** na Play Store · 5) Desligar VPN, poupança de dados e "protecção web" do antivírus · 6) Testar no **Firefox**. Numa rede pública, **não** carregar em "Continuar para o site" |
| Colei o código e deu **404** ou abriu uma pesquisa no Google | Colaste na **barra de endereço** do navegador | A barra de endereço só recebe **links**. O código vai para a **caixa do editor dentro da página** (lápis ✏️ → clicar dentro do texto → **Ctrl + A** → **Delete** → **Ctrl + V**) |
| Aviso "Customizable line height" (*Enable compact line height* / *Dismiss*) | Novidade visual do GitHub (espaço entre linhas) | Clica em **Dismiss**. Não afecta nada |
| Não encontro o lápis ✏️ para editar | Está na barra cinzenta por cima do código, à direita: `Raw · ⧉ · ⤓ · ✏️ ▾` | Clica no lápis, não na setinha ▾ (nunca em *Codespaces*). Em janela estreita: **⋯** → **Edit file**. Estás a editar quando aparecem os separadores **Edit / Preview** e o botão verde **Commit changes…** |
| Execução **cinzenta** logo depois de gravar o ficheiro | O Pages ainda estava desligado nesse momento | Normal. Liga o **Source** (Settings → Pages → GitHub Actions) → **Actions** → **Publicar no GitHub Pages** → **Run workflow** |
| O repositório já tem um ficheiro de publicação simples (ex.: `publicar.yml` com `npm install`, `npm run build` e `path: dist`) | Esse ficheiro compila **na raiz** do repositório | Carrega o **conteúdo** da pasta do projecto na **raiz** (`…/upload/main`, fora de qualquer pasta). O ficheiro passa a funcionar sem ser editado. As próximas actualizações também vão para a raiz |
| Falha em **npm install** com "exit code 254" (ficheiro com outro nome ou conteúdo, ex.: `publicar.yml`) | Versão genérica do ficheiro: procura o `package.json` na raiz, mas o projecto está numa pasta (ex.: `KEYHOUSE`) | Abre esse ficheiro → ✏️ → **Ctrl + A** → cola o conteúdo da secção 📄 → **Commit changes**. O nome do ficheiro não importa, o conteúdo sim. Deve existir **um só** ficheiro em `.github/workflows` |
| O ficheiro ficou dentro de outra pasta (ex.: `KEYHOUSE/.github/…`) | Foi criado a partir de uma subpasta | Usa o link do passo 4 (cria-o na raiz) |
| Na raiz só aparece uma pasta nova, com tudo lá dentro | Arrastaste a pasta em vez do conteúdo | O site compila na mesma: cria o ficheiro de publicação na raiz (passo 4 do Caminho A) |
| Não aparece a pasta `dist` | É normal | A `dist` é o site compilado: o GitHub cria-a sozinho em cada publicação. Não é preciso carregá-la |
| Erro "Nao encontrei o projecto" | Não há ZIP nem ficheiros do projecto | Carrega o ZIP (passo 2 do Caminho A) |
| Erro "O ZIP nao contem o ficheiro package.json" | O ZIP não é o do projecto | Descarrega de novo o ZIP do projecto e carrega-o |
| Aviso amarelo "Primeira tentativa falhou" | O `package-lock.json` não serviu | Normal: o sistema repete sozinho sem ele. Espera pelo ✅ |
| ❌ vermelho em **Ações** | Erro na compilação | Abre a execução → print das linhas a vermelho → envia ao programador |
| Erro "Get Pages site failed" | O Pages não está activo | Passo 3 do Caminho A → depois **Executar fluxo de trabalho** |
| Aparece o README em vez do site | Fonte em "Implantar a partir de um branch" | Muda a **Fonte** para **GitHub Actions** |
| Execução cinzenta ("ignorado" / *skipped*) | O Pages ainda não estava activo | Passo 3 → **Ações → Publicar no GitHub Pages → Executar fluxo de trabalho** |
| "Páginas" pede upgrade | Repositório privado | Só no repositório do KeyHouse: **Configurações → Geral → Zona de perigo → Alterar visibilidade → Público** |
| O site abre dentro de outro domínio | A tua página principal do GitHub tem domínio próprio | Normal — resolve-se ao ligar o domínio `keyhouse.co.mz` |
| Envio parado ou lento | A pasta `node_modules` foi incluída | Apaga `node_modules` e envia de novo (limite: 100 ficheiros por envio) |
| Página em branco | Ficheiros publicados sem compilação | Usa uma das 3 opções acima (todas compilam sozinhas) |
| Ecrã "Algo correu mal" no site | Dados antigos no navegador | Clica em **Repor dados e recarregar** |
| O que criei não aparece noutro telemóvel | Os dados da demonstração ficam no navegador | Normal até ligarmos o backend |

---

## 🛡️ Segurança: o site pode ser derrubado ou invadido?

**Versão curta:** é muito difícil. O site é **estático**: não tem servidor próprio, base de dados nem área de login para invadir. Os ficheiros são servidos pela infraestrutura do GitHub, preparada para picos de tráfego e ataques.

| Risco | Nível hoje | Porquê / o que fazer |
|---|---|---|
| Derrubar o site (ataque de tráfego) | 🟢 Muito baixo | Servido pela rede de distribuição do GitHub; não há servidor nosso para "cair" |
| Invadir e alterar o conteúdo | 🟢 Baixo | Só é possível entrando na **tua conta GitHub** → activa a verificação em dois passos (2FA) |
| Roubar dados de clientes | 🟢 Nenhum (demo) | A demonstração não guarda dados num servidor: fica tudo no navegador de cada visitante |
| Copiarem o site para burlas | 🟠 Real | O código é público. Protege a marca: domínio próprio, Perfil da Empresa no Google verificado e o aviso "só aceitamos pagamentos em keyhouse.co.mz" |
| Emails falsos ("a sua conta foi suspensa") | 🟠 Real | Nunca cliques em links desses emails; entra sempre directamente em github.com |

### ✅ Faz hoje (5 minutos)
1. **Verificação em dois passos (2FA)** no GitHub: `https://github.com/settings/security` → *Two-factor authentication* → **Enable** (app autenticadora ou *passkey*). Guarda os códigos de recuperação num sítio seguro.
2. **Retira o acesso da Netlify** (a conta foi suspensa e já não precisa dele): `https://github.com/settings/applications` → **Authorized OAuth Apps** → Netlify → **Revoke**.
3. **Nunca partilhes** a senha, os códigos 2FA ou *tokens* do GitHub, nem com quem diga ser do suporte.

### 🔒 O que já está protegido no código
- **Modo demonstração** (`DEMO_MODE` em `src/lib/constants.ts`): os números dos imóveis, leads e visitas de exemplo são fictícios. Por isso, os botões de telefone e WhatsApp mostram um aviso em vez de contactarem pessoas reais.
- **WhatsApp oficial configurável** (`BRAND.whatsapp`): enquanto estiver vazio, o rodapé diz "em breve" e não abre conversa com ninguém.
- A página de pagamento **não pede** PIN, senha nem dados de cartão.
- Política de *referrer* restrita e **HTTPS** automático no GitHub Pages.

### Quando houver pagamentos reais (fase backend)
Aí a segurança passa a ser a sério: servidor que valida todos os pedidos, chaves das APIs M-Pesa/e-Mola guardadas fora do código, Cloudflare (firewall e protecção DDoS; cabeçalhos já preparados em `public/_headers`), cópias de segurança diárias e registo de acessos.

---

## 🔎 Google: divulgação

### O que já está feito no código
- Título e descrição optimizados para pesquisas como "imóveis Maputo" e "arrendar Matola".
- **Pré-visualização ao partilhar** no WhatsApp e no Facebook (imagem da villa, título e descrição).
- **Dados estruturados** (JSON-LD `RealEstateAgent`): o Google percebe que é uma empresa imobiliária em Moçambique.
- `sitemap.xml` e `robots.txt` prontos.
- Página inicial só com **factos verificáveis** (27 pontos de verificação, 20 tipos de imóvel…), sem números nem testemunhos inventados.
- Os **imóveis de demonstração ficam fora do Google, de propósito** (páginas com `#`): não queremos anúncios fictícios indexados. Os imóveis reais passam a ser indexados na fase backend, com domínio próprio.

### ⚠️ Antes de divulgar
1. **WhatsApp oficial:** no GitHub, abre `KEYHOUSE/src/lib/constants.ts` → ✏️ (*Edit this file*) → preenche `whatsapp: '258…'` e `whatsappDisplay: '+258 …'` → **Commit changes**. O site actualiza-se sozinho em cerca de 3 minutos.
2. Diz aos primeiros visitantes que é uma **versão de demonstração** (o rodapé já o indica).

### 1️⃣ Google Search Console (aparecer nas pesquisas) · grátis
1. Abre **https://search.google.com/search-console** e entra com o Gmail.
2. **Adicionar propriedade** → **Prefixo do URL** → `https://joaquimeugeniomachava-maker.github.io/KEYHOUSE-MZ/` → **Continuar**.
3. Método **Ficheiro HTML** → **descarrega** o ficheiro (ex.: `google1a2b3c.html`).
4. No GitHub, entra na pasta `KEYHOUSE/public` → **Add file → Upload files** → arrasta esse ficheiro → **Commit changes**.
5. Espera 3 minutos (o site é republicado) → volta ao Search Console → **Verificar**.
6. Menu **Sitemaps** → escreve `sitemap.xml` → **Enviar**.
7. Menu **Inspecção de URL** → cola o endereço do site → **Pedir indexação**.

### 2️⃣ Perfil da Empresa no Google (Google Maps) · grátis e o mais importante
Quem pesquisa "imobiliária Maputo" no telemóvel vê o Perfil da Empresa **antes** dos sites.
1. Abre **https://business.google.com** e entra com o Gmail.
2. Nome: **KEYHOUSE PROPERTIES** · Categoria: **Agência imobiliária**.
3. Localização: morada do escritório **ou** "área de serviço" (Maputo, Matola…), se não atenderes clientes num escritório.
4. Telefone/WhatsApp oficial e site (o link do GitHub Pages; mais tarde, o domínio).
5. Verificação: o Google pede vídeo, chamada, SMS ou postal. Segue as instruções.
6. Depois: fotos reais, horário e, sobretudo, **avaliações de clientes reais**.

### 3️⃣ Google Analytics (medir visitas) · quando quiseres
Cria uma propriedade em **https://analytics.google.com** e envia o "ID de medição" (`G-XXXXXXX`) ao programador: a ligação ao site demora poucos minutos.

### ⭐ E as "estrelas" do GitHub?
Não trazem clientes: quem procura casa nunca abre o GitHub. Os projectos com centenas de milhares de estrelas (ex.: *build-your-own-x*, *awesome*) são recursos gratuitos de aprendizagem que milhões de programadores guardaram ao longo de anos. Não há *skill*, MCP ou conector que as crie. **Nunca compres estrelas:** um estudo de 2024 (Carnegie Mellon, NC State e Socket) encontrou cerca de 4,5 milhões de estrelas falsas, muitas ligadas a burlas, e o GitHub remove-as.

---

## 💸 Quanto custa?

**Hoje: 0 MT.**

| Peça | Custo | Nota |
|---|---|---|
| Conta GitHub e repositório público | Grátis | |
| Alojamento (GitHub Pages) | Grátis | Limites: site até 1 GB, cerca de 100 GB de tráfego por mês |
| Publicação automática (GitHub Actions) | Grátis | Em repositórios públicos |
| Mapas, tipos de letra e fotografias | Grátis | OpenStreetMap/CARTO, Google Fonts, Pexels |

**Quando crescer (só quando já houver receita):**
- **Domínio próprio** (opcional): `.co.mz` custa cerca de **2.300 a 2.400 MT/ano**, `.com` cerca de **1.100 MT/ano** (preços de registadores moçambicanos em 2026; confirma antes de comprar).
- **Pagamentos reais no site:** o GitHub Pages **não permite** sites de comércio ou negócio online. Nessa altura, muda-se para o **Cloudflare Pages** (grátis, uso comercial permitido); o projecto já está preparado.
- **Base de dados e contas de utilizador** (backend): há planos gratuitos para começar.
- **M-Pesa / e-Mola**: taxas por transacção, conforme o contrato com o operador.

---

## 🗣️ Site, plataforma, web, domínio: que nome usar?

| Termo | O que é | Na KEYHOUSE |
|---|---|---|
| **Site** (website) | Páginas na internet | "O site da KEYHOUSE": toda a gente entende |
| **Plataforma / aplicação web** | Um site onde se **faz** coisas: pesquisar, publicar, marcar visitas, pagar | É o que a KEYHOUSE é. Usa este termo com parceiros e investidores |
| **Web** | A internet em geral | Não é o nome do teu produto |
| **Domínio** | O endereço (ex.: `keyhouse.co.mz`) | Hoje: `joaquimeugeniomachava-maker.github.io/KEYHOUSE-MZ` (grátis) |
| **App** | Aplicação instalada no telemóvel (Play Store) | Não é preciso: a plataforma abre no navegador do telemóvel |

---

## 🏖️ Colecção Praias: terrenos na Macaneta, Barra, Jangamo, Tofo e Vilankulo

Página **/praias** (menu **Praias**, secção na página inicial e atalho na pesquisa de terrenos): o portfólio real de terrenos de praia, de **1 a 50 hectares**.

**O que já funciona:** 5 zonas com imagens **ilustrativas** (sempre com a etiqueta "Imagem ilustrativa"), secção **Lotes em destaque**, mapa das zonas, formulário **Pedir lista** (zona, hectares, finalidade, orçamento e perfil do comprador), que envia o pedido ao **WhatsApp da KEYHOUSE**, secção **Compra segura** e perguntas frequentes.

**Lotes publicados:**

| Ref. | Zona | Área | Preço | Estado |
|---|---|---|---|---|
| TER-MAC-01 | Macaneta (Marracuene) | 15 ha, nas dunas, a cerca de 100 m da praia | 1.500.000 MT/ha · total 22.500.000 MT (≈ 150 MT/m²) | Documentação, acesso e fotos a confirmar |

> O cartão de cada lote mostra o preço por hectare, o total e o preço por m². Indica `pricePerHa` (preço por hectare) **ou** `price` (total): o outro é calculado automaticamente. Com `inDunes: true`, aparece o aviso "Zona de dunas".

### Acrescentar um lote real
Os lotes entram em `KEYHOUSE/src/data/beach.ts`, na lista `BEACH_PLOTS`: há um exemplo comentado no ficheiro. Em alternativa, envia os dados ao programador. Para cada lote, recolhe:

| Campo | Exemplo |
|---|---|
| Zona | Macaneta / Tofo / Barra / Jangamo / Vilankulo |
| Área | 12 ha |
| Preço | por hectare (ex.: 300.000 MT/ha) ou total · moeda (MT/USD) · negociável? (ou "sob consulta") |
| Dunas | o lote está **nas** dunas, **atrás** das dunas, ou não há dunas? |
| Distância ao mar | "1.ª linha, após a faixa legal de 100 m" / "400 m do mar" |
| Documentação | DUAT emitido / em tramitação / declaração da comunidade / a confirmar |
| Acesso e serviços | estrada de terra a 2 km do asfalto; energia a 500 m; furo |
| Localização | link do Google Maps |
| Fotos e vídeo | reais: praia, vegetação, marcos, acesso; vídeo de drone se possível |

**Fotografias reais:** coloca-as em `KEYHOUSE/public/images/lotes/` (ex.: `tof-01-1.jpg`) e indica-as no campo `photos` (ex.: `'images/lotes/tof-01-1.jpg'`).

### Regras de ouro
- **Nunca** uses imagens ilustrativas como se fossem do lote: cada lote mostra fotografias reais assim que existirem. Um comprador que visita e encontra outro terreno perde a confiança e pode apresentar queixa.
- **Faixa dos 100 m** (Lei n.º 19/97, art. 8): a faixa de 100 m a partir da linha das máximas preia-mares é zona de protecção parcial. Não se adquire DUAT; só licença especial. Indica sempre a posição do lote face a esta faixa.
- **Dunas e mangais** (Decreto n.º 45/2006, art. 67): são ecossistemas frágeis. Só é permitida a construção de **infra-estruturas básicas**, com **licença especial**. Junto à costa, as construções têm de deixar **acessos livres à praia a cada 100 m**. Isto limita muito lodges e casas: indica sempre se o lote está nas dunas ou atrás delas, e confirma com levantamento topográfico e com os serviços de ambiente antes da venda.
- **"A 100 m da praia" não é o mesmo que "fora da faixa legal":** a faixa mede-se a partir da linha das **máximas preia-mares** (marés vivas), não do início da areia. Um levantamento topográfico georreferenciado mostra onde começa e acaba o terreno com DUAT possível.
- **DUAT:** lotes com DUAT emitido vendem mais depressa e a melhor preço; os restantes devem ter preço ajustado e processo explicado.
- **Estrangeiros:** a lei em vigor exige projecto de investimento aprovado e residência ≥ 5 anos (pessoas singulares), ou empresa registada em Moçambique. O Governo aprovou em Out/2025 uma proposta de nova Lei de Terras (na Assembleia da República) que pode restringir mais. Confirma com jurista.
- **Linguagem:** "preços de oportunidade" em vez de "pechincha", para manter o posicionamento premium.

---

## 🔎 Procura-se: pedidos de clientes

Página **/procura** (menu **Procura-se**): o cliente diz o que procura e os proprietários e intermediários respondem.

**Como funciona:**
1. **Cliente publica o pedido** (grátis): o pedido chega ao **WhatsApp da KEYHOUSE**, com o contacto do cliente numa linha "🔒 não partilhar".
2. **Divulgação:** em cada pedido, **Copiar anúncio** ou **Partilhar** gera o texto "PROCURA-SE…" **sem o contacto do cliente**, com o link do pedido. Cola-o em grupos de WhatsApp, no Facebook e nos contactos locais.
3. **Propostas:** o proprietário clica em **Enviar proposta** → preenche localização, área e valor → a mensagem segue para o **WhatsApp da KEYHOUSE**. As fotos vão na mesma conversa.
4. **A KEYHOUSE filtra** e apresenta ao cliente só as melhores → visita → contrato (minuta no site) → comissão.

> ⚠️ **Requisito:** preencher o **WhatsApp oficial** em `src/lib/constants.ts` (`BRAND.whatsapp` e `BRAND.whatsappDisplay`). Sem ele, os botões mostram "WhatsApp em configuração".
>
> **Novos pedidos no site:** na demonstração, os pedidos enviados por visitantes chegam ao WhatsApp da KEYHOUSE; para aparecerem publicamente no site, acrescentam-se em `src/data/demands.ts` (ou, no futuro, automaticamente com o backend).

**Regras de ouro:**
- **Nunca** publiques o número do cliente: a KEYHOUSE é o intermediário. É isso que protege a tua comissão.
- Combina **por escrito** a comissão com o proprietário e/ou o valor do Concierge com o cliente **antes** da visita.
- Antes de apresentar um espaço: confirma a documentação do proprietário (título/DUAT ou declaração), a água, a energia e o acesso, e se a actividade pretendida é permitida no local.

---

## 📇 CRM: o que é e como usar com a KEYHOUSE

**CRM** (*Customer Relationship Management*) = **gestão da relação com os clientes**. É o "caderno digital" de cada cliente: quem é, o que procura, em que fase está (lead → visita → proposta → fecho), o que já foi falado e quando voltar a contactar. No imobiliário, cada lead é dinheiro: sem CRM, os clientes perdem-se no meio das conversas de WhatsApp.

**O que a KEYHOUSE já faz (mini-CRM):** nas áreas **Proprietário** e **Intermediário** → **Leads** (pontuação, orçamento, prazo, contacto protegido), **Visitas** (agenda e lembretes) e **Negócios** (comissões). O botão **Exportar leads (Excel / CRM)** gera um ficheiro CSV para o Excel, o Google Sheets ou um CRM. O contacto completo só sai nos leads **aceites**.
> Na demonstração, estes dados ficam no navegador. O CRM "a sério" nasce com o backend (base de dados e contas de utilizador).

**Para começar já com clientes reais (grátis):**
1. **WhatsApp Business**, com etiquetas: *Novo lead · Visita marcada · Proposta · Fechado*, respostas rápidas e catálogo de imóveis.
2. **Google Sheets**, com uma linha por cliente: nome, contacto, imóvel, orçamento, fase, próximo passo e data.
3. Quando o volume crescer: um CRM com plano gratuito, como o **HubSpot CRM** (utilizadores ilimitados) ou o **Zoho CRM** (até 3 utilizadores). Os planos podem mudar: confirma no site de cada um.

---

## 🛡️ Página de pagamento — porque é assim

Os robôs anti-phishing suspendem automaticamente sites que **pareçam** recolher credenciais. Por isso, a demonstração **não** pede a senha do PayPal nem o PIN do M-Pesa/e-Mola, e mostra o aviso **"Modo demonstração — a KEYHOUSE nunca lhe pede o PIN"**.

---

## ✅ Antes do lançamento público

- [ ] **Pagamentos simulados** → integrar M-Pesa (Vodacom), e-Mola (Movitel) e PayPal Checkout.
- [ ] **Lembretes WhatsApp simulados** → WhatsApp Business API.
- [ ] **Dados no navegador** → backend com base de dados, contas e armazenamento de fotos.
- [ ] **WhatsApp, email e morada oficiais** → `src/lib/constants.ts` (objecto `BRAND`).
- [ ] **`DEMO_MODE` → `false`** (`src/lib/constants.ts`), só quando os imóveis e os contactos forem reais.
- [ ] **Números reais e testemunhos com autorização** → `src/pages/Landing.tsx` (secções `TrustBar` e `Profiles`).
- [ ] **Domínio próprio** → actualizar `og:url`, `og:image` e JSON-LD (`index.html`), `public/sitemap.xml` e `public/robots.txt`.
- [ ] **NIB** → `src/pages/Payment.tsx`.
- [ ] **Câmbios** → `src/lib/constants.ts` (objecto `RATES`).
- [ ] **Imóveis de demonstração** → `src/data/seed.ts`.

---

## 👨‍💻 Para programadores

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ (alojamento estático)
```

**Stack:** React 19 · Vite 7 · Tailwind CSS 4 · React Router 7 (HashRouter) · Leaflet · lucide-react.

**Configuração incluída:** `.github/workflows/deploy.yml` (GitHub Pages — aceita o projecto descompactado **ou** só o ZIP) · `vercel.json` (Vercel) · `netlify.toml` (Netlify) · `public/_headers` (Cloudflare Pages e Netlify) · `.nvmrc` (Node 22).

O build gera um único `index.html` com o JS e o CSS embutidos, e todos os caminhos são relativos. Por isso funciona tanto na raiz de um domínio como numa subpasta (`/REPOSITORIO/` no GitHub Pages), sem alterar o `base` do Vite.

© 2026 KEYHOUSE PROPERTIES
