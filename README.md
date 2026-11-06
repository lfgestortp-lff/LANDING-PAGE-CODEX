# Landing page da seletiva de modelos 45+

Página estática em HTML, CSS e JavaScript, sem dependências de produção ou build. Público: mulheres a partir dos 45 anos. Estrutura do modelo preservada, com fundo ameixa, detalhes champagne, textos maiores e botão verde pulsante. A idade não é bloqueada automaticamente; o foco 45+ é comunicado na copy.

## Desenvolvimento

Use o checkout existente; cada tarefa cloud já possui ambiente isolado.

```sh
cd /workspace/LANDING-PAGE-CODEX
python3 -m http.server 3000 --bind 0.0.0.0
```

Confira o HTML por uma requisição local e abra em um navegador para validar o formulário. Processos precisam ser iniciados novamente em novas tarefas.

## Integrações

- `app.js`: endereço público do Google Apps Script e Meta Pixel `1801282187897715`.
- O formulário abre uma confirmação antes de enviar. `Lead` só é disparado quando a API retorna `ok: true` e `CADASTRADO`.
- Eventos personalizados: `AttendanceYes`, `AttendanceNo`, `FormStart`, `ReviewData`, `ConfirmSubmit`. Eventos anteriores à decisão ficam apenas em memória até aceitar; recusa descarta a fila.
- O Pixel carrega após aceitar rastreamento. Dados pessoais não são enviados como parâmetros dos eventos.
- A API é responsável por gravar e conferir duplicidade; o cliente aceita telefone com ou sem DDD.
- Não há recuperação de abandono ou armazenamento local dos campos pessoais.
- Cores ficam nas variáveis de `:root` em `styles.css`.
- Cronômetro compartilhado pela campanha: configure `CAMPAIGN_END_AT` em `app.js` com data e fuso reais. Sem data confirmada, a página mostra três passos de inscrição no mesmo espaço, sem urgência individual. Ao expirar, impede novos envios na interface; o Apps Script precisará de validação própria se o prazo também for obrigatório no servidor.

## Antes de publicar a campanha

Definir responsável pelo tratamento, política de privacidade, finalidade, retenção e tratamento de inscrições de menores. Adicionar proteção contra abuso no serviço de envio. Validar em navegador o envio pela origem de produção e os eventos no Gerenciador de Eventos da Meta. Os testes HTTP da API não comprovam CORS nem recebimento dos eventos pela Meta. A campanha não tem data de encerramento definida; mantém-se o bloco de três passos. A identidade visual oficial ainda está pendente.

## Presença em Piracicaba

O formulário abre diretamente, sem pergunta de cidade nem bloqueio por distância. A cidade da seletiva continua visível. Mulheres de outras cidades podem se inscrever se tiverem disponibilidade de comparecer. A estimativa de origem por IP serve apenas para análise.

## Fundo ilustrativo

`assets/mulheres-45plus-fundo.fdf87ce01a.webp` é a versão otimizada de uma composição gerada por IA com três mulheres fictícias, desfocada e mesclada em degradê. Não representa modelos reais da agência. O fundo é decorativo, usa camadas de contraste no CSS e enquadramento específico para celular.

## Copy e confiança

Público, gratuidade da inscrição e Piracicaba são informados logo na primeira tela. A página explica a confirmação e o contato posterior pelo WhatsApp informado e mantém o Instagram oficial na tela de encerramento para quem não pode ir a Piracicaba. A agência confirmou aceitação de mulheres sem experiência e contato posterior pelo WhatsApp. Não são prometidos outros serviços gratuitos. Fotos reais de trabalhos/modelos podem substituir as ilustrações quando fornecidas com autorização; não há depoimentos ou resultados inventados.

## Prioridade no celular

Até 800px, o formulário e seu botão aparecem primeiro, com público e cidade resumidos. A explicação do contato fica depois do botão; a copy e os três passos vêm depois do cartão. No computador, a copy continua à esquerda e o formulário à direita. A ordem do HTML começa pelo formulário para acompanhar a navegação por teclado no celular. O link do Instagram foi retirado do formulário; permanece na tela mostrada ao responder Não.

## UTMs e nova planilha

O formulário captura `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` e `utm_id` da URL em memória e envia junto ao cadastro, com página de entrada sem parâmetros adicionais, domínio de referência e ID do evento Lead. A nova implantação do Apps Script foi conectada depois de retornar CADASTRADO com o mesmo ID de evento enviado e bloquear a duplicidade com e sem DDD. As seis UTMs seguem junto ao cadastro; confira a linha de teste na planilha para validar visualmente todas as colunas. A implementação está em `integrations/google-apps-script.js`; configuração em `integrations/PLANILHA.md`. A API de Conversões está implementada em `netlify/functions/meta-events.mjs` e um PageView real pelo servidor foi aceito pela Meta em produção (`events_received: 1`). Pixel e servidor compartilham IDs para deduplicação, sem garantir entrega. Veja `integrations/NETLIFY-META.md`.

