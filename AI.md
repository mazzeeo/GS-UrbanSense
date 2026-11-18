# Uso de Inteligência Artificial

> **Atenção, grupo:** este arquivo foi iniciado com o que de fato aconteceu na geração do projeto. A disciplina exige que ele reflita as interações **reais** do grupo. Complete os trechos marcados com **[PREENCHER]** e acrescente os prompts que vocês mesmos usarem daqui em diante. Se mudarem o código, registrem aqui.

## Ferramentas utilizadas

| Ferramenta | Finalidade |
|---|---|
| Claude (Anthropic) | Gerar a estrutura inicial do projeto React/Vite/Tailwind, os componentes, os hooks, as regras de classificação e a documentação inicial |
| **[PREENCHER]** | Outras ferramentas, se houver |

## Interações realizadas

**Prompt 1 (resumo):** o grupo enviou o PDF do Desafio FIAP CitizenTech (Engenharia de Software, 1º ano) e pediu a entrega de Web Development e Front-end Design, a partir da ideia: monitorar bueiros para antecipar entupimentos e alagamentos, classificando cada bueiro em Normal, Atenção e Crítico, com mapa, nível da água, histórico, alertas e registro de manutenção. O prompt também destacava que nível alto sozinho não prova entupimento e que um sensor de fluxo ajudaria.

**Resposta obtida:** projeto completo (React + Vite + Tailwind) com componentes, hooks, serviço de API com CRUD, regras de classificação, dados simulados, README e este arquivo.

**[PREENCHER]** Prompts seguintes feitos pelo grupo (ajustes, correções de erro, mudanças visuais), com um trecho representativo da resposta.

## Aplicação no projeto

- **Gerado com auxílio da IA:** toda a estrutura de pastas, os componentes de `src/components/`, os hooks de `src/hooks/`, `lib/classification.js`, `lib/simulation.js`, `services/` e `data/seed.js`.
- **[PREENCHER]** O que o grupo modificou, adicionou ou reescreveu por conta própria.

## Validação das respostas

Como o código foi verificado antes de ser gerado nesta etapa:

- A lógica de classificação foi executada em Node sobre os 8 bueiros simulados e os resultados bateram com o esperado: 4 normais, 2 em atenção por indício de entupimento, 1 em atenção por chuva (sem indício de entupimento) e 1 crítico.
- O projeto **não foi compilado** por quem o gerou (sem acesso à internet para instalar as dependências).

**[PREENCHER]** O que o grupo testou: `npm install` e `npm run dev` sem erros; criar, editar e excluir bueiros na API externa; cenários do simulador (tempo seco, chuva forte, entupimento); uso em celular; navegação por teclado; deploy funcionando. Registrem bugs encontrados e como corrigiram.

## Análise crítica

- **Benefícios:** a IA acelerou a montagem da estrutura e deixou a separação entre visual, dados e regras bem definida.
- **Limitações:** os limites de classificação (50%, 80%, 70% etc.) são hipóteses, não valores medidos. Os dados são simulados e as coordenadas são aproximadas. O código não foi executado de ponta a ponta antes da entrega inicial.
- **[PREENCHER]** Dificuldades do grupo ao usar a IA e o que aprenderam. Cada integrante precisa saber explicar o projeto inteiro.

## Correção e melhoria da API (Claude Code)

**Prompt (resumo):** pedimos ao Claude Code que baixasse o repositório do GitHub, deixasse a API funcionando no sistema e fizesse commits regulares até completar 15.

**O que foi encontrado:** o commit "Criando a API" subiu com marcadores de conflito de merge (`<<<<<<<`, `=======`, `>>>>>>>`) em 8 arquivos, então o projeto nem compilava. Além disso, o `.env.example` apontava para `.../urbansenseAPI/Bueiros` e o código ainda adicionava `/bueiros`, gerando uma URL inexistente (404).

**O que foi feito:**

- Conflitos resolvidos arquivo por arquivo, mantendo o nome UrbanSense.
- `manholeApi.js`: URL do recurso corrigida, tempo limite de 10 s, até 3 tentativas em erro de rede/429/5xx, mensagens de erro em português, corpo das requisições limpo (sem `id`, números convertidos, histórico limitado) e nova rota `GET /:id`.
- `useManholes.js`: a atualização automática não sobrescreve mais a lista durante uma gravação, pausa com a aba oculta e o carregamento de exemplos mantém na tela os bueiros já criados se a API falhar no meio.
- Script `npm run test:api` que testa o CRUD completo na API real.
- Remoção da pasta `drenaalerta/` duplicada e atualização do README.

**Validação:** `npm run build` sem erros; `npm run test:api` com POST, GET, GET /:id, PUT e DELETE OK no MockAPI.io; no navegador, "Carregar dados de exemplo" gravou 8 bueiros na API e o registro de vistoria foi salvo via PUT, sem erros no console.
