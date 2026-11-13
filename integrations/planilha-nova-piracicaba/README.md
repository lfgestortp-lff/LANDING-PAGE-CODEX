# Planilha de inscrições de Piracicaba

Destino: https://docs.google.com/spreadsheets/d/1sycaSUjqtHIbuQFXejQOj_CiSs67GHOH_-AlFC1f-jg/edit
Aba Página1, sheetId 0, oito colunas A:H, fuso America/Sao_Paulo.

## Integração

O Apps Script Code.gs foi implantado pela agência. A saúde confirmou a planilha correta, a aba 0 e ready true. Um POST real confirmou CADASTRADO com ID de inscrição e a linha foi lida na planilha. A publicação da API está em andamento.

SHEETS_RECEIVER_URL em netlify/lib/planilha-piracicaba.mjs seleciona o novo receptor. A planilha torna-se o destino dos novos cadastros e a fonte da verificação de telefone duplicado com DDD. Não há fallback silencioso para outra base em caso de falha. O Lead depende de confirmação CADASTRADO da planilha exata e recebe o ID retornado. Nome, idade, celular, comparecimento, cidade, data e página de origem são gravados. Não são enviados dados pessoais como parâmetros do Pixel.

Dois cadastros anteriores foram transferidos com autorização explícita do usuário e verificados por ID, nome, telefone e comparecimento. Os dados pessoais não estão no repositório. O histórico permanece também na base Sites. Jundiaí e variantes antigas não foram alteradas.

## Manutenção do Apps Script

Alterar o código exige salvar e atualizar a implantação em Implantar > Gerenciar implantações > Editar > Nova versão > Implantar. Executar como a conta proprietária e manter acesso Qualquer pessoa. O ID da planilha é validado também na API da Netlify para evitar gravação no destino errado.

## Testes

node --test tests/planilha-nova-piracicaba.test.cjs

Serviços simulados verificam obrigatoriedade, 52 anos, Sim/Não, telefone normalizado com DDD e +55, nome igual com outro telefone, concorrência, cabeçalhos e destino. A verificação em produção deve criar apenas registros técnicos identificáveis, sem enviar eventos Lead à Meta, e removê-los após conferir os IDs.
