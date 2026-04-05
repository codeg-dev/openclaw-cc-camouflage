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

Um plugin de manutenção companheiro para o OpenClaw que verifica se o `not-claude-code-emulator` está presente e saudável.

*Porque a melhor operação começa confirmando que sua cobertura está no lugar.*

## O que isto faz

O `not-claude-code-emulator` é o runtime que traduz as chamadas de API do OpenClaw em algo que a infraestrutura da Anthropic reconhece como vindo de uma sessão do Claude Code CLI — o tipo que sempre foi coberto por uma assinatura padrão Pro ou Max, sem cobranças extras de uso necessárias. O `openclaw-cc-camouflage` é a verificação pré-voo que confirma que o tradutor está presente e operacional antes que você precise dele.

O nome não é uma coincidência. Seu tráfego entra parecendo uma coisa, chega parecendo outra. Este plugin verifica se o "guarda-roupa" está pronto.

Concretamente:

- **Detecta** o `not-claude-code-emulator` via três caminhos de descoberta (variável de ambiente → npm global → caminhos de fallback)
- **Relata** status legível por máquina: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Diagnostica** problemas com próximos passos acionáveis quando algo está errado
- **Reserva** `patch_apply` / `patch_revert` como stubs explícitos para operações futuras

Nada muta automaticamente. Os hooks são apenas para verificação. Você executa `status`, recebe o relatório e decide o que fazer a seguir.

## Instalação

Instale em ordem. Cada passo depende do anterior.

### Passo 1: Instalar o OpenClaw

Se ainda não estiver instalado:

```bash
npm install -g openclaw
```

### Passo 2: Instalar o `not-claude-code-emulator`

Este é o componente que faz seu tráfego do OpenClaw falar fluentemente a CLI do Claude Code. Sem ele, não há nada para este plugin verificar — e nada entre suas chamadas de API e um item de linha de uso extra.

```bash
# Opção A: npm global (recomendado)
npm install -g not-claude-code-emulator

# Opção B: fixar no commit suportado exato (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Passo 3: Instalar o `openclaw-cc-camouflage`

```bash
# Opção A: npm global (pacote publicado)
npm install -g openclaw-cc-camouflage

# Opção B: a partir do código-fonte
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Passo 4: Configurar o caminho do emulador

Diga ao plugin onde encontrar o `not-claude-code-emulator`:

```bash
# Se você usou a instalação global do npm:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Se você clonou manualmente:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Adicione ao seu perfil do shell para persistência:

```bash
# ~/.zshrc ou ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Opcional — configure caminhos de busca de fallback adicionais (separados por dois-pontos no macOS/Linux, ponto-e-vírgula no Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Passo 5: Registrar o plugin no OpenClaw

Adicione ao seu `openclaw.json` ou `openclaw.jsonc`:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Se você instalou a partir do código-fonte, use o caminho local:

```json
{
  "plugins": [
    {
      "name": "openclaw-cc-camouflage",
      "path": "~/github/openclaw-cc-camouflage"
    }
  ]
}
```

### Passo 6: Verificar a instalação

```bash
bun run status
```

Uma instalação saudável relata:

```
emulator=present
patch=none
support=supported
```

Código de saída 0 significa que tudo está em ordem. Código de saída 1 significa que algo precisa de atenção.

Para uma imagem mais detalhada:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# O status de manutenção está saudável.
# next: O pré-requisito do emulador está legível e a plataforma atual é suportada.
# next: Todas as ferramentas estão disponíveis.
```

Se você vir `emulator=missing`, verifique se `OC_CAMOUFLAGE_EMULATOR_ROOT` aponta para um diretório contendo o `package.json` do `not-claude-code-emulator`.

## Ferramentas disponíveis

Este plugin expõe quatro ferramentas explícitas. Elas não são hooks automáticos.

### `status`

Relata o estado atual da instalação do emulador.

```bash
bun run status
```

O formato de saída é legível por máquina:

```
emulator=present
patch=none
support=supported
```

Código de saída 0 significa saudável. Código de saída 1 significa que algo precisa de atenção.

### `doctor`

Fornece orientação diagnóstica baseada no estado atual.

```bash
bun run doctor
```

Inspeciona arquivos e relata próximos passos acionáveis. Não instala, aplica patches ou modifica nada. Lê e relata apenas.

### `patch_apply`

Aplica patches ao alvo (atualmente um stub para extensão futura).

```bash
bun run patch:apply
```

Na versão atual, isso valida o ambiente mas não modifica nenhum estado do par. Versões futuras podem implementar patching real com marcadores de rollback.

### `patch_revert`

Reverte patches previamente aplicados (atualmente um stub para extensão futura).

```bash
bun run patch:revert
```

Na versão atual, isso valida o ambiente mas não modifica nenhum estado do par.

## Por que os hooks automáticos são apenas para verificação

Os hooks automáticos neste plugin são limitados a verificação e metadados apenas. Eles não aplicam patches automaticamente porque:

1. Mutar um par sem intenção explícita do usuário viola o princípio da menor surpresa
2. Falhas de patching precisam de revisão humana, não de retentativas silenciosas
3. Rollback requer consentimento explícito para restaurar o estado

Os hooks avisam quando drift é detectado. Você decide se aplica, reverte ou deixa o ambiente inalterado.

O plugin verifica a prontidão. O que você faz com uma configuração devidamente mantida é entre você e seu plano de assinatura.

## Suporte de plataforma

| Plataforma | Status | Notas |
|------------|--------|-------|
| macOS | Suportado | Ambiente desktop principal |
| Linux | Suportado | Mesmos fixtures upstream fixados |
| Windows | Suportado | Suporta descoberta de plugins baseada em letra de unidade e barra invertida |

## Canário de compatibilidade

Para verificar drift upstream contra alvos fixados:

```bash
bun run compat:canary
```

Verificação somente leitura. Valida integridade de fixtures e referências upstream sem modificar nada. Sai com 0 em alvos suportados fixados.

## Documentação

- `docs/install.md` - Pré-requisitos e passos de instalação
- `docs/compatibility.md` - Limites de compatibilidade
- `docs/support-matrix.md` - Versões de fixtures bloqueadas
- `docs/non-goals.md` - Itens explicitamente fora de escopo
- `docs/rollback.md` - Procedimentos de recuperação do emulador

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

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
