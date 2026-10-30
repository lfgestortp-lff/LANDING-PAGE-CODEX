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
- Eventos personalizados: `FormStart`, `ReviewData`, `ConfirmSubmit`.
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

Público, gratuidade da inscrição e Piracicaba são informados logo na primeira tela. A página explica a confirmação e o contato posterior pelo WhatsApp informado e inclui o Instagram oficial. A agência confirmou aceitação de mulheres sem experiência e contato posterior pelo WhatsApp. Não são prometidos outros serviços gratuitos. Fotos reais de trabalhos/modelos podem substituir as ilustrações quando fornecidas com autorização; não há depoimentos ou resultados inventados.