Teste do receptor da nova planilha, com serviços simulados: `node --test tests/sheets.test.cjs`.

## Publicação atual e API de Conversões

Site informado: `https://produtoraangels.netlify.app/`. A publicação contínua pelo GitHub é recomendada para publicar as Netlify Functions. O token `META_CAPI_ACCESS_TOKEN` deve ser configurado diretamente no Netlify, com escopo de Functions. O repositório não contém credenciais. O fallback preserva o cadastro e o Pixel se a função não estiver publicada/configurada. Os testes automatizados usam serviços simulados. Um teste real de PageView em produção retornou HTTP 200 e `events_received: 1`; ainda é necessário conferir no Gerenciador de Eventos o recebimento pelo navegador e a deduplicação dos eventos da inscrição. O acesso público da nova URL de Apps Script foi corrigido. O cadastro de teste retornou CADASTRADO com o ID esperado e as duas tentativas duplicadas foram bloqueadas. `ENDPOINT` aponta para a nova implantação. A planilha de destino configurada pela agência é `11krxUfD4c_v_kOWoQ4uEJGowRqQnnOxIvFLzkDObupU`. A confirmação visual da linha e das UTMs na planilha continua a cargo da agência, pois não há acesso de leitura à planilha nesta ferramenta.

## Validação em produção

O site `https://produtoraangels.netlify.app/` retornou HTTP 200 com formulário e JavaScript contendo a nova planilha e API de Conversões. A função inicialmente recusou a origem; a correção preserva o domínio atual mesmo se `URL` estiver desatualizada. Após publicação automática, o endpoint rejeitou um pedido sem consentimento (`CONSENT_REQUIRED`) e aceitou um PageView autorizado de validação com HTTP 200 e `events_received: 1`, ID `validation-2fbccb1b-aa33-4cda-8e8b-5e99cf12c6f8`. Não foi enviado Lead nem criado cadastro nessa validação. Esse resultado comprova aceitação do evento pela API da Meta, não entrega universal ou a atribuição/deduplicação no painel.

## Prévia da Paleta A

`/paleta-a/` é um modelo visual separado, com fundo `#FFF9F0`, texto `#232323` e vinho `#6B2039`. Usa a estrutura compartilhada de CSS e mantém o formulário prioritário no celular, mas carrega apenas `preview.js`: não envia cadastros à planilha, não carrega Pixel e não envia eventos à Meta. O tema e a integração da página principal não são alterados. A prévia usa noindex/nofollow.

## Jundiaí

`/jundiai/` usa a paleta clara, a mesma lógica de rastreamento e a cidade Jundiaí. A implantação própria de Jundiaí foi fornecida, validada por cadastro e tentativas duplicadas e conectada em `jundiai/config.js`. Envios e rastreamento estão liberados para esta cidade; não há fallback para a planilha de Piracicaba. `jundiai/google-apps-script.js` já contém o ID da planilha e a aba 0. Não reutilizar o projeto de Apps Script de Piracicaba. A página principal e a prévia de cores continuam independentes.

## Idade opcional e visitantes de outras cidades

A copy informa que a participante pode morar em outra cidade, desde que consiga se deslocar para a seletiva presencial. O pop-up foi retirado, e residência ou localização estimada não condicionam o cadastro.

A idade é opcional diretamente no HTML. A capacidade foi confirmada nas duas implantações de Apps Script antes de remover a consulta que era feita em cada visita durante a migração. Omissão fica vazia na planilha e aparece como “Não informada” na confirmação; idades preenchidas continuam validadas de 1 a 120. Pixel, IDs e UTMs são preservados.

Para ativar em produção, atualizar o código inteiro e publicar **Nova versão** nas implantações existentes:

- Piracicaba: `integrations/google-apps-script.js`; preservar a propriedade PLANILHA_ID existente.
- Jundiaí: `jundiai/google-apps-script.js`, com ID próprio já preenchido.

Apps Script → Implantar → Gerenciar implantações → lápis → Nova versão → Implantar. Conservar a URL atual. Após cada atualização, conferir GET JSON com a capacidade e testar um cadastro autorizado sem idade. A prévia `/paleta-a/` já demonstra idade opcional e continua sem enviar dados.

## Áudio de instruções

