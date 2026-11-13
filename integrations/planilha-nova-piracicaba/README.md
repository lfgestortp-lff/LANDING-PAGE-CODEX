# Planilha nova de Piracicaba

Destino: https://docs.google.com/spreadsheets/d/1HlyEQP3DLqKy9Jo3Qwz8MlWmRPSS3SAd0dmJSc_YsYI/edit
Aba: Página1, sheetId 0. Cabeçalhos A1:H1 preparados e verificados pela integração do Google Sheets. Fuso: America/Sao_Paulo.

## Ativação

1. Na planilha, abrir Extensões > Apps Script.
2. Substituir o conteúdo padrão pelo arquivo Code.gs desta pasta, inteiro, e salvar.
3. Executar prepararPlanilha e autorizar usando a conta com acesso à planilha.
4. Implantar > Nova implantação > Aplicativo da Web.
5. Executar como a conta proprietária; acesso Qualquer pessoa.
6. Copiar a URL pública terminada em /exec e enviar ao responsável pela integração.

Antes de ativar, verificar doGet: ok e ready true, spreadsheetId igual ao destino e sheetId 0. Preencher SHEETS_RECEIVER_URL em netlify/lib/planilha-piracicaba.mjs somente com a implantação verificada. Publicar apenas com autorização de deploy do usuário e conferir gravação real na planilha.

Enquanto SHEETS_RECEIVER_URL estiver vazia, a API continua usando a base Sites atual. A preparação deste código não conecta automaticamente a planilha. Ao ativar, a planilha passa a ser a fonte dos novos cadastros, com validação e duplicidade pelo telefone completo com DDD. Não há fallback silencioso para outra base quando a gravação na planilha falhar. Lead depende de confirmação CADASTRADO da planilha exata, com ID de inscrição retornado.

Registros anteriores permanecem na base Sites. Para transferir o histórico e preservar a comparação de duplicidade contra esse histórico, fazer uma migração verificada antes da troca. Não copiar dados pessoais para o repositório. Jundiaí e variantes antigas continuam com seus destinos anteriores.

## Verificação

node --test tests/planilha-nova-piracicaba.test.cjs

Testa serviços simulados: gravação das oito colunas, idade natural como 52 anos, disponibilidade Sim/Não, nome igual com telefone diferente, bloqueio de telefone duplicado com e sem formatação e +55, obrigatoriedade, integridade de cabeçalhos, trava concorrente e confirmação do destino pelo servidor.

A planilha nativa foi preparada; Apps Script e gravação real ainda aguardam a implantação da agência. Não afirmar integração ativa antes da confirmação da gravação real e publicação da API.
