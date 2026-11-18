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

## Correção da API

Ao integrar a API, o grupo identificou que o commit "Criando a API" tinha subido com marcadores de conflito de merge e que a URL do recurso `Bueiros` estava sendo montada errado (404). Usamos o Claude Code como ferramenta de apoio para agilizar a resolução dos conflitos e sugerir ajustes no código de acesso à API.

**Ajustes realizados pelo grupo, com apoio da ferramenta:**

- Resolução dos conflitos de merge, mantendo o nome UrbanSense.
- Correção da URL do recurso no MockAPI.io e melhorias no tratamento de erros da API (`manholeApi.js`).
- Ajustes na atualização automática dos dados (`useManholes.js`).
- Script `npm run test:api` para testar o CRUD.

**Validação:** o grupo revisou as alterações e testou a aplicação: build sem erros, CRUD completo (cadastrar, consultar, editar e excluir) funcionando no MockAPI.io e o painel exibindo e gravando os dados corretamente no navegador.
