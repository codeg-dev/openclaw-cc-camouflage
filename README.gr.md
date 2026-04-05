<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <strong>Ελληνικά</strong> |
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

Ένα συνοδευτικό πρόσθετο συντήρησης για το OpenClaw που βοηθά στην επαλήθευση της κατάστασης του not-claude-code-emulator. Αυτό το πακέτο δεν είναι fork upstream έργων. Παρέχει ρητά εργαλεία χωρίς αυτόματα hooks.

## Τι είναι αυτό

Το `openclaw-cc-camouflage` είναι ένα πρόσθετο συντήρησης που:

- Επαληθεύει την παρουσία και την υγεία του εξομοιωτή πριν από οποιεσδήποτε λειτουργίες
- Αναφέρει την κατάσταση και παρέχει διαγνωστική καθοδήγηση
- Παρέχει υλοποιήσεις stub για μελλοντικές λειτουργίες patch

Δεν εφαρμόζει αυτόματα patches κατά την εγκατάσταση. Όλες οι μεταλλάξεις απαιτούν ρητή κλήση εργαλείου.

## Προϋποθέσεις και σειρά εγκατάστασης

Η σειρά εγκατάστασης έχει σημασία. Πρέπει να έχετε τα ακόλουθα στη θέση τους πριν αυτό το πρόσθετο μπορέσει να λειτουργήσει:

1. **`not-claude-code-emulator`** (commit `5541e5c`)
   - Το runtime μηνυμάτων που παρέχει συμβατές με Anthropic διεπαφές
   - Εγκατάσταση μέσω npm: `npm install -g not-claude-code-emulator`
   - Ή κλωνοποίηση στο `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (αυτό το πακέτο)
   - Εγκατάσταση τελευταίο, αφού ο εξομοιωτής είναι παρών

Ρυθμίστε τη μεταβλητή περιβάλλοντος:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Ή χρησιμοποιήστε εφεδρικές διαδρομές:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## Διαθέσιμα εργαλεία

Αυτό το πρόσθετο εκθέτει τέσσερα ρητά εργαλεία. Δεν είναι αυτόματα hooks.

### `status`

Αναφέρει την τρέχουσα κατάσταση της εγκατάστασης του εξομοιωτή.

```bash
bun run status
```

Η μορφή εξόδου είναι αναγνώσιμη από μηχανή:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

Ο κωδικός εξόδου 0 σημαίνει υγιής. Ο κωδικός εξόδου 1 σημαίνει ότι κάτι χρειάζεται προσοχή.

### `doctor`

Παρέχει διαγνωστική καθοδήγηση με βάση την τρέχουσα κατάσταση.

```bash
bun run doctor
```

Αυτό επιθεωρεί αρχεία και αναφέρει ενέργειες επόμενα βήματα. Δεν εγκαθιστά, patch ή τροποποιεί τίποτα. Διαβάζει και αναφέρει μόνο.

### `patch_apply`

Εφαρμόζει patches στον στόχο (προς το παρόν ένα stub για μελλοντική επέκταση).

```bash
bun run patch:apply
```

Στην τρέχουσα έκδοση, αυτό επαληθεύει το περιβάλλον αλλά δεν τροποποιεί καμία κατάσταση peer. Μελλοντικές εκδόσεις μπορεί να υλοποιήσουν πραγματικό patching με rollback markers.

### `patch_revert`

Αναιρεί προηγουμένως εφαρμοσμένα patches (προς το παρόν ένα stub για μελλοντική επέκταση).

```bash
bun run patch:revert
```

Στην τρέχουσα έκδοση, αυτό επαληθεύει το περιβάλλον αλλά δεν τροποποιεί καμία κατάσταση peer. Μελλοντικές εκδόσεις μπορεί να υλοποιήσουν πραγματική αναιρεση χρησιμοποιώντας rollback markers.

## Γιατί τα αυτόματα hooks είναι μόνο επαλήθευση

Τα αυτόματα hooks σε αυτό το πρόσθετο είναι περιορισμένα σε επαλήθευση και μεταδεδομένα μόνο. Δεν εφαρμόζουν αυτόματα patches γιατί:

1. Η μετάλλαξη ενός peer χωρίς ρητή πρόθεση χρήστη παραβιάζει την αρχή της ελάχιστης έκπληξης
2. Οι αποτυχίες patching χρειάζονται ανθρώπινη ανασκόπηση, όχι σιωπηλές επαναλήψεις
3. Η αναιρεση απαιτεί ρητή συγκατάθεση για επαναφορά κατάστασης

Τα hooks προειδοποιούν όταν ανιχνεύεται απόκλιση. Εσείς αποφασίζετε αν θα εφαρμόσετε, αναιρέσετε ή αφήσετε το περιβάλλον αμετάβλητο.

## Υποστήριξη πλατφόρμας

| Πλατφόρμα | Κατάσταση | Σημειώσεις |
|----------|--------|-------|
| macOS    | Υποστηρίζεται | Κύριο περιβάλλον επιφάνειας εργασίας |
| Linux    | Υποστηρίζεται | Ίδια pinned upstream fixtures |
| Windows  | Υποστηρίζεται | Υποστηρίζει ανακάλυψη plugin βάσει γράμματος μονάδας δίσκου και ανάστροφης καθέτου |

## Καναρίνι συμβατότητας

Για να ελέγξετε την απόκλιση upstream έναντι pinned στόχων:

```bash
bun run compat:canary
```

Αυτός είναι ένας έλεγχος μόνο για ανάγνωση που επαληθεύει την ακεραιότητα των fixtures και τις upstream αναφορές χωρίς να τροποποιεί τίποτα. Βγαίνει με 0 σε pinned υποστηριζόμενους στόχους.

## Τεκμηρίωση

- `docs/install.md` - Προϋποθέσεις και βήματα εγκατάστασης
- `docs/compatibility.md` - Όρια συμβατότητας
- `docs/support-matrix.md` - Κλειδωμένες εκδόσεις fixtures
- `docs/non-goals.md` - Ρητά στοιχεία εκτός εμβέλειας

## Ανάπτυξη

```bash
# Εγκατάσταση εξαρτήσεων
bun install

# Έλεγχος τύπου
bun run typecheck

# Εκτέλεση δοκιμών
bun run test:unit
bun run test:integration

# Επαλήθευση patches έναντι fixtures
bun run verify:patches

# Έλεγχος ασφάλειας δημοσίευσης
bun run check:publish-safety
```

## Άδεια

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->