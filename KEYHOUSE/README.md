# 🏛️ KEYHOUSE PROPERTIES

**A plataforma imobiliária premium de Moçambique.** Anúncios verificados, contactos protegidos, visitas confirmadas.

Este guia explica, passo a passo, como pôr o site no ar — **sem instalar nada no computador**.

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
4. **Criar o ficheiro de publicação:** abre `https://github.com/UTILIZADOR/REPOSITORIO/new/main?filename=.github/workflows/deploy.yml`
   → confirma que o caminho mostra **`.github / workflows / deploy.yml`** (se o nome estiver vazio, escreve-o)
   → cola o conteúdo da secção **[📄 Ficheiro de publicação](#-ficheiro-de-publicação-para-colar)**
   → **Confirmar alterações** (*Commit changes*) → **Confirmar alterações** outra vez na janela.
5. **Acompanhar:** abre o separador **Ações** (*Actions*) → espera 2 a 4 minutos: 🟡 a correr → ✅ concluído.
   - Se não aparecer nada, ou aparecer cinzento: **Publicar no GitHub Pages** → **Executar fluxo de trabalho** (*Run workflow*) → botão verde.
6. O site fica em **`https://UTILIZADOR.github.io/REPOSITORIO/`** — também em **Configurações → Páginas → Visitar site**. 🎉

**Para actualizar depois:** descarrega o ZIP novo → carrega-o para o repositório (**Adicionar arquivo → Carregar arquivos**) → **Confirmar alterações**. O site actualiza-se sozinho em ~3 minutos. O fluxo usa sempre o **ZIP carregado mais recentemente**.
Isto só funciona enquanto o repositório não tiver os ficheiros descompactados: se tiver `package.json`, o ZIP é ignorado (ver Caminho B).

### Caminho B — Carregar os ficheiros descompactados

1. Descompacta o ZIP (botão direito → **Extrair tudo**). Abre as pastas até veres `package.json`. Se existirem `node_modules` e `dist`, **apaga-as**.
2. Abre a página de carregamento na **raiz** do repositório: `https://github.com/UTILIZADOR/REPOSITORIO/upload/main` (ou **Adicionar arquivo → Carregar arquivos**, na página principal, não dentro de uma pasta).
   - Põe as janelas lado a lado: **tecla Windows + ←** no Explorador e **tecla Windows + →** no navegador.
   - Na pasta do projecto: **Ctrl + A** → arrasta a selecção para a página do GitHub. Arrasta o **conteúdo**, não a pasta em si (a pasta `.github` também vai).
   - Espera que a lista mostre todos os ficheiros (cerca de 60) → **Confirmar alterações** (*Commit changes*), com a opção de commit directo no `main`.
3. Confirma que a página do repositório mostra `.github`, `public`, `src` e `package.json`.
4. Activa o GitHub Pages (passo 3 do Caminho A) e acompanha em **Ações** (passo 5).
5. ✅ **Sinal de que correu bem:** por baixo da lista de ficheiros do repositório aparece este guia (🏛️ KEYHOUSE PROPERTIES).

**Para actualizar depois:** extrai o ZIP novo → carrega outra vez o **conteúdo** da pasta (os ficheiros novos substituem os antigos) → **Confirmar alterações**. Depois de o repositório ter `package.json`, os ficheiros `.zip` são ignorados. Os ZIPs antigos podem ficar ou ser apagados.

> ⚠️ Arrasta os ficheiros seleccionados, não uses o botão **escolher seus arquivos** (*choose your files*): esse botão não aceita pastas.
>
> Se arrastares a **pasta** em vez do conteúdo, o site compila na mesma, mas a `.github` fica dentro da subpasta e o GitHub não a reconhece. Nesse caso, cria o ficheiro de publicação na raiz (passo 4 do Caminho A).

> Se a pasta `.github` não tiver subido (alguns computadores escondem pastas que começam por ponto), cria o ficheiro à mão: passo 4 do Caminho A.

### ⚠️ Codespaces não é Páginas

No menu das **Configurações**, o **Codespaces** fica mesmo por cima de **Páginas**. O Codespaces é outro serviço (programação na nuvem): o ecrã de "pré-compilação" avisa que *"consomem espaço de armazenamento, o que acarretará uma cobrança"*. **Não cliques em Criar.** Usa o link directo do passo 3 — vais parar à página certa, com o título **"GitHub Pages"**.

Se já criaste uma pré-compilação por engano: `https://github.com/UTILIZADOR/REPOSITORIO/settings/codespaces` → **⋯** ao lado da configuração → **Excluir** → **OK**.

### 📄 Ficheiro de publicação (para colar)

Nome do ficheiro: **`.github/workflows/deploy.yml`** (na raiz do repositório, não dentro de outra pasta).

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

## 🛡️ Página de pagamento — porque é assim

Os robôs anti-phishing suspendem automaticamente sites que **pareçam** recolher credenciais. Por isso, a demonstração **não** pede a senha do PayPal nem o PIN do M-Pesa/e-Mola, e mostra o aviso **"Modo demonstração — a KEYHOUSE nunca lhe pede o PIN"**.

---

## ✅ Antes do lançamento público

- [ ] **Pagamentos simulados** → integrar M-Pesa (Vodacom), e-Mola (Movitel) e PayPal Checkout.
- [ ] **Lembretes WhatsApp simulados** → WhatsApp Business API.
- [ ] **Dados no navegador** → backend com base de dados, contas e armazenamento de fotos.
- [ ] **Estatísticas e testemunhos da homepage** → números reais (`src/pages/Landing.tsx`).
- [ ] **WhatsApp, email e morada** → `src/lib/constants.ts` (objecto `BRAND`).
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
