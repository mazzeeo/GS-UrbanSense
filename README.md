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
| Link do repositório | https://github.com/mazzeeo/GS-UrbanSense |
| Link do deploy (Vercel) | https://gs-urbansense.vercel.app |
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
cp .env.example .env     # já vem com a URL da API
npm run dev
```

Sem `VITE_API_URL`, o app abre em **modo demonstração**: os dados ficam no navegador (localStorage). Isso serve só para testar. **Para a entrega, configure a API externa.**

## Links

- **Site publicado (Vercel):** https://gs-urbansense.vercel.app
- **Repositório no GitHub:** https://github.com/mazzeeo/GS-UrbanSense

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

| Nome | RM |
|---|---|
| Eduardo Arruda | 573313 |
| Lucas Mazzeo | 570668 |
| Henry Ferreira | 571544 |
| Renan Oliveira | 571837 |
