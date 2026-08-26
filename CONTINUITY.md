# Continuidade — MEGA3 Split Rescue

- Estado: v0.3 enviada ao repositório; workflow de compilação acionado.
- Teste físico da v0.2 confirmou que o binder do Shizuku chega ao app e a permissão é concedida.
- Nos cinco testes de diagnóstico/reparo, todos os comandos retornaram `IllegalArgumentException: process hasn't exited`.
- Causa encontrada: o executor chamava `Process.waitFor(long, TimeUnit)` sobre `ShizukuRemoteProcess`. Essa classe não sobrescreve o timeout padrão de `Process`; o caminho correto no Shizuku é `waitForTimeout(long, TimeUnit)`.
- Correção v0.3: o executor agora chama `waitForTimeout` do processo remoto e só então lê stdout/stderr e `exitValue()`.
- A tentativa anterior de reparo não deve ser tratada como teste válido, porque o processo era destruído logo após a exceção e os comandos podem não ter terminado.
- Pacote: `com.andrewvox.mega3splitrescue`.
- Android alvo: 15 / API 35; mínimo API 26.
- Ponte privilegiada: Shizuku API 13.1.5, iniciada por depuração sem fio.
- Dados salvos: nenhum.
- Rede própria: nenhuma; o botão de instalação abre a página oficial do Shizuku em navegador externo somente se ele não estiver instalado.
- Acessibilidade: sem leitura de conteúdo; somente `GLOBAL_ACTION_TOGGLE_SPLIT_SCREEN`.
- Próximo teste: instalar v0.3 sobre a versão atual, confirmar Shizuku em execução/permissão concedida, executar primeiro **Diagnosticar multi-janela** e enviar o resultado antes de aplicar qualquer outro fallback.
