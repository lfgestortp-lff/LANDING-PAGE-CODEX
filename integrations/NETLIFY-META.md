# Ativar os eventos pelo servidor no Netlify

## Publicação

Um upload estático pelo Netlify Drop não publica a função de servidor. No projeto existente `produtoraangels`, conecte o repositório `lfgestortp-lff/LANDING-PAGE-CODEX` à implantação contínua pelo GitHub, usando a branch `main`. Preserve o projeto e endereço atuais. Sem comando de build; diretório publicado `.`; funções `netlify/functions`, definidos em `netlify.toml`.

## Variáveis seguras no Netlify

No próprio Netlify, abra a configuração do projeto e adicione variáveis com escopo de Functions:

| Nome | Valor |
| --- | --- |
| `META_CAPI_ACCESS_TOKEN` | Token gerado na Meta para a API de Conversões do Pixel; inserir diretamente no Netlify, nunca no chat, GitHub ou JavaScript público. |
| `META_PIXEL_ID` | `1801282187897715` |
| `META_TEST_EVENT_CODE` | Opcional e temporário: código da aba Testar eventos, na Meta. Remover após a validação e implantar novamente para produção. |

Faça nova implantação depois de configurar as variáveis. O Netlify fornece `URL` com a origem principal do projeto; a função exige essa origem tanto no cabeçalho Origin quanto na página de origem do evento. Se mudar o domínio principal, confirme essa configuração e implante novamente.

## Comportamento e verificação

- A visitante precisa permitir o rastreamento. Recusa não envia esses eventos à Meta.
- Pixel e função usam o mesmo nome e ID para que a Meta possa deduplicar os eventos. Não some os dois canais como duas inscrições.
- PageView, AttendanceYes/No, FormStart, ReviewData, ConfirmSubmit e Lead passam pelos dois canais. Lead só é emitido pelo fluxo da página após retorno CADASTRADO do Apps Script; o endpoint de eventos não é uma prova independente de gravação. É um endpoint público, com validação de origem e campos, e pode precisar de proteção contra abuso para campanhas maiores.
- São usados IP da conexão e agente do navegador no servidor; `_fbp` e `_fbc`, quando disponíveis, são enviados somente após permitir o rastreamento. Nenhum nome, idade ou telefone é encaminhado à Meta por esta implementação. A qualidade de correspondência depende dos sinais disponíveis; não há garantia de 100% de entrega.
- A página faz no máximo uma nova tentativa após falha temporária, usando o mesmo ID. Não há fila persistente. Recusa interrompe novas tentativas, mas não desfaz pedidos já enviados.
- Sem função implantada ou sem token, o Pixel continua funcionando conforme a permissão da visitante. Um cadastro salvo não deve ser tratado como falha só por indisponibilidade do rastreamento.
- Use Testar eventos na Meta para conferir recebimento por Navegador e Servidor e a deduplicação. Testes locais simulados não confirmam recebimento real pela Meta.
- `node --test tests/*.test.*` executa verificações locais sem enviar eventos reais.

## Nova planilha

A nova URL fornecida é `https://script.google.com/macros/s/AKfycbwJ_n0Wy2uNNWFA7-Mfc4WkkExxpBipMEgBuMGji1PTW10UT3_HiHz8B0tpRAYbksve/exec`. O acesso público foi corrigido. O teste vazio retornou DADOS_INVALIDOS. Uma linha “Teste Integração UTMs” foi enviada com as seis UTMs e retornou CADASTRADO com o mesmo ID de evento. As tentativas com o mesmo telefone sem DDD e com outro DDD retornaram DUPLICADO. `ENDPOINT` em `app.js` já aponta para essa implantação. Conferir visualmente a linha e as UTMs na nova planilha e apagar somente o cadastro de teste. O envio real da página publicada depende de atualizar a implantação do Netlify.
