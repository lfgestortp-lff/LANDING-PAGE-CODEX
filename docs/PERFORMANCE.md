# Otimização de carregamento

Teste local controlado no Chromium, tela 390×844, cache novo, 1,6 Mbit/s de download, latência de 150 ms e CPU 4× mais lenta. Integrações externas simuladas para não enviar eventos ou cadastros reais. Uma medição por versão/página; tempos variam. Não é medição de usuários reais nem previsão de custo de anúncio.

| Página | Transferência antes | Depois | Load antes | Depois | LCP antes | Depois |
|---|---:|---:|---:|---:|---:|---:|
| / | 1,521,508 bytes | 98,233 bytes | 8361 ms | 1094 ms | 824 ms | 788 ms |
| /jundiai/ | 1,524,644 bytes | 101,381 bytes | 8325 ms | 1150 ms | 764 ms | 848 ms |

O ganho demonstrado é no peso e no carregamento completo; o LCP de texto já era baixo e variou pouco nas duas medições. A imagem de fundo foi recodificada de PNG (1.445.284 bytes) para WebP (22.764 bytes), preservando dimensão/composição. A imagem original foi mantida para recuperação, mas não é usada pelas páginas atuais. A nova imagem tem nome com hash de conteúdo e cache imutável; fontes têm cache de uma semana e a fonte principal do formulário é priorizada com preload.

A consulta de capacidades ao Google em cada visita foi removida depois de confirmar que ambos os receptores de produção aceitam idade opcional. A idade é opcional diretamente no HTML. A origem aproximada continua sendo consultada de forma assíncrona. O áudio mantém preload=none e seu comportamento de interação. Consentimento, validação, UTMs, IDs de deduplicação e momento de Lead não foram alterados nesta otimização.

Menor peso pode ajudar a reduzir abandonos durante o carregamento. Não garante menor CPC ou CPL. O PageView da Meta continua condicionado ao aceite e não deve ser tratado como contagem completa de todos os acessos. Conferir a versão publicada e o cabeçalho de cache antes de afirmar ativação em produção.
