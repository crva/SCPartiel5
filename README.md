# Exercice 1 - Refactoring du Service de Livraison

### **Problèmes identifiés**

- Les problèmes sont indiqués avec des commentaires dans le fichier `/exo1/exo1_TS.ts`
- Les corrections aux problèmes sont dans le fichier `/exo1/exo1_TS_fixed.ts`

### **Solution et Refactoring**

Division du code en plusieurs classes pour respecter **SOLID** et améliorer la maintenabilité.

### **Structure améliorée**

- **`Package`** → Représente un colis avec son poids et sa distance.
- **`DiscountStrategy`** → Interface permettant d'ajouter facilement de nouvelles stratégies de remise.
- **`PricingService`** → Gère le calcul du prix en fonction des colis et des remises.
- **`InvoicePrinter`** → Responsable de l'affichage de la facture (séparé de la logique métier).

---

# Exercice 2 - Prescription Validator

**Prescription Validator** est un module permettant de vérifier la validité d’une prescription médicale en fonction des critères suivants :

- **Règle 801** : Vérification du taux de globules blancs avant prescription.
- **Règle 327** : Vérification des interactions médicamenteuses et du marqueur génétique **BRCA1**.
- **Règle 666** : Vérification du stock avant prescription.

### Installation

1. npm install

### Exécution des tests

1. npm test
