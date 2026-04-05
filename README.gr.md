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

Ένα συνοδευτικό πρόσθετο συντήρησης για το OpenClaw που επαληθεύει ότι το `not-claude-code-emulator` είναι παρόν και υγιές.

*Επειδή η καλύτερη λειτουργία ξεκινάει με την επιβεβαίωση ότι το κάλυμμά σας είναι στη θέση του.*

## Τι κάνει αυτό

Το `not-claude-code-emulator` είναι το runtime που μεταφράζει τις κλήσεις API του OpenClaw σε κάτι που η υποδομή της Anthropic αναγνωρίζει ως προερχόμενο από μια συνεδρία Claude Code CLI — του είδους που πάντα καλυπτόταν από μια τυπική συνδρομή Pro ή Max, χωρίς απαιτούμενες επιπλέον χρεώσεις χρήσης. Το `openclaw-cc-camouflage` είναι ο προενημερωτικός έλεγχος που επιβεβαιώνει ότι ο μεταφραστής είναι παρών και λειτουργικός πριν τον χρειαστείτε.

Το όνομα δεν είναι σύμπτωση. Η κίνησή σας μπαίνει δείχνοντας ένα πράγμα, φτάνει δείχνοντας ένα άλλο. Αυτό το πρόσθετο επαληθεύει ότι η "ντουλάπα" είναι έτοιμη.

Συγκεκριμένα:

- **Ανιχνεύει** το `not-claude-code-emulator` μέσω τριών διαδρομών ανακάλυψης (μεταβλητή περιβάλλοντος → npm global → διαδρομές εφεδρείας)
- **Αναφέρει** κατάσταση αναγνώσιμη από μηχανή: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Διαγιγνώσκει** προβλήματα με εφικτά επόμενα βήματα όταν κάτι πάει στραβά
- **Δεσμεύει** το `patch_apply` / `patch_revert` ως ρητά stubs για μελλοντικές λειτουργίες

Τίποτα δεν μεταλλάσσεται αυτόματα. Τα hooks είναι μόνο για επαλήθευση. Εκτελείτε το `status`, λαμβάνετε την αναφορά και αποφασίζετε τι θα κάνετε στη συνέχεια.

## Εγκατάσταση

Εγκαταστήστε με τη σειρά. Κάθε βήμα εξαρτάται από το προηγούμενο.

### Βήμα 1: Εγκαταστήστε το OpenClaw

Αν δεν είναι ήδη εγκατεστημένο:

```bash
npm install -g openclaw
```

### Βήμα 2: Εγκαταστήστε το `not-claude-code-emulator`

Αυτό είναι το στοιχείο που κάνει την κίνηση του OpenClaw να μιλάει άπταιστα τη γλώσσα Claude Code CLI. Χωρίς αυτό, δεν υπάρχει τίποτα που να μπορεί να επαληθεύσει αυτό το πρόσθετο — και τίποτα μεταξύ των κλήσεων API σας και μιας γραμμής επιπλέον χρήσης.

```bash
# Επιλογή Α: npm global (συνιστάται)
npm install -g not-claude-code-emulator

# Επιλογή Β: καρφιτσώστε στην ακριβή υποστηριζόμενη commit (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Βήμα 3: Εγκαταστήστε το `openclaw-cc-camouflage`

```bash
# Επιλογή Α: npm global (δημοσιευμένο πακέτο)
npm install -g openclaw-cc-camouflage

# Επιλογή Β: από πηγή
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Βήμα 4: Διαμορφώστε τη διαδρομή του εξομοιωτή

Πείτε στο πρόσθετο πού να βρει το `not-claude-code-emulator`:

```bash
# Αν χρησιμοποιήσατε εγκατάσταση npm global:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Αν κάνατε clone χειροκίνητα:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Προσθέστε στο προφίλ του shell σας για μονιμότητα:

```bash
# ~/.zshrc ή ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Προαιρετικά — διαμορφώστε επιπλέον διαδρομές αναζήτησης εφεδρείας (διαχωρισμένες με άνω-κάτω τελεία σε macOS/Linux, ερωτηματικό σε Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Βήμα 5: Καταχωρήστε το πρόσθετο στο OpenClaw

Προσθέστε στο `openclaw.json` ή `openclaw.jsonc` σας:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Αν εγκαταστήσατε από πηγή, χρησιμοποιήστε τοπική διαδρομή:

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

### Βήμα 6: Επαληθεύστε την εγκατάσταση

```bash
bun run status
```

Μια υγιής εγκατάσταση αναφέρει:

```
emulator=present
patch=none
support=supported
```

Κωδικός εξόδου 0 σημαίνει ότι όλα είναι σε τάξη. Κωδικός εξόδου 1 σημαίνει ότι κάτι χρειάζεται προσοχή.

