<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.bn.md">বাংলা</a> |
  <strong>Português (Brasil)</strong> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a>
</p>

# openclaw-cc-camouflage

Um plugin complementar de manutenção para o OpenClaw que ajuda a verificar o status do not-claude-code-emulator. Este pacote não é um fork de projetos upstream. Ele fornece ferramentas explícitas sem hooks automáticos.

## O que é isto

O `openclaw-cc-camouflage` é um plugin de manutenção que:

- Verifica a presença e a saúde do emulador antes de quaisquer operações
- Reporta o status e fornece orientação de diagnóstico
- Fornece implementações de stub para operações de patch futuras

Ele não aplica patches automaticamente durante a instalação. Todas as mutações requerem invocação explícita de ferramenta.

## Pré-requisitos e ordem de instalação

A ordem de instalação importa. Você deve ter o seguinte em vigor antes que este plugin possa funcionar:

1. **`not-claude-code-emulator`** (commit `5541e5c`)
   - O runtime de mensagens que fornece interfaces compatíveis com Anthropic
   - Instale via npm: `npm install -g not-claude-code-emulator`
   - Ou clone em `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (este pacote)
   - Instale por último, depois que o emulador estiver presente

Configure a variável de ambiente:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Ou use caminhos de fallback:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## Ferramentas disponíveis

Este plugin expõe quatro ferramentas explícitas. Elas não são hooks automáticos.

### `status`

Reporta o estado atual da instalação do emulador.

```bash
bun run status
```

O formato de saída é legível por máquina:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

O código de saída 0 significa saudável. O código de saída 1 significa que algo precisa de atenção.

### `doctor`

Fornece orientação de diagnóstico com base no estado atual.

```bash
bun run doctor
```

Isso inspeciona arquivos e reporta passos acionáveis. Não instala, aplica patch ou modifica nada. Apenas lê e reporta.

### `patch_apply`

Aplica patches ao alvo (atualmente um stub para extensão futura).

```bash
bun run patch:apply
```

Na versão atual, isso valida o ambiente mas não modifica nenhum estado de peer. Versões futuras podem implementar patching real com marcadores de rollback.

### `patch_revert`

Reverte patches aplicados anteriormente (atualmente um stub para extensão futura).

```bash
bun run patch:revert
```

Na versão atual, isso valida o ambiente mas não modifica nenhum estado de peer. Versões futuras podem implementar reversão real usando marcadores de rollback.

## Por que hooks automáticos são apenas de verificação

Os hooks automáticos neste plugin são limitados a verificação e metadados apenas. Eles não aplicam patches automaticamente porque:

1. Mutar um peer sem intenção explícita do usuário viola o princípio da menor surpresa
2. Falhas de patching precisam de revisão humana, não de tentativas silenciosas
3. O rollback requer consentimento explícito para restaurar o estado

Os hooks avisam quando drift é detectado. Você decide se aplica, reverte ou deixa o ambiente inalterado.

## Suporte de plataforma

| Plataforma | Status | Notas |
|----------|--------|-------|
| macOS    | Suportado | Ambiente de desktop principal |
| Linux    | Suportado | Mesmos fixtures upstream fixados |
| Windows  | Suportado | Suporta descoberta de plugin baseada em letra de unidade e barra invertida |

## Canário de compatibilidade

Para verificar o drift upstream em relação a alvos fixados:

```bash
bun run compat:canary
```

Esta é uma verificação somente leitura que valida a integridade de fixtures e referências upstream sem modificar nada. Sai com 0 em alvos fixados suportados.

## Documentação

- `docs/install.md` - Pré-requisitos e passos de instalação
- `docs/compatibility.md` - Limites de compatibilidade
- `docs/support-matrix.md` - Versões de fixtures bloqueadas
- `docs/non-goals.md` - Itens explícitos fora do escopo

## Desenvolvimento

```bash
# Instalar dependências
bun install

# Verificação de tipos
bun run typecheck

# Executar testes
bun run test:unit
bun run test:integration

# Verificar patches contra fixtures
bun run verify:patches

# Verificar segurança de publicação
bun run check:publish-safety
```

## Licença

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->