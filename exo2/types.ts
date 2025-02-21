export enum Medication {
  X = "X",
  Y = "Y",
  Z = "Z",
  W = "W",
}

export interface Prescription {
  medications: Medication[];
}

export interface Patient {
  whiteBloodCellCount: number;
  protocol?: string;
  relapseAfter2019?: boolean;
  geneticMarkers: string[];
}

export interface Stock {
  [medication: string]: number;
}