Για μια πιο λεπτομερή εικόνα:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# Η κατάσταση συντήρησης είναι υγιής.
# next: Η προϋπόθεση του εξομοιωτή είναι αναγνώσιμη και η τρέχουσα πλατφόρμα υποστηρίζεται.
# next: Όλα τα εργαλεία είναι διαθέσιμα.
```

Αν δείτε `emulator=missing`, επαληθεύστε ότι το `OC_CAMOUFLAGE_EMULATOR_ROOT` δείχνει σε έναν κατάλογο που περιέχει το `package.json` του `not-claude-code-emulator`.

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
patch=none
support=supported
```

Κωδικός εξόδου 0 σημαίνει υγιής. Κωδικός εξόδου 1 σημαίνει ότι κάτι χρειάζεται προσοχή.

### `doctor`

Παρέχει διαγνωστική καθοδήγηση με βάση την τρέχουσα κατάσταση.

```bash
bun run doctor
```

Επιθεωρεί αρχεία και αναφέρει εφικτά επόμενα βήματα. Δεν εγκαθιστά, δεν κάνει patch, δεν τροποποιεί τίποτα. Μόνο διαβάζει και αναφέρει.

### `patch_apply`

Εφαρμόζει patches στον στόχο (προς το παρόν ένα stub για μελλοντική επέκταση).

```bash
bun run patch:apply
```

Στην τρέχουσα έκδοση, αυτό επαληθεύει το περιβάλλον αλλά δεν τροποποιεί καμία κατάσταση peer. Μελλοντικές εκδόσεις μπορεί να υλοποιήσουν πραγματικό patching με δείκτες rollback.

### `patch_revert`

Αναιρεί προηγουμένως εφαρμοσμένα patches (προς το παρόν ένα stub για μελλοντική επέκταση).

```bash
bun run patch:revert
```

Στην τρέχουσα έκδοση, αυτό επαληθεύει το περιβάλλον αλλά δεν τροποποιεί καμία κατάσταση peer.

## Γιατί τα αυτόματα hooks είναι μόνο για επαλήθευση

Τα αυτόματα hooks σε αυτό το πρόσθετο είναι περιορισμένα μόνο στην επαλήθευση και τα μεταδεδομένα. Δεν εφαρμόζουν patches αυτόματα επειδή:

1. Η μετάλλαξη ενός peer χωρίς ρητή πρόθεση χρήστη παραβιάζει την αρχή του ελάχιστου surprise
2. Οι αποτυχίες patching χρειάζονται ανθρώπινη ανασκόπηση, όχι σιωπηλές επαναλήψεις
3. Το rollback απαιτεί ρητή συγκατάθεση για επαναφορά της κατάστασης

Τα hooks προειδοποιούν όταν ανιχνεύεται απόκλιση. Εσείς αποφασίζετε αν θα εφαρμόσετε, αναιρέσετε ή αφήσετε το περιβάλλον αναλλοίωτο.

Το πρόσθετο επαληθεύει την ετοιμότητα. Τι κάνετε με μια σωστά συντηρημένη ρύθμιση είναι μεταξύ εσάς και του προγράμματος συνδρομής σας.

## Υποστήριξη πλατφόρμας

| Πλατφόρμα | Κατάσταση | Σημειώσεις |
|-----------|-----------|------------|
| macOS | Υποστηρίζεται | Κύριο περιβάλλον επιφάνειας εργασίας |
| Linux | Υποστηρίζεται | Ίδια καρφιτσωμένα upstream fixtures |
| Windows | Υποστηρίζεται | Υποστηρίζει ανακάλυψη προσθέτων βάσει γράμματος μονάδας δίσκου και ανάστροφης κάθετης γραμμής |

## Κανάρι της συμβατότητας

Για να ελέγξετε για απόκλιση upstream έναντι καρφιτσωμένων στόχων:

```bash
bun run compat:canary
```

Έλεγχος μόνο για ανάγνωση. Επαληθεύει την ακεραιότητα των fixtures και τις upstream αναφορές χωρίς να τροποποιεί τίποτα. Βγαίνει με 0 σε καρφιτσωμένους υποστηριζόμενους στόχους.

## Τεκμηρίωση

- `docs/install.md` - Προαπαιτούμενα και βήματα εγκατάστασης
- `docs/compatibility.md` - Όρια συμβατότητας
- `docs/support-matrix.md` - Κλειδωμένες εκδόσεις fixtures
- `docs/non-goals.md` - Ρητά στοιχεία εκτός εύρους
- `docs/rollback.md` - Διαδικασίες ανάκτησης εξομοιωτή

## Ανάπτυξη

```bash
# Εγκατάσταση εξαρτήσεων
bun install

# Έλεγχος τύπων
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

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
