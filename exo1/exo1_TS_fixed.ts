class PackageFixed {
  constructor(public weight: number, public distance: number) {
    if (weight < 0) throw new Error("Invalid weight!");
  }
}

interface DiscountStrategy {
  apply(price: number): number;
}

class VIPDiscount implements DiscountStrategy {
  apply(price: number): number {
    return price * 0.8;
  }
}

class BusinessDiscount implements DiscountStrategy {
  apply(price: number): number {
    return price * 0.9;
  }
}

class NoDiscount implements DiscountStrategy {
  apply(price: number): number {
    return price;
  }
}

class PricingService {
  private discountStrategy: DiscountStrategy;

  constructor(customerType: string) {
    switch (customerType) {
      case "VIP":
        this.discountStrategy = new VIPDiscount();
        break;
      case "Business":
        this.discountStrategy = new BusinessDiscount();
        break;
      default:
        this.discountStrategy = new NoDiscount();
    }
  }

  calculateBasePrice(pkg: Package, urgent: boolean): number {
    let base = pkg.distance * 0.1;
    base += pkg.weight > 10 ? 5 : pkg.weight > 5 ? 3 : 0;
    if (urgent) base *= 1.5;
    return base;
  }

  calculateTotalPrice(packages: Package[], urgent: boolean): number {
    let total = packages.reduce(
      (sum, pkg) => sum + this.calculateBasePrice(pkg, urgent),
      0
    );
    if (packages.length > 3) total *= 0.95;
    return this.discountStrategy.apply(total);
  }
}

class InvoicePrinter {
  printInvoice(totalPrice: number): void {
    console.log(`Total: ${totalPrice.toFixed(2)}€`);
  }
}
