# Tasks — Refatoração universeforalltwo

Data: 2026-10-11
Decisões: renomear pastas/componentes, Tailwind 3.4, React Query, sem TS/lint/testes neste ciclo.

## Task 1 — Base: Tailwind + React Query + env [concluída]

- [x] Instalar `@tanstack/react-query` + `tailwindcss@3.4.1 postcss autoprefixer` (`tailwindcss init -p`)
- [x] `tailwind.config.js` com `content` + cores `cosmic/abyss/nebula/wine`; `postcss.config.js`; `src/styles/index.css`
- [x] Alias `@` → `src` no `vite.config.js`
- [x] `src/app/queryClient.js` (retry 1, sem refetch em focus, stale 1h)
- [x] `src/constants/config.js` (`VITE_NASA_API_KEY` via `import.meta.env`) + `.env.example`
- [x] `.env` no `.gitignore`; `.env` migrado de `APOD_TOKEN` → `VITE_NASA_API_KEY`
- [x] `QueryClientProvider` no `App`
- [x] `npm run build` passa

## Task 2 — Pastas, rotas e props [concluída]

- [x] `views/putInfo → pages/HomePage`; `views/content → pages/ApodContentPage` (via `git mv`)
- [x] `MyHeader → layout/Header`; `myFooter → layout/Footer` (+ novo `layout/PageLayout`); `info → apod/ApodInfo`; `preview → apod/ApodPreview`; `input → ui/TextInput`
- [x] `Routers.jsx → app/routes.jsx` (`createBrowserRouter`) + `constants/routes.js`; `App.jsx` com `RouterProvider`
- [x] Props: `tittle → title`, `func → onChange`; `TextInput` com `label/value/...rest`; `ApodPreview` com `alt` + `lazy`; remover código comentado
- [x] Barrels `index.js` por componente/página (imports com `/index.js` explícito — exigência do Rollup)
- [x] `npm run build` passa; grep sem referências aos caminhos antigos

## Task 3 — Camada de dados APOD [concluída]

- [x] `services/apiClient.js` (axios, baseURL NASA, timeout 10s)
- [x] `features/apod/apodService.js` (`getApodByDate`, normaliza `{title, explanation, url, mediaType, date}`, traduz erros)
- [x] `features/apod/dateValidation.js` (`isValidApodDate`: regex + data real + faixa `1995-06-16..hoje`) + `utils/date.js` (`todayISO()`)
- [x] `features/apod/useApod.js` (`useQuery(['apod', date])`, `enabled` só p/ data válida) + barrel
- [x] `HomePage`: form controlado, valida e navega p/ `/content?date=...` (sem axios/`localStorage`)
- [x] `ApodContentPage`: lê `?date=`, inválida → redirect `/`; estados loading/erro/sucesso; vídeo via `<iframe>`
- [x] `isValidApodDate`: 10/10 casos (passado, hoje, futuro, 1995-06-16/15, formato inválido, 29/02 bissexto/não, mês 13)
- [x] Grep: zero `localStorage`/`process.env` no `src`; `npm run build` passa

## Task 4 — UI final em Tailwind [concluída]

- [x] `apod/ApodSearchForm` (dono do estado + validação, `onSubmit(date)`) + `ui/Button` + `ui/ErrorMessage`
- [x] Converter `Header, Footer, PageLayout, ApodInfo, ApodPreview, TextInput, HomePage, ApodContentPage` p/ Tailwind
- [x] Deletar `App.css`, `index.css` (reset), todos os CSS por componente (único CSS: `styles/index.css`)
- [x] `npm run build` passa; classes `bg-nebula`/`from-cosmic` presentes no bundle; dev server HTTP 200

## Task 5 — Robustez contra placeholder da NASA [concluída]

Contexto: `api.nasa.gov` migrou o APOD p/ `science.nasa.gov/wp-json/wp/v2/apod-basic`
(legacy será arquivado em 2026-12-01) e passou a retornar de forma intermitente
um placeholder (`title: "NASA Science"` + logo) no lugar do conteúdo real.

- [x] `features/apod/apodEntry.js` puro: `isPlaceholderEntry()` + `normalizeApodEntry()` (prefere `hdurl` p/ imagem)
- [x] `apodService`: placeholder vira erro recuperável com mensagem específica (passthrough no `toErrorMessage`)
- [x] `ApodContentPage`: botão "Try again" (`refetch`) ao lado de "Choose another date"
- [x] 6/6 checks da lógica (placeholder/real/nulo, hdurl, vídeo, defaults); `npm run build` passa

## Task 6 — Validação manual no navegador [pendente]
- [ ] `/` data válida → `/content?date=...` mostra imagem + título
- [ ] `/` data futura → erro, não navega
- [ ] Refresh em `/content?date=...` recarrega via React Query
- [ ] `/content` sem `?date=` → volta para `/`
- [ ] APOD com vídeo → iframe, sem quebrar

## Task 7 — Migrar p/ nova API apod-basic [concluída]

Doc oficial: `https://api.nasa.gov/assets/files/apod/APOD-APIs-and-RSS-info.pdf`.
A API legada será arquivada em 2026-12-01. Descobertas: rota single-date
`/apod-basic/{YYMMDD}` (ex.: `261011`), `per_page` cap 25, filtros de data só
na listagem; `url` = permalink (não a imagem); `hdurl` = imagem full;
`explanation` em HTML; vídeo/iframe com embed em `basic_html`; sem `api_key`.

- [x] `config.js` → `APOD_BASIC_BASE_URL`; `apiClient` na nova base; `.env.example` sem chave (endpoint público)
- [x] `apodService`: `GET /apod-basic/{YYMMDD}` (via `toLegacyDateCode`), sem chave, 404 com mensagem por data
- [x] `apodEntry`: imagem → `hdurl`; vídeo/iframe → `src` do `<iframe>` em `basic_html`; `explanation` via `stripHtml` (`utils/html.js`); `alt` real; placeholder mantido como rede de segurança
- [x] `ApodPreview` com prop `alt`; `ApodContentPage` repassa `data.alt`
- [x] 7/7 checks (YYMMDD, strip HTML/entities, hdurl, vídeo, placeholder); `npm run build` passa; zero refs à API legada no `src`

## Backlog — fora de escopo

- [ ] TypeScript
- [ ] ESLint/Prettier
- [ ] Testes automatizados

## Convenções (valem p/ código novo)

- Pasta PascalCase = componente/página; arquivo principal + `index.js`; imports de barrel com `/index.js` explícito
- `pages/` p/ rotas; `features/<domínio>/` p/ service + hook + validação; `services/` p/ infra; `constants/` p/ rotas e config
- Componentes: 1 função cada, props explícitas (`title`, `onChange`, `onSubmit`), sem `localStorage`/`axios` em JSX
- Estilos: Tailwind + cores do theme (`cosmic`, `abyss`, `nebula`, `wine`); sem CSS global
