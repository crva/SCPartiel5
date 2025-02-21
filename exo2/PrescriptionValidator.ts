import { Medication, Patient, Prescription, Stock } from "./types";

class PrescriptionValidator {
  private readonly stock: Stock;

  constructor(stock: Stock) {
    this.stock = stock;
  }

  validate(prescription: Prescription, patient: Patient, date: Date): string[] {
    return [
      this.checkRule801(prescription, patient),
      this.checkRule327(prescription, patient, date),
      this.checkRule666(prescription, date),
    ].filter((result) => result !== true) as string[]; // Filtrer les erreurs et forcer le type string[]
  }

  // Règle 801: Validation du taux de globules blancs
  private checkRule801(
    prescription: Prescription,
    patient: Patient
  ): true | string {
    if (prescription.medications.includes(Medication.X)) {
      const minWBC =
        patient.protocol === "Gamma"
          ? patient.relapseAfter2019
            ? 2000
            : 1500
          : 2000;

      if (patient.whiteBloodCellCount < minWBC) {
        return `Règle 801: Taux de globules blancs insuffisant (${patient.whiteBloodCellCount}/mm3) pour prescrire ${Medication.X}.`;
      }
    }
    return true;
  }

  // Règle 327: Vérification des interactions médicamenteuses et BRCA1
  private checkRule327(
    prescription: Prescription,
    patient: Patient,
    date: Date
  ): true | string {
    const medications = prescription.medications;

    if (
      medications.includes(Medication.Y) &&
      medications.includes(Medication.Z)
    ) {
      const isWednesday = date.getDay() === 3; // Mercredi
      if (!patient.geneticMarkers.includes("BRCA1") && !isWednesday) {
        return `Règle 327: ${Medication.Y} + ${Medication.Z} nécessite BRCA1 sauf sous IRM un mercredi.`;
      }
    }

    return true;
  }

  // Règle 666: Vérification du stock
  private checkRule666(prescription: Prescription, date: Date): true | string {
    if (prescription.medications.includes(Medication.W)) {
      const requiredStock =
        date.getDay() === 6 || date.getDay() === 0 // Samedi ou dimanche
          ? 3 + Math.ceil(3 * 0.2) // Marge de sécurité de 20%
          : 3;

      if (this.stock[Medication.W] < requiredStock) {
        return `Règle 666: Stock insuffisant pour prescrire ${Medication.W}.`;
      }
    }
    return true;
  }
}

export default PrescriptionValidator;
