<<<<<<< HEAD
# UrbanSense
=======
# DrenaAlerta
>>>>>>> bfba7e9 (Fazendo a API)

## Ficha da CitizenTech

| Campo | Resposta |
|---|---|
<<<<<<< HEAD
| Nome da CitizenTech | UrbanSense |
| Cidade e bairro | São Paulo, região da Av. Paulista e entorno|
=======
| Nome da CitizenTech | DrenaAlerta (nome sugerido; troque se o grupo preferir) |
| Cidade e bairro | São Paulo, região da Av. Paulista e entorno (**ajustar para o bairro escolhido pelo grupo**) |
>>>>>>> bfba7e9 (Fazendo a API)
| Cidadão beneficiado | Moradores e comerciantes de ruas que alagam e as equipes de zeladoria/defesa civil que fazem a manutenção dos bueiros |
| Problema, em uma frase | Bueiros entupidos só são percebidos quando a água já está na rua, tarde demais para evitar o alagamento |
| Como funciona | Sensores medem nível e fluxo de água em cada bueiro; o sistema classifica em Normal, Atenção ou Crítico e avisa qual precisa de inspeção |
| O que cada parte faz | Python: regras e menu · Matemática: modelo de taxa de subida do nível · Sensor (ESP32/Wokwi): mede nível e fluxo · **Front-end/Web: painel (este repositório)** · Experiência: requisitos e protótipo · Pitch: vídeo |
| Link do repositório | _(colar o link do GitHub privado)_ |
| Indicador de impacto | Tempo entre o primeiro sinal de risco e a vistoria; nº de bueiros vistoriados antes de transbordar |
| ODS conectados | 11, 13 e 9 (detalhes abaixo) |

<<<<<<< HEAD
Dados: todos os dados são simulados, com locais aproximados. Não há dados pessoais.

O que o painel faz

- Mapa com a localização e a situação de cada bueiro.
- Classificação em Normal, Atenção e Crítico (regras em `src/lib/classification.js`).
- Nível, fluxo de entrada e de saída** de cada sensor, com **histórico em gráficos.
- Diferença entre chuva forte e entupimento**: nível alto sozinho não prova obstrução. O sistema compara entrada e saída; se entra água e a saída cai, indica entupimento provável.
- Alertas com a lista dos bueiros que precisam de inspeção.
- Registro de manutenção (vistoriado ou limpo). Após o registro, o alerta sai da lista até chegar uma leitura nova, pior que a vistoria.
- CRUD completo de bueiros (cadastrar, consultar, editar, excluir) em API externa.
- Simulador de sensor que faz o papel do ESP32 na demonstração.

Regras de classificação

| Situação | Critério |
|---|---|
| Crítico | Nível ≥ 80% da profundidade, ou nível ≥ 60% com subida rápida/escoamento muito baixo |
| Atenção | Nível ≥ 50%, ou saída < 70% da entrada (com nível ≥ 25%), ou subida ≥ 4 cm/10 min |
| Normal | Demais casos |

Os limites ficam em `LIMITES`, no mesmo arquivo. Eles são hipóteses de trabalho: com dados reais do sensor, o grupo deve calibrá-los.

 Tecnologias

React 18 + Vite, Tailwind CSS 3, React Leaflet (mapa), Recharts (gráficos), API REST externa (MockAPI.io).

 Como rodar
=======
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

React 18 + Vite, Tailwind CSS 3, React Leaflet (mapa), Recharts (gráficos), API REST externa (MockAPI.com).

## Como rodar
>>>>>>> bfba7e9 (Fazendo a API)

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
<<<<<<< HEAD
cp .env.example .env     
npm run dev
```

Sem `VITE_API_URL`, o app abre em **modo demonstração**: os dados ficam no navegador (localStorage). Isso serve só para testar.

## Configurar a API externa (MockAPI.io)

1. Crie uma conta em <https://mockapi.io> e um projeto novo.
2. Crie um recurso chamado **`bueiros`** com os campos: `nome` (String), `bairro` (String), `endereco` (String), `lat` (Number), `lng` (Number), `profundidade` (Number), `leituras` (Array/Object), `manutencoes` (Array/Object).
3. Copie a URL base do projeto (algo como `https://abc123.mockapi.io/api/v1`) para `VITE_API_URL` no `.env`.
4. Rode `npm run dev`. Com a lista vazia, clique em **Carregar dados de exemplo**.

> O ESP32 (Wokwi) pode enviar leituras para o mesmo recurso com `PUT /bueiros/:id`, usando o formato `{ t, nivel, entrada, saida }` em `leituras`. O painel atualiza sozinho a cada 15 segundos.
=======
cp .env.example .env     # depois edite o .env (próxima seção)
npm run dev
```

Sem `VITE_API_URL`, o app abre em **modo demonstração**: os dados ficam no navegador (localStorage). Isso serve só para testar. **Para a entrega, configure a API externa.**

## Configurar a API externa (MockAPI.com, projeto UrbanSense)

O projeto **UrbanSense** já tem o modelo e os endpoints criados:

- `GET /bueiros` e `POST /bueiros`
- `GET /bueiros/{id}`, `PUT /bueiros/{id}` e `DELETE /bueiros/{id}`

Para ativar:

1. Copie `.env.example` para `.env` e preencha `VITE_API_URL=https://api.mockapi.com` e `VITE_API_KEY` com a chave do projeto (Dashboard do MockAPI, em *UrbanSense*).
2. Reinicie o `npm run dev` (o Vite só lê o `.env` ao iniciar).
3. O banner amarelo de "modo demonstração" some. Se a lista estiver vazia, clique em **Carregar dados de exemplo**.

**Limites do plano gratuito:** o modo *stateful* guarda no máximo 25 registros por modelo e **zera os dados a cada 24 horas**. Depois de zerar, use "Carregar dados de exemplo" de novo. Faça isso antes de gravar o vídeo ou apresentar.

> A chave vai junto com o código do site (variáveis `VITE_` ficam visíveis no navegador). Para um protótipo com dados simulados isso é aceitável; não use uma chave de produção.

> O ESP32 (Wokwi) pode enviar leituras com `PUT /bueiros/:id`, no formato `{ t, nivel, entrada, saida }` dentro de `leituras`, usando o header `x-api-key`. O painel atualiza a cada 15 segundos.
>>>>>>> bfba7e9 (Fazendo a API)

## Deploy (Vercel ou Netlify)

1. Suba o repositório no GitHub.
2. Importe o projeto na Vercel/Netlify (preset **Vite**; build `npm run build`; saída `dist`).
<<<<<<< HEAD
3. Em *Environment Variables*, defina `VITE_API_URL` com a URL do MockAPI.
=======
3. Em *Environment Variables*, defina `VITE_API_URL` e `VITE_API_KEY`.
>>>>>>> bfba7e9 (Fazendo a API)
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
