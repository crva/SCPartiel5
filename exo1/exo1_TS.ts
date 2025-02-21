// Violations du Principe de Responsabilité Unique (SRP - SOLID)
// Cette classe représente un colis, mais elle ne devrait pas stocker la logique métier
class Package {
  weight: number;
  distance: number;

  constructor(weight: number, distance: number) {
    this.weight = weight;
    this.distance = distance;
  }
}

// Violations de plusieurs principes SOLID & DRY (classe trop chargée)
class DeliveryService {
  calculateDeliveryPrice(
    packages: Package[],
    customerType: string,
    urgent: boolean
  ): number {
    let total = 0;

    for (const pkg of packages) {
      // Mauvaise gestion des erreurs - devrait lever une exception plutôt qu'afficher un message (SRP)
      if (pkg.weight < 0) {
        console.log("Invalid weight!");
        return -1; // Mauvaise pratique : le code retour -1 est arbitraire
      }

      // Logique complexe et difficile à comprendre (KISS)
      let base = pkg.distance * 0.1;
      if (pkg.weight > 10) {
        base += 5;
      } else if (pkg.weight > 5) {
        base += 3;
      }

      // Le code métier est fortement couplé aux conditions spécifiques (SRP, Open/Closed)
      if (urgent) {
        base *= 1.5;
      }

      // Le traitement des remises selon le type de client devrait être externalisé (OCP - SOLID)
      if (customerType === "VIP") {
        base *= 0.8;
      } else if (customerType === "Business") {
        base *= 0.9;
      }

      total += base;
    }

    // La réduction pour plusieurs colis ne devrait pas être ici (SRP - SOLID)
    if (packages.length > 3) {
      total *= 0.95;
    }

    return total;
  }

  // Cette méthode viole le SRP : elle gère l'affichage et la logique métier en même temps
  printInvoice(packages: Package[], customerType: string): void {
    const price = this.calculateDeliveryPrice(packages, customerType, false);

    // La classe ne devrait pas gérer directement l'affichage (SRP - Séparer la logique d'affichage)
    console.log(`Total: ${price}`);

    // Ce message ne respecte pas YAGNI : il ajoute une règle métier implicite
    if (price > 100) {
      console.log("Apply special discount next time!");
    }
  }
}
