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

O pop-up inicial exige uma escolha. Sim libera o formulário; Não substitui a inscrição por um aviso e um link para https://instagram.com/produtoraangels. A aba permanece aberta para exibir a mensagem. O bloqueio é de interface; o endpoint público do Apps Script mantém suas validações independentes.

## Fundo ilustrativo

`assets/mulheres-45plus-fundo.png` é uma composição gerada por IA com três mulheres fictícias, desfocada e mesclada em degradê. Não representa modelos reais da agência. O fundo é decorativo, usa camadas de contraste no CSS e enquadramento específico para celular.

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
