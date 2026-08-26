# Continuidade — MEGA3 Split Rescue

- Estado: v0.2 compilada; aguarda teste físico no Blackview MEGA 3.
- Motivo da v0.2: o APK manual v0.1 não incorporou a permissão e o metadado do
  manifesto do Shizuku Provider AAR. O app abria, mas nunca recebia o binder.
- Correção: `moe.shizuku.manager.permission.API_V23` e
  `moe.shizuku.client.V3_SUPPORT=true` agora estão no manifesto principal.
- Pacote: `com.andrewvox.mega3splitrescue`.
- Android alvo: 15 / API 35; mínimo API 26.
- Ponte privilegiada: Shizuku API 13.1.5, iniciada por depuração sem fio.
- Dados salvos: nenhum.
- Rede própria: nenhuma; o botão de instalação abre a página oficial do Shizuku
  em navegador externo somente se ele não estiver instalado.
- Acessibilidade: sem leitura de conteúdo; somente
  `GLOBAL_ACTION_TOGGLE_SPLIT_SCREEN`.
- Próximo teste: instalar v0.2 sobre v0.1, confirmar “Shizuku: em execução”,
  conceder permissão, executar Diagnóstico e depois Reparar.
