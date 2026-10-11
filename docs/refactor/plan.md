# Plano de Refatoração — universeforalltwo

Data: 2026-10-11
Status: PR1 e PR2 concluídos; PR3 e PR4 pendentes.
Decisões: renomear pastas/componentes, Tailwind, React Query, sem TS/lint/testes neste ciclo.

## Progresso
- [x] PR1: Tailwind 3.4 + React Query instalados; `tailwind/postcss.config`, `styles/index.css`, alias `@`, `app/queryClient.js`, `constants/config.js`, `.env.example`; `.env` no `.gitignore`; `QueryClientProvider` no `App`.
- [x] PR2: `views → pages/HomePage + pages/ApodContentPage`; `components → layout/Header,Footer,PageLayout + apod/ApodInfo,ApodPreview + ui/TextInput`; `Routers.jsx → app/routes.jsx` (`createBrowserRouter`) + `constants/routes.js`; props `tittle→title`, `func→onChange`; `ApodPreview` com `alt` + `lazy`; barrels `index.js`.
- [ ] PR3: `apiClient + apodService + dateValidation + useApod` + navegação `?date=` + remove `localStorage`.
- [ ] PR4: `ApodSearchForm + Button + ErrorMessage` + conversão Tailwind + deleta CSS legados.

## 1. Diagnóstico

### Estrutura atual
```
src/
  App.jsx / App.css / main.jsx / index.css / Routers.jsx
  views/content/Content.jsx + Content.css (vazio)
  views/putInfo/PutInfo.jsx + PutInfo.css
  components/info/ / input/ / myFooter/ / MyHeader/ / preview/
  assets/favicon.png
```

### Problemas
1. **Pastas sem convenção:** `myFooter` vs `MyHeader` vs `preview/info/input` minúsculos. `views/content` + `putInfo` não expressam domínio (APOD NASA). `Routers.jsx` solto na raiz, com `BrowserRouter` + `Fragment` desnecessário.
2. **Lógica acoplada à tela:** `PutInfo.jsx:16-58` valida data manual (`split("-")`), chama `axios` direto, escreve `localStorage`, navega. Sem `try/catch`, sem `loading`. `process.env.APOD_TOKEN` não funciona no Vite (deve ser `import.meta.env.VITE_*`).
3. **`localStorage` como store:** `Content.jsx:28-31` lê `localStorage` direto. Acesso direto/refresh em `/content` quebra com tela vazia.
4. **Componentes sem SRP / API ruim:** typo `tittle` (`MyHeader.jsx:5`, `Info.jsx:6`), prop `func` (`Input.jsx:5`), `Preview.jsx:5` sem `alt`/loading/suporte a vídeo, `MyFooter.jsx:5-8` com textos hardcoded, código morto comentado em `Content.jsx:16-18`.
5. **CSS vazando:** `App.css:1-52` com seletores globais (`body, main, footer, button, .App div`). Arquivos vazios: `Info.css`, `Input.css`, `MyFooter.css`, `Content.css`.

## 2. Estrutura alvo

```
src/
  app/
    App.jsx                 # só QueryClientProvider + RouterProvider
    routes.jsx              # ex-Routers.jsx, createBrowserRouter
    queryClient.js          # QueryClient centralizado
  pages/
    HomePage/
      HomePage.jsx          # compõe PageLayout + ApodSearchForm
      index.js
    ApodContentPage/
      ApodContentPage.jsx   # lê ?date= da URL + useApod(date)
      index.js
  components/
    ui/
      Button/Button.jsx + index.js
      TextInput/TextInput.jsx + index.js
      ErrorMessage/ErrorMessage.jsx + index.js
    layout/
      Header/Header.jsx + index.js
      Footer/Footer.jsx + index.js
      PageLayout/PageLayout.jsx + index.js
    apod/
      ApodSearchForm/ApodSearchForm.jsx + index.js
      ApodPreview/ApodPreview.jsx + index.js
      ApodInfo/ApodInfo.jsx + index.js
  features/apod/
    apodService.js          # getApodByDate(date)
    useApod.js              # useQuery(['apod', date])
    dateValidation.js       # isValidApodDate()
  services/
    apiClient.js            # axios.create
  utils/
    date.js                 # todayISO()
  constants/
    routes.js               # ROUTES
    config.js               # VITE_NASA_API_KEY
  styles/
    index.css               # só @tailwind directives
  assets/
```

Deletar: `App.css`, `index.css` antigo (reset manual), `*.css` vazios por componente, `Routers.jsx` antigo.

