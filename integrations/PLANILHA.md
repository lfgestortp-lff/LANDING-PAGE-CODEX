# Nova planilha com origem da campanha

O endpoint atual continua ativo até a nova implantação ser fornecida e testada. Alterar somente o link de uma planilha não altera o destino do Apps Script existente.

1. Crie a planilha e deixe uma aba vazia para os leads.
2. Abra Extensões → Apps Script e substitua todo o editor pelo conteúdo de `google-apps-script.js`, sem envolver em `myFunction`.
3. Em Configurações do projeto → Propriedades do script, adicione `PLANILHA_ID`, com o ID que aparece entre `/d/` e `/edit` no link da nova planilha. Opcional: `ABA_ID` com o `gid` da aba; sem essa propriedade, usa a primeira aba.
4. Salve e execute `prepararPlanilha`. Autorize o acesso com a conta responsável pela planilha. Se houver erro de estrutura, use uma aba vazia; não apague dados existentes.
5. Implante como Aplicativo da Web, executando como sua conta e com acesso Qualquer pessoa. A planilha pode permanecer privada.
6. Envie a nova URL terminada em `/exec` para atualizar `ENDPOINT` em `app.js` e validar gravação, duplicidade e UTMs. Publicar nova versão exige atualizar a implantação no Apps Script.

Colunas: data, nome, idade, telefone original, chave sem DDD, seis UTMs, página de entrada sem parâmetros adicionais, domínio de referência e ID do evento Lead. Campos de texto são protegidos contra interpretação como fórmulas. Os telefones são comparados sem DDD, inclusive em envios simultâneos.

Exemplo de parâmetros no anúncio:

```text
utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&utm_id={{campaign.id}}
```

Sem parâmetros, as UTMs ficam vazias. O site envia as informações no cadastro; o Apps Script antigo ignora campos adicionais. A gravação das UTMs só estará ativa após implantar o novo script.

## Eventos

O Pixel mantém a preferência de rastreamento. Eventos ocorridos antes da decisão ficam apenas na memória desta página e só são enviados depois de aceitar; ao recusar são descartados. Sem aceite, nenhum desses eventos é enviado à Meta. Agora inclui `AttendanceYes` e `AttendanceNo`, além dos eventos do formulário. Eventos incluem IDs para permitir deduplicação em uma futura API de Conversões; essa API ainda não está instalada. IDs por si só não garantem entrega.

Para eventos pelo servidor, confirmar hospedagem e configurar um serviço com token de acesso da Meta guardado no servidor, nunca no HTML ou JavaScript público. Mesmo com Pixel e API de Conversões, é necessário validar entrega no Gerenciador de Eventos e manter as preferências de uso dos dados. Não existe garantia de 100% de eventos recebidos.
