# Landing page da seletiva

Página estática em HTML, CSS e JavaScript, sem dependências de produção ou build.

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
- Cronômetro individual de 10h43min54s na primeira visita, com prazo persistido no navegador; não reinicia ao recarregar e para em zero. Não representa um prazo global da campanha e não bloqueia o envio após expirar.

## Antes de publicar a campanha

Definir responsável pelo tratamento, política de privacidade, finalidade, retenção e tratamento de inscrições de menores. Adicionar proteção contra abuso no serviço de envio. Validar em navegador o envio pela origem de produção e os eventos no Gerenciador de Eventos da Meta. Os testes HTTP da API não comprovam CORS nem recebimento dos eventos pela Meta. Prazo global da campanha e identidade visual ainda estão pendentes.
