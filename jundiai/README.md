# Seletiva de Jundiaí

Página independente em `/jundiai/`, com a Paleta A (marfim, carvão e vinho). Usa o mesmo `app.js` da página principal: Pixel `1801282187897715`, API de Conversões, IDs compartilhados para deduplicação, seis UTMs, confirmação, requisitos dos campos e pergunta de presença na cidade.

## Planilha conectada

1. Planilha recebida: `1i-bQQo3lU5CAbpS3iSvRcCNISxsfwYE4qzLrzkSsjnk`, aba `gid=0`; deixá-la vazia para preparar os cabeçalhos.
2. Criar um Apps Script próprio para ela com `google-apps-script.js` desta pasta. O ID da planilha e a aba 0 já estão preenchidos; não é necessário cadastrar propriedades do script. Não alterar o ID no projeto de Apps Script de Piracicaba.
3. Executar `prepararPlanilha`, publicar para executar como a conta responsável e permitir acesso a Qualquer pessoa.
4. A nova implantação `/exec` foi fornecida e está em `config.js`. O teste retornou CADASTRADO com o mesmo ID de evento e bloqueou repetições sem DDD e com outro DDD. Se o endpoint voltar a ser `null`, inscrições e rastreamento desta página ficam desativados; nunca caem na planilha de Piracicaba.
5. Conferir visualmente na planilha a linha “Teste Integração Jundiaí”, telefone `11900000001`, e as seis UTMs enviadas no teste; depois apagar somente essa linha. O `noindex` de rascunho foi removido. Validar o recebimento e a deduplicação de Lead no Gerenciador de Eventos antes de iniciar os anúncios.

Os tokens da Meta permanecem nas Netlify Functions existentes. Os eventos identificam a página de Jundiaí pelo caminho em `event_source_url` e as campanhas pelas UTMs, sem duplicar a infraestrutura. A comparação de telefones acontece na planilha configurada para esta cidade.
