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

Un plugin de maintenance compagnon pour OpenClaw qui vérifie que `not-claude-code-emulator` est présent et en bonne santé.

*Parce que la meilleure opération commence par confirmer que votre couverture est en place.*

## Ce que cela fait

`not-claude-code-emulator` est le runtime qui traduit les appels API d'OpenClaw en quelque chose que l'infrastructure d'Anthropic reconnaît comme venant d'une session Claude Code CLI — le genre qui a toujours été couvert par un abonnement standard Pro ou Max, sans frais d'utilisation supplémentaires requis. `openclaw-cc-camouflage` est la vérification pré-vol qui confirme que le traducteur est présent et opérationnel avant que vous en ayez besoin.

Le nom n'est pas une coïncidence. Votre trafic entre en ayant l'air d'une chose, arrive en ayant l'air d'une autre. Ce plugin vérifie que la "garde-robe" est prête.

Concrètement:

- **Détecte** `not-claude-code-emulator` via trois chemins de découverte (variable d'environnement → npm global → chemins de secours)
- **Rapporte** un statut lisible par machine: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Diagnostique** les problèmes avec des prochaines étapes actionnables quand quelque chose ne va pas
- **Réserve** `patch_apply` / `patch_revert` comme stubs explicites pour les opérations futures

Rien ne mute automatiquement. Les hooks sont uniquement pour vérification. Vous exécutez `status`, obtenez le rapport et décidez quoi faire ensuite.

## Installation

Installez dans l'ordre. Chaque étape dépend de la précédente.

### Étape 1: Installer OpenClaw

Si ce n'est pas déjà installé:

```bash
npm install -g openclaw
```

### Étape 2: Installer `not-claude-code-emulator`

C'est le composant qui fait parler votre trafic OpenClaw couramment le CLI de Claude Code. Sans lui, il n'y a rien que ce plugin puisse vérifier — et rien entre vos appels API et une ligne d'utilisation supplémentaire.

```bash
# Option A: npm global (recommandé)
npm install -g not-claude-code-emulator

# Option B: épingler au commit supporté exact (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Étape 3: Installer `openclaw-cc-camouflage`

```bash
# Option A: npm global (paquet publié)
npm install -g openclaw-cc-camouflage

# Option B: depuis la source
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Étape 4: Configurer le chemin de l'émulateur

Dites au plugin où trouver `not-claude-code-emulator`:

```bash
# Si vous avez utilisé l'installation npm global:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Si vous avez cloné manuellement:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Ajoutez à votre profil shell pour la persistance:

```bash
# ~/.zshrc ou ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Optionnel — configurez des chemins de recherche de secours supplémentaires (séparés par des deux-points sur macOS/Linux, point-virgule sur Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Étape 5: Enregistrer le plugin dans OpenClaw

Ajoutez à votre `openclaw.json` ou `openclaw.jsonc`:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Si vous avez installé depuis la source, utilisez le chemin local:

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

### Étape 6: Vérifier l'installation

```bash
bun run status
```

Une installation saine rapporte:

```
emulator=present
patch=none
support=supported
```

Le code de sortie 0 signifie que tout est en ordre. Le code de sortie 1 signifie que quelque chose nécessite attention.

Pour une image plus détaillée:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# Le statut de maintenance est sain.
# next: Le prérequis de l'émulateur est lisible et la plateforme actuelle est supportée.
# next: Tous les outils sont disponibles.
```

Si vous voyez `emulator=missing`, vérifiez que `OC_CAMOUFLAGE_EMULATOR_ROOT` pointe vers un répertoire contenant le `package.json` de `not-claude-code-emulator`.

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
patch=none
support=supported
```

Le code de sortie 0 signifie sain. Le code de sortie 1 signifie que quelque chose nécessite attention.

### `doctor`

Fournit des conseils diagnostiques basés sur l'état actuel.

```bash
bun run doctor
```

Inspecte les fichiers et rapporte les prochaines étapes actionnables. N'installe pas, ne patche pas, ne modifie rien. Lit et rapporte seulement.

### `patch_apply`

Applique des patches à la cible (actuellement un stub pour extension future).

```bash
bun run patch:apply
```

Dans la version actuelle, cela valide l'environnement mais ne modifie aucun état du pair. Les versions futures peuvent implémenter un patchage réel avec des marqueurs de rollback.

### `patch_revert`

Révoque les patches précédemment appliqués (actuellement un stub pour extension future).

```bash
bun run patch:revert
```

Dans la version actuelle, cela valide l'environnement mais ne modifie aucun état du pair.

## Pourquoi les hooks automatiques sont uniquement pour vérification

Les hooks automatiques dans ce plugin sont limités à la vérification et aux métadonnées uniquement. Ils n'appliquent pas de patches automatiquement parce que:

1. Muter un pair sans intention explicite de l'utilisateur viole le principe de moindre surprise
2. Les échecs de patchage nécessitent un examen humain, pas des réessais silencieux
3. Le rollback nécessite un consentement explicite pour restaurer l'état

Les hooks avertissent quand une dérive est détectée. Vous décidez d'appliquer, révoquer ou laisser l'environnement inchangé.

Le plugin vérifie la préparation. Ce que vous faites avec une configuration correctement entretenue est entre vous et votre plan d'abonnement.

## Support de plateforme

| Plateforme | Statut | Notes |
|------------|--------|-------|
| macOS | Supporté | Environnement de bureau principal |
| Linux | Supporté | Mêmes fixtures upstream épinglées |
| Windows | Supporté | Supporte la découverte de plugins basée sur la lettre de lecteur et l'antislash |

## Canari de compatibilité

Pour vérifier la dérive upstream contre les cibles épinglées:

```bash
bun run compat:canary
```

Vérification en lecture seule. Valide l'intégrité des fixtures et les références upstream sans modifier quoi que ce soit. Sort avec 0 sur les cibles supportées épinglées.

## Documentation

- `docs/install.md` - Prérequis et étapes d'installation
- `docs/compatibility.md` - Limites de compatibilité
- `docs/support-matrix.md` - Versions de fixtures verrouillées
- `docs/non-goals.md` - Éléments explicitement hors scope
- `docs/rollback.md` - Procédures de récupération de l'émulateur

## Développement

```bash
# Installer les dépendances
bun install

# Vérification des types
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

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