`assets/instrucoes-inscricao.mp3` é a gravação fornecida pela agência, com aproximadamente 19 segundos e 326 KB. O botão fica depois do botão de inscrição, preservando campos e CTA prioritários no celular. `audio-instructions.js` inicia a reprodução no primeiro clique/toque em um campo do formulário (ou ao começar a digitar pelo teclado), dentro da interação exigida pelo navegador, e repete ao final enquanto a aba estiver visível. O botão permite pausar e continuar; não há som ao carregar a página. O primeiro toque no botão de áudio também permite ouvir, e uma pausa manual não é desfeita por tocar em outro campo. Navegadores, volume e configurações do aparelho podem impedir o som, portanto não há garantia de que todas as visitantes ouvirão. `preload=none` evita baixar o MP3 antes da interação; se o JavaScript falhar, há controles nativos como alternativa. Ao sair da aba ou da página, a reprodução é pausada e a repetição interrompida; ao voltar, é possível continuar pelo botão.

Falhas do arquivo não bloqueiam o formulário. O rastreamento usa `AudioInstructionsStart` e `AudioInstructionsComplete`, uma vez por página em cada estágio, pelos mesmos canais e regras de consentimento do formulário. Pausar/continuar ou repetir não cria novos Starts/Completes. Cada evento compartilha seu ID entre Pixel e API de Conversões; reproduzir não emite Lead. A prévia `/paleta-a/` também tem áudio, mas continua sem rastreamento e sem envio de cadastros.

## Origem aproximada por IP

`netlify/functions/location.mjs` usa a API v2 de Netlify Functions e o `context.geo` fornecido pela hospedagem. Retorna somente cidade, estado e país aproximados, com fonte `netlify_ip` e precisão `approximate`. Não retorna IP bruto, coordenadas ou CEP, não solicita GPS, não chama serviços de terceiros e usa `Cache-Control: private, no-store`. Não garante residência/localização exata.

`app.js` consulta a origem em paralelo, por até três segundos. Indisponibilidade ou lentidão não bloqueiam nem atrasam a inscrição; não há fallback para a cidade da seletiva. Os campos `estimated_city`, `estimated_state`, `estimated_country` e `location_source` acompanham o cadastro quando disponíveis. A mensagem abaixo do formulário informa esse uso. Não são acrescentados como parâmetros do Pixel ou CAPI.

**Para gravar na planilha:** atualizar e publicar Nova versão dos dois Apps Scripts. O código acrescenta as colunas ausentes ao final, preservando as primeiras 14, os registros e eventuais colunas manuais. Até essa atualização, a implantação anterior continua salvando os cadastros e ignorando os novos campos. `doGet` passa a informar `capabilities.estimated_location: true`. A preparação de cabeçalhos pode ser executada por `prepararPlanilha`, sem apagar a planilha.

Eventos antigos AttendanceYes/AttendanceNo são mantidos na lista aceita pelo servidor para compatibilidade com histórico/páginas já abertas, mas não são mais emitidos pelo novo formulário. O funil atual começa em PageView e FormStart.

## Variante curta para comparar conversão

`/simples/` (Piracicaba) e `/jundiai/simples/` (Jundiaí) usam a mesma integração com a planilha de cada cidade, Pixel, CAPI, deduplicação e origem por IP. `reviewBeforeSubmit: false` seleciona envio direto em um único botão. A configuração padrão continua com a confirmação antes de enviar.

A variante tem apenas nome e WhatsApp, sem imagem de fundo, áudio, campo de idade, três passos ou pop-up de confirmação. A idade é enviada vazia para os receptores já atualizados. O botão cabe na primeira tela móvel. A escolha de rastreamento aparece em um bloco após o botão e continua opcional. Sem aceite, os eventos da Meta não são enviados; não comparar custos por PageView como se representassem todas as visitas.

O funil da variante é PageView → FormStart → ConfirmSubmit → Lead; não emite ReviewData porque não há revisão. Lead continua condicionado a CADASTRADO. Erros e duplicidade aparecem no próprio formulário. A coluna Página de entrada distingue variante e original; manter UTMs dos anúncios para comparar cadastros reais, não apenas eventos da Meta. Os URLs originais não foram substituídos. Não há garantia de menor CPL; é uma alternativa para teste com tráfego comparável.

## Desempenho

A otimização da imagem, cache e fonte prioritária e o comparativo controlado estão em `docs/PERFORMANCE.md`. A fonte 700 é pré-carregada para o formulário; o áudio só começa após interação. A imagem atual tem hash no nome e cache longo; HTML, CSS e JavaScript continuam revalidando para receber atualizações.
