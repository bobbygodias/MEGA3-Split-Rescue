# MEGA3 Split Rescue

Aplicativo Android livre e sem root para diagnosticar e tentar restaurar a
divisão de tela no **Blackview MEGA 3**, com **Android 15 / DokeOS P 4.2**.

O projeto nasceu para resolver um problema real sem formatar o tablet, sem
desbloquear o bootloader e sem tocar nos arquivos pessoais do aparelho.

## Estado atual

- Versão: **0.3.0**
- Pacote: `com.andrewvox.mega3splitrescue`
- Android mínimo: 8.0 (API 26)
- Android alvo: 15 (API 35)
- Ponte privilegiada: Shizuku 13.1.5
- Root: não
- Telemetria, anúncios e rastreadores: nenhum

A v0.2 corrigiu a integração do APK com o Shizuku, incluindo a permissão de
cliente `API_V23` e o metadado `V3_SUPPORT` necessários para o binder chegar ao
app. O teste físico confirmou essa parte.

A v0.3 corrige o executor remoto: `ShizukuRemoteProcess` possui o método próprio
`waitForTimeout(long, TimeUnit)`. Usar o `Process.waitFor(long, TimeUnit)` padrão
causava `IllegalArgumentException: process hasn't exited` antes que o app pudesse
coletar a saída dos comandos.

## Como usar

1. Instale a v0.3 por cima da versão atual; não é necessário desinstalar.
2. Inicie e pareie o Shizuku pela depuração sem fio.
3. Abra o MEGA3 Split Rescue e toque em **Pedir permissão ao Shizuku**.
4. Execute primeiro **Diagnosticar multi-janela**.
5. Confira a saída real dos comandos.
6. Só então execute **Aplicar reparo seguro** se o diagnóstico indicar que as flags precisam ser restauradas.
7. Volte à tela de apps recentes e teste a divisão de tela.

O Shizuku precisa ser iniciado novamente depois de cada reinicialização do
Android. Isso é uma limitação do funcionamento sem root.

## O que o reparo faz

O botão principal executa apenas estes comandos fixos:

```text
settings put global force_resizable_activities 1
settings put global enable_non_resizable_multi_window 1
wm set-multi-window-config --supportsNonResizable 1 --respectsActivityMinWidthHeight -1
```

Há também um fallback separado para `enable_freeform_support`. Não existe campo
para inserir comandos arbitrários.

## Privacidade e segurança

- Não solicita acesso à internet, armazenamento, fotos, microfone ou câmera.
- Não lê arquivos, diário, senhas ou conteúdo de outros aplicativos.
- O serviço de acessibilidade declara zero tipos de evento e não recupera o
  conteúdo das janelas; ele só solicita a ação global de alternar divisão.
- Os comandos são executados localmente pela ponte do Shizuku.
- O código completo está neste repositório para auditoria.

## Compilar

Requisitos: JDK 17, Android SDK 35 e Gradle 8.9 ou compatível.

```bash
gradle --no-daemon :app:assembleDebug
```

Saída:

```text
app/build/outputs/apk/debug/app-debug.apk
```

O workflow em `.github/workflows/android.yml` também compila e verifica a
assinatura do APK em cada alteração enviada à branch `main`.

## Limite honesto

O aplicativo restaura flags e configurações do framework Android acessíveis ao
usuário `shell`. Se a firmware do DokeOS tiver removido ou bloqueado a própria
implementação de tela dividida no SystemUI/Launcher, o diagnóstico mostrará o
bloqueio, mas um aplicativo comum não pode reescrever a partição do sistema.

## Licença

Este projeto é dedicado ao domínio público pela **CC0 1.0 Universal**. Use, estude,
modifique, compartilhe e reaproveite sem pedir permissão.