Convenções:
- Pasta PascalCase = componente/página. Arquivo principal + `index.js` barrel.
- `pages/` em vez de `views/`.
- Tailwind em vez de CSS global / CSS Modules.
- Alias `@/` → `src` no `vite.config.js`.

## 3. Fase 0 — Dependências

1. `npm i @tanstack/react-query` + `npm i -D tailwindcss postcss autoprefixer` (axios já existe).
2. `npx tailwindcss init -p` → `tailwind.config.js` com `content: ["./index.html","./src/**/*.{js,jsx}"]`.
3. `src/styles/index.css` com `@tailwind base/components/utilities`.
4. `main.jsx` importa `./styles/index.css`, remove `./index.css` e `./App.css`.
5. Criar `.env.example` com `VITE_NASA_API_KEY=` e centralizar em `constants/config.js` via `import.meta.env`.

## 4. Fase 1 — Renomeação + Rotas + QueryClient

1. `Routers.jsx → app/routes.jsx`: trocar `BrowserRouter + Routes` por `createBrowserRouter`, remover `Fragment`.
2. `App.jsx`: só `<QueryClientProvider><RouterProvider/></>`.
3. Renomear:
   - `views/putInfo → pages/HomePage`
   - `views/content → pages/ApodContentPage`
   - `MyHeader → layout/Header`, `myFooter → layout/Footer`, `info → apod/ApodInfo`, `preview → apod/ApodPreview`, `input → ui/TextInput`
4. Corrigir API: `tittle → title`, `func → onChange`.

Critério: `npm run dev` abre as 2 rotas iguais a hoje.

## 5. Fase 2 — Abstração APOD + React Query

Substitui `PutInfo.jsx:44-58` e `Content.jsx:28-31`.

1. `services/apiClient.js` — instância axios com baseURL NASA + timeout.
2. `features/apod/apodService.js` — `getApodByDate(date)`, normaliza `{title, explanation, url, mediaType}`.
3. `features/apod/dateValidation.js` — substitui `verify()` manual por `Date` + mínimo `1995-06-16`.
4. `features/apod/useApod.js` — `useQuery({queryKey:['apod',date], enabled: !!date && isValid, staleTime: Infinity, retry:1})`.
5. Navegação por URL: `HomePage` → `navigate('/content?date=YYYY-MM-DD')`; `ApodContentPage` lê `useSearchParams().get('date')`. Sem `localStorage` em JSX. Sem data → redirect `/`.

## 6. Fase 3 — SRP UI + Tailwind

| Antes | Depois |
|---|---|
| `PutInfo.jsx:60-85` | `HomePage` só compõe `PageLayout + ApodSearchForm` |
| form em `PutInfo.jsx:68-76` | `ApodSearchForm({onSubmit})` com estado controlado, usa `TextInput + Button + ErrorMessage` |
| `Input.jsx` | `TextInput({label, value, onChange, error, type})`, sem efeito colateral |
| `Preview.jsx` | `ApodPreview({src, title, mediaType})` com `alt`, `loading="lazy"`, `<iframe>` se vídeo, skeleton se `!src` |
| `Info.jsx` | `ApodInfo({title, description})` puro |
| `MyHeader/MyFooter` | `Header({title})` + `Footer()` + `PageLayout({children})` |
| `App.css` global | Classes Tailwind inline + `theme.extend` no `tailwind.config.js` |

## 7. Ordem de PRs

1. **PR1:** Tailwind + `.env.example` + alias `@` + `queryClient.js`.
2. **PR2:** Renomeios + `routes.jsx` + `PageLayout/Header/Footer` + correções `title/onChange`.
3. **PR3:** `apiClient + apodService + dateValidation + useApod` + navegação `?date=` + remove `localStorage`.
4. **PR4:** `ApodSearchForm + ApodPreview + ApodInfo + ui/*` em Tailwind + deleta CSS antigos.

## 8. Validação manual

- [ ] `/` data válida → `/content?date=...` mostra imagem + título.
- [ ] `/` data futura → erro, não navega.
- [ ] Refresh em `/content?date=...` recarrega via React Query.
- [ ] `/content` sem `?date=` → volta para `/`.
- [ ] APOD vídeo → iframe, sem quebrar.
- [ ] `npm run build` passa, sem `process.env`, sem `localStorage` em JSX, sem CSS por componente.

## 9. Fora de escopo (depois)

- TypeScript, ESLint/Prettier, testes automatizados.
- Redux/Zustand (desnecessário para 2 telas).
- Risco: Tailwind vs Vite 4 — se incompatível, fixar `tailwindcss@3.4`. React Query exige `QueryClientProvider` no topo.
