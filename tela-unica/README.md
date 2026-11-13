# Alternativa em tela única

Versão experimental para `/tela-unica/`, sem alterar a página principal. Ainda não publicada.

O formulário usa um painel da altura da área visível, com topo compacto e ação no rodapé do painel. Uma pergunta por vez; idade obrigatória; aceita 52 anos; telefone com DDD; Sim ou Não conclui o envio. A cidade permanece na última pergunta. Usa a mesma API `/api/inscricao` e o mesmo Pixel da página principal.

O teclado é tratado pelo Visual Viewport quando disponível. Com a área reduzida, o topo e textos auxiliares dão espaço à pergunta, campo e ações. Não há imagens, fontes externas ou novas dependências.

Validação: navegador em 320×480, 320×568, 360×640 e 390×844, verificando posição da pergunta, campo e botões dentro da tela, erros de obrigatoriedade e navegação. Área visível de 300 px simulou o teclado; ainda requer teste com teclado real em Android/iOS. Envio e eventos de sucesso foram simulados, sem gravar cadastros nem enviar Leads à Meta.

Só fazer deploy após pedido explícito do usuário. Manter [skip netlify] nos commits enquanto isso.
