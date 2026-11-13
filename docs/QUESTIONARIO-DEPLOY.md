# Novo questionário de Piracicaba

Esta alteração substitui apenas a entrada principal de Piracicaba pelo questionário de quatro telas aprovado. Jundiaí e variantes existentes permanecem disponíveis.

O Pixel é 1801282187897715. Lead é emitido somente após confirmação de cadastro pelo servidor. A nova interface usa os eventos FormStarted, FormStepViewed e FormStepCompleted.

## Configuração de publicação

A nova API `/api/inscricao` encaminha para a base de inscrições do Sites, preservando a regra de telefone com DDD. Não usa a planilha antiga na página principal. As variantes antigas e Jundiaí continuam com seus destinos anteriores.

Configurar `SITES_BACKEND_TOKEN` nas variáveis de ambiente de Functions da Netlify com a credencial do backend Sites. Nunca incluir a credencial no repositório, no HTML ou em comentários. Sem a variável, a função retorna 503 e não confirma inscrição.

A variável foi configurada pela agência e a página principal foi publicada pelo commit 998104a69e3e543b733e82cefa0a541658ee9a84. Em produção, a API retornou a validação esperada (HTTP 400) em uma solicitação deliberadamente inválida, comprovando o acesso ao backend sem inserir cadastro. O teste de navegador em 360 px percorreu as quatro etapas, aceitou 52 anos e verificou erro, nova tentativa e preservação das respostas. Nenhum Lead falso foi emitido. A página de Jundiaí continuou retornando HTTP 200. O teste não criou cadastro real nem verificou uma nova linha gravada.

O rastreamento preparado no novo questionário é pelo navegador. A função CAPI antiga continua disponível para as páginas que já a utilizavam; não foi conectada ao novo formulário nesta alteração.

A idade é obrigatória na página principal de Piracicaba, conforme a nova instrução do usuário. O endpoint da Netlify rejeita idade vazia, mas aceita 52 anos. Jundiaí e variantes não mudam.

## Promoção da versão em tela única

Após aprovação do link de teste e pedido explícito de deploy, a página principal passa a usar o mesmo painel de `/tela-unica/`: sem progresso visual, título ampliado e 45 anos destacado. Mantém pergunta, campo e ações na área visível, idade obrigatória e a API existente. Jundiaí permanece intacta.

## Destino em Google Sheets

Integração preparada para a planilha 1sycaSUjqtHIbuQFXejQOj_CiSs67GHOH_-AlFC1f-jg, aba Página1 (0). O novo receptor foi implantado e verificado. A publicação desta alteração troca o destino dos novos cadastros da base Sites para essa planilha, mantendo idade obrigatória, validação, duplicidade com DDD e Lead somente após confirmação. Ver integrations/planilha-nova-piracicaba/README.md. Histórico de dois cadastros migrado com autorização explícita.
