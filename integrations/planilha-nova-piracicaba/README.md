# Planilha de cadastro de Piracicaba — status

Destino: https://docs.google.com/spreadsheets/d/1sycaSUjqtHIbuQFXejQOj_CiSs67GHOH_-AlFC1f-jg/edit
Aba Página1, sheetId 0. Oito colunas A:H, fuso America/Sao_Paulo.

## Privacidade do comparecimento

A coluna E é Status do cadastro, sempre Recebido para inscrições confirmadas. Não revela disponibilidade. A resposta Sim/Não fica exclusivamente na base privada Sites. O cliente terá acesso à planilha somente como leitor, conforme escolha explícita do usuário; não alterar permissões sem instrução e destinatário.

O arquivo Code.gs desta pasta é a versão `piracicaba-status-v2`. O receptor recebe nome, idade, celular com DDD, ID e página de origem. A API não envia attendance ao Google. Data, cidade e status são preenchidos pelo receptor. O ID da inscrição mantém a mesma linha em novas tentativas.

Os dois cadastros históricos foram transferidos com autorização explícita e verificados na planilha. A exportação atual contém apenas Status do cadastro = Recebido. As respostas originais permanecem na base privada. Nenhum dado pessoal está no repositório. O registro técnico de teste foi removido.

## Estado e próxima etapa

A planilha já tem os novos cabeçalhos e valores. A ativação automática está pendente: atualizar o Apps Script com Code.gs inteiro, salvar e usar Implantar > Gerenciar implantações > Editar > Nova versão > Implantar. Executar como a conta proprietária, acesso Qualquer pessoa. Pode manter a mesma URL /exec.

Antes de publicar a API da Netlify, verificar doGet com ready true, o ID desta planilha, sheetId 0, version piracicaba-status-v2 e receives_attendance false. Publicar também o backend privado com suporte a registrationId e repetição idempotente (preparado no checkout Sites). Não publicar o novo cliente/API com o backend privado antigo, que ainda gera um ID diferente em cada tentativa.

## Fluxo

1. O navegador gera um registrationId por preenchimento e mantém o mesmo ID nas tentativas dessa página, sem guardar campos pessoais no armazenamento local.
2. A API confirma o registro na base privada, incluindo comparecimento.
3. A API encaminha apenas os dados permitidos ao receptor da planilha, usando o mesmo ID. Não há attendance no payload do Google.
4. A API só confirma a inscrição e permite Lead após CADASTRADO na planilha correta, na versão status-v2, com status Recebido. Falhas não geram Lead; nova tentativa reutiliza o ID e não duplica a inscrição.

Uma tentativa interrompida após gravação privada e antes da confirmação na planilha pode permanecer apenas na base privada; não deve ser tratada como inscrição confirmada ao visitante. Os testes cobrem a recuperação na mesma página. Jundiaí e variantes antigas mantêm suas integrações.

## Testes

node --test tests/planilha-nova-piracicaba.test.cjs

Sete testes cobrem status sem disponibilidade, obrigatoriedade, DDD, duplicidade, cabeçalhos, trava, destino e falha/recuperação entre as duas bases. O backend privado tem teste de repetição do ID no checkout Sites. Testes de navegador nas duas variantes confirmaram visual inalterado, estabilidade do ID após erro e apenas um Lead após sucesso simulado. Não foram enviados Leads de teste à Meta.
