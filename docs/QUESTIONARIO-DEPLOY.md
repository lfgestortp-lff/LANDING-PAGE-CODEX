# Novo questionário de Piracicaba

Esta alteração substitui apenas a entrada principal de Piracicaba pelo questionário de quatro telas aprovado. Jundiaí e variantes existentes permanecem disponíveis.

O Pixel é 1801282187897715. Lead é emitido somente após confirmação de cadastro pelo servidor. A nova interface usa os eventos FormStarted, FormStepViewed e FormStepCompleted.

## Dependência antes de publicar

A nova API `/api/inscricao` encaminha para a base de inscrições do Sites, preservando a regra de telefone com DDD. Não usa a planilha antiga na página principal. As variantes antigas e Jundiaí continuam com seus destinos anteriores.

Configurar `SITES_BACKEND_TOKEN` nas variáveis de ambiente de Functions da Netlify com a credencial do backend Sites. Nunca incluir a credencial no repositório, no HTML ou em comentários. Sem a variável, a função retorna 503 e não confirma inscrição.

Não mesclar/publicar a página principal antes de configurar essa variável e verificar o envio. A alteração permanece em uma branch com `[skip netlify]` até essa configuração.

O rastreamento preparado no novo questionário é pelo navegador. A função CAPI antiga continua disponível para as páginas que já a utilizavam; não foi conectada ao novo formulário nesta alteração.

A idade permanece opcional conforme AGENTS.md. O backend do Sites aceita idade vazia como campo vazio e interpreta 52 anos como 52.
