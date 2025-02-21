import PrescriptionValidator from "../PrescriptionValidator";
import { Medication, Patient, Prescription, Stock } from "../types";

describe("Validation des prescriptions", () => {
  let validator: PrescriptionValidator;
  let stock: Stock;

  beforeEach(() => {
    stock = { W: 5 };
    validator = new PrescriptionValidator(stock);
  });

  // Règle 801 : Vérification du taux de globules blancs
  describe("Règle 801 - Taux de globules blancs", () => {
    test("Un patient avec un taux de globules blancs < 2000 ne peut pas recevoir X (hors protocole Gamma)", () => {
      const patient: Patient = {
        whiteBloodCellCount: 1900,
        protocol: "",
        relapseAfter2019: false,
        geneticMarkers: [],
      };
      const prescription: Prescription = { medications: [Medication.X] };

      const result = validator.validate(prescription, patient, new Date());

      expect(result).toContain(
        "Règle 801: Taux de globules blancs insuffisant (1900/mm3) pour prescrire X."
      );
    });

    test("Un patient sous protocole Gamma peut recevoir X avec un taux de 1500+", () => {
      const patient: Patient = {
        whiteBloodCellCount: 1600,
        protocol: "Gamma",
        relapseAfter2019: false,
        geneticMarkers: [],
      };
      const prescription: Prescription = { medications: [Medication.X] };

      const result = validator.validate(prescription, patient, new Date());

      expect(result).toEqual([]); // Aucune erreur attendue
    });

    test("Un patient en rechute après 2019 sous protocole Gamma doit avoir 2000+ globules blancs", () => {
      const patient: Patient = {
        whiteBloodCellCount: 1700,
        protocol: "Gamma",
        relapseAfter2019: true,
        geneticMarkers: [],
      };
      const prescription: Prescription = { medications: [Medication.X] };

      const result = validator.validate(prescription, patient, new Date());

      expect(result).toContain(
        "Règle 801: Taux de globules blancs insuffisant (1700/mm3) pour prescrire X."
      );
    });
  });

  // Règle 327 : Interactions médicamenteuses
  describe("Règle 327 - Interactions médicamenteuses & BRCA1", () => {
    test("Un patient sans BRCA1 ne peut pas recevoir Y + Z sauf un mercredi", () => {
      const patient: Patient = {
        geneticMarkers: [],
        whiteBloodCellCount: 5000,
      };
      const prescription: Prescription = {
        medications: [Medication.Y, Medication.Z],
      };
      const date = new Date("2025-02-20"); // Jeudi

      const result = validator.validate(prescription, patient, date);

      expect(result).toContain(
        "Règle 327: Y + Z nécessite BRCA1 sauf sous IRM un mercredi."
      );
    });

    test("Un patient avec BRCA1 peut recevoir Y + Z n'importe quel jour", () => {
      const patient: Patient = {
        geneticMarkers: ["BRCA1"],
        whiteBloodCellCount: 5000,
      };
      const prescription: Prescription = {
        medications: [Medication.Y, Medication.Z],
      };
      const date = new Date("2025-02-20"); // Jeudi

      const result = validator.validate(prescription, patient, date);

      expect(result).toEqual([]); // Aucune erreur attendue
    });

    test("Un patient sans BRCA1 peut recevoir Y + Z un mercredi", () => {
      const patient: Patient = {
        geneticMarkers: [],
        whiteBloodCellCount: 5000,
      };
      const prescription: Prescription = {
        medications: [Medication.Y, Medication.Z],
      };
      const date = new Date("2025-02-19"); // Mercredi

      const result = validator.validate(prescription, patient, date);

      expect(result).toEqual([]); // Aucune erreur attendue
    });

    test("Un patient sans BRCA1 recevant uniquement Y ou Z ne déclenche pas la règle", () => {
      const patient: Patient = {
        geneticMarkers: [],
        whiteBloodCellCount: 5000,
      };
      const prescription1: Prescription = { medications: [Medication.Y] };
      const prescription2: Prescription = { medications: [Medication.Z] };
      const date = new Date("2025-02-20"); // Jeudi

      expect(validator.validate(prescription1, patient, date)).toEqual([]); // Pas d'erreur pour Y seul
      expect(validator.validate(prescription2, patient, date)).toEqual([]); // Pas d'erreur pour Z seul
    });
  });

  // Règle 666 : Vérification du stock
  describe("Règle 666 - Vérification du stock", () => {
    test("Stock insuffisant pour prescrire W si moins de 3 doses disponibles", () => {
      stock["W"] = 2; // Stock insuffisant
      validator = new PrescriptionValidator(stock);
      const prescription: Prescription = { medications: [Medication.W] };

      const result = validator.validate(
        prescription,
        {} as Patient,
        new Date()
      );

      expect(result).toContain(
        "Règle 666: Stock insuffisant pour prescrire W."
      );
    });

    test("Le week-end nécessite une marge de 20% sur W", () => {
      stock["W"] = 3; // Stock exact mais insuffisant le week-end
      validator = new PrescriptionValidator(stock);
      const prescription: Prescription = { medications: [Medication.W] };
      const date = new Date("2025-02-22"); // Samedi

      const result = validator.validate(prescription, {} as Patient, date);

      expect(result).toContain(
        "Règle 666: Stock insuffisant pour prescrire W."
      );
    });

    test("Stock suffisant permet la prescription en semaine", () => {
      stock["W"] = 3; // Stock suffisant
      validator = new PrescriptionValidator(stock);
      const prescription: Prescription = { medications: [Medication.W] };
      const date = new Date("2025-02-21"); // Vendredi

      const result = validator.validate(prescription, {} as Patient, date);

      expect(result).toEqual([]); // Aucune erreur attendue
    });

    test("Stock suffisant pour le week-end", () => {
      stock["W"] = 4; // Stock exact pour le week-end
      validator = new PrescriptionValidator(stock);
      const prescription: Prescription = { medications: [Medication.W] };
      const date = new Date("2025-02-23"); // Dimanche

      const result = validator.validate(prescription, {} as Patient, date);

      expect(result).toEqual([]); // Aucune erreur attendue
    });
  });
});
