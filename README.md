# UrbanSense

## Ficha da CitizenTech

| Campo | Resposta |
|---|---|
| Nome da CitizenTech | UrbanSense |
| Cidade e bairro | São Paulo, região da Av. Paulista e entorno |
| Cidadão beneficiado | Moradores e comerciantes de ruas que alagam e as equipes de zeladoria/defesa civil que fazem a manutenção dos bueiros |
| Problema, em uma frase | Bueiros entupidos só são percebidos quando a água já está na rua, tarde demais para evitar o alagamento |
| Como funciona | Sensores medem nível e fluxo de água em cada bueiro; o sistema classifica em Normal, Atenção ou Crítico e avisa qual precisa de inspeção |
| O que cada parte faz | Python: regras e menu · Matemática: modelo de taxa de subida do nível · Sensor (ESP32/Wokwi): mede nível e fluxo · **Front-end/Web: painel (este repositório)** · Experiência: requisitos e protótipo · Pitch: vídeo |
| Link do repositório | _(colar o link do GitHub privado)_ |
| Indicador de impacto | Tempo entre o primeiro sinal de risco e a vistoria; nº de bueiros vistoriados antes de transbordar |
| ODS conectados | 11, 13 e 9 (detalhes abaixo) |

**Dados:** todos os dados são **simulados**, com locais aproximados. Não há dados pessoais.

## O que o painel faz

- **Mapa** com a localização e a situação de cada bueiro.
- **Classificação** em Normal, Atenção e Crítico (regras em `src/lib/classification.js`).
- **Nível, fluxo de entrada e de saída** de cada sensor, com **histórico em gráficos**.
- **Diferença entre chuva forte e entupimento**: nível alto sozinho não prova obstrução. O sistema compara entrada e saída; se entra água e a saída cai, indica entupimento provável.
- **Alertas** com a lista dos bueiros que precisam de inspeção.
- **Registro de manutenção** (vistoriado ou limpo). Após o registro, o alerta sai da lista até chegar uma leitura nova, pior que a vistoria.
- **CRUD completo** de bueiros (cadastrar, consultar, editar, excluir) em API externa.
- **Simulador de sensor** que faz o papel do ESP32 na demonstração.

### Regras de classificação

| Situação | Critério |
|---|---|
| Crítico | Nível ≥ 80% da profundidade, **ou** nível ≥ 60% com subida rápida/escoamento muito baixo |
| Atenção | Nível ≥ 50%, **ou** saída < 70% da entrada (com nível ≥ 25%), **ou** subida ≥ 4 cm/10 min |
| Normal | Demais casos |

Os limites ficam em `LIMITES`, no mesmo arquivo. Eles são **hipóteses de trabalho**: com dados reais do sensor, o grupo deve calibrá-los.

## Tecnologias

React 18 + Vite, Tailwind CSS 3, React Leaflet (mapa), Recharts (gráficos), API REST externa (MockAPI.io).

## Como rodar

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
cp .env.example .env     # depois edite o .env (próxima seção)
npm run dev
```

Sem `VITE_API_URL`, o app abre em **modo demonstração**: os dados ficam no navegador (localStorage). Isso serve só para testar. **Para a entrega, configure a API externa.**

## Configurar a API externa (MockAPI.io)

O projeto **UrbanSense** usa o recurso `Bueiros` no MockAPI.io:

```
https://6afc8dd4892984c4494bb869.mockapi.io/urbansenseAPI/Bueiros
```

| Operação | Método e rota |
|---|---|
| Listar bueiros | `GET /Bueiros` |
| Consultar um bueiro | `GET /Bueiros/:id` |
| Cadastrar | `POST /Bueiros` |
| Editar / enviar leituras | `PUT /Bueiros/:id` |
| Excluir | `DELETE /Bueiros/:id` |

Campos de cada bueiro: `nome`, `bairro`, `endereco`, `lat`, `lng`, `profundidade` (cm), `leituras` (lista de `{ t, nivel, entrada, saida }`) e `manutencoes`.

Para ativar:

1. Copie `.env.example` para `.env` (ele já vem com a URL acima em `VITE_API_URL`).
2. Reinicie o `npm run dev` (o Vite só lê o `.env` ao iniciar).
3. O banner amarelo de "modo demonstração" some. Se a lista estiver vazia, clique em **Carregar dados de exemplo**.

`VITE_API_URL` aceita a URL completa do recurso ou só a base do projeto (nesse caso o app adiciona `/bueiros`). `VITE_API_KEY` é opcional e só é enviada (header `x-api-key`) se estiver preenchida.

**Como o app trata a API** (`src/services/manholeApi.js`):

- Tempo limite de 10 s por requisição e até 3 tentativas em falhas de rede, erro 429 (muitas requisições) ou 5xx.
- Mensagens de erro em português para 400, 401, 403, 404 e 429.
- Normaliza a resposta (números, listas vazias) e limita o histórico a 96 leituras por bueiro, para o registro não crescer sem fim.
- A atualização automática (15 s) pausa com a aba oculta e não sobrescreve a lista durante uma gravação.

Para testar a API sem abrir o site: `npm run test:api` (cria, lê, edita e exclui um bueiro de teste).

> O ESP32 (Wokwi) pode enviar leituras com `PUT /Bueiros/:id`, no formato `{ t, nivel, entrada, saida }` dentro de `leituras`. O painel atualiza a cada 15 segundos.

## Deploy (Vercel ou Netlify)

1. Suba o repositório no GitHub.
2. Importe o projeto na Vercel/Netlify (preset **Vite**; build `npm run build`; saída `dist`).
3. Em *Environment Variables*, defina `VITE_API_URL` (e `VITE_API_KEY`, se usar).
4. Cole o link do deploy na entrega do Teams.

## Arquitetura

```
src/
  components/   Apresentação (14 arquivos de componentes), sem regra de negócio
  hooks/        useManholes (CRUD + atualização), useFilters (classificação e filtros), useSensorSimulator
  services/     manholeApi (HTTP) e localStore (modo demonstração)
  lib/          classification (regras), simulation, format
  data/         seed (dados simulados)
```

## Requisitos da disciplina

| Requisito | Onde está |
|---|---|
| React com Vite | `package.json`, `vite.config.js` |
| Tailwind CSS | `tailwind.config.js`, `src/index.css` |
| 8+ componentes | `src/components/` |
| `useState` e `useEffect` | `App.jsx`, `hooks/`, `ManholeFormModal.jsx` |
| 2+ custom hooks | `src/hooks/` (3 hooks) |
| Separação de responsabilidades | `services/` (dados), `lib/` (regras), `components/` (visual) |
| API externa com CRUD | `services/manholeApi.js` |
| Git, 15+ commits | histórico do repositório |
| `AI.md` | raiz do projeto |

## ODS

- **ODS 11 (Cidades e comunidades sustentáveis):** reduz o risco de alagamentos urbanos e organiza a manutenção da drenagem.
- **ODS 13 (Ação contra a mudança global do clima):** ajuda a cidade a se adaptar a chuvas intensas.
- **ODS 9 (Indústria, inovação e infraestrutura):** usa sensores de baixo custo para tornar a infraestrutura de drenagem mais resiliente.

## Equipe

_(nome completo e RM de cada integrante)_
