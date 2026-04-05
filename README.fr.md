<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <strong>Français</strong> |
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

Un plugin compagnon de maintenance pour OpenClaw qui aide à vérifier le statut du not-claude-code-emulator. Ce package n'est pas un fork de projets upstream. Il fournit des outils explicites sans hooks automatiques.

## Qu'est-ce que c'est

`openclaw-cc-camouflage` est un plugin de maintenance qui:

- Vérifie la présence et la santé de l'émulateur avant toute opération
- Rapporte le statut et fournit des conseils de diagnostic
- Fournit des implémentations stub pour les opérations de patch futures

Il n'applique pas automatiquement les patches lors de l'installation. Toute mutation nécessite un appel explicite à l'outil.

## Prérequis et ordre d'installation

L'ordre d'installation est important. Vous devez avoir ce qui suit en place avant que ce plugin puisse fonctionner:

1. **`not-claude-code-emulator`** (commit `5541e5c`)
   - Le runtime de messages qui fournit des interfaces compatibles Anthropic
   - Installer via npm: `npm install -g not-claude-code-emulator`
   - Ou cloner dans `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (ce package)
   - Installer en dernier, après que l'émulateur soit présent

Configurez la variable d'environnement:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Ou utilisez les chemins de secours:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## Outils disponibles

Ce plugin expose quatre outils explicites. Ce ne sont pas des hooks automatiques.

### `status`

Rapporte l'état actuel de l'installation de l'émulateur.

```bash
bun run status
```

Le format de sortie est lisible par machine:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

Le code de sortie 0 signifie sain. Le code de sortie 1 signifie que quelque chose nécessite de l'attention.

### `doctor`

Fournit des conseils de diagnostic basés sur l'état actuel.

```bash
bun run doctor
```

Cela inspecte les fichiers et rapporte les prochaines étapes actionnables. Il n'installe, ne patche ni ne modifie rien. Il lit et rapporte uniquement.

### `patch_apply`

Applique des patches à la cible (actuellement un stub pour extension future).

```bash
bun run patch:apply
```

Dans la version actuelle, cela valide l'environnement mais ne modifie aucun état de peer. Les versions futures peuvent implémenter un patching réel avec des marqueurs de rollback.

### `patch_revert`

Révoque les patches précédemment appliqués (actuellement un stub pour extension future).

```bash
bun run patch:revert
```

Dans la version actuelle, cela valide l'environnement mais ne modifie aucun état de peer. Les versions futures peuvent implémenter une révocation réelle en utilisant des marqueurs de rollback.

## Pourquoi les hooks automatiques sont uniquement de vérification

Les hooks automatiques dans ce plugin sont limités à la vérification et aux métadonnées uniquement. Ils n'appliquent pas automatiquement les patches car:

1. Muter un peer sans intention explicite de l'utilisateur viole le principe de la moindre surprise
2. Les échecs de patching nécessitent une révision humaine, pas de tentatives silencieuses
3. Le rollback nécessite un consentement explicite pour restaurer l'état

Les hooks avertissent lorsqu'une dérive est détectée. Vous décidez d'appliquer, de révoquer ou de laisser l'environnement inchangé.

## Support de plateforme

| Plateforme | Statut | Notes |
|----------|--------|-------|
| macOS    | Supporté | Environnement de bureau principal |
| Linux    | Supporté | Mêmes fixtures upstream épinglés |
| Windows  | Supporté | Prend en charge la découverte de plugin basée sur la lettre de lecteur et l'antislash |

## Canari de compatibilité

Pour vérifier la dérive upstream par rapport aux cibles épinglées:

```bash
bun run compat:canary
```

C'est une vérification en lecture seule qui valide l'intégrité des fixtures et les références upstream sans modifier quoi que ce soit. Elle sort avec 0 sur les cibles épinglées supportées.

## Documentation

- `docs/install.md` - Prérequis et étapes d'installation
- `docs/compatibility.md` - Limites de compatibilité
- `docs/support-matrix.md` - Versions de fixtures verrouillées
- `docs/non-goals.md` - Éléments explicitement hors de portée

## Développement

```bash
# Installer les dépendances
bun install

# Vérification de type
bun run typecheck

# Exécuter les tests
bun run test:unit
bun run test:integration

# Vérifier les patches contre les fixtures
bun run verify:patches

# Vérifier la sécurité de publication
bun run check:publish-safety
```

## Licence

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->