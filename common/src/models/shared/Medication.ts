interface Frequency {
    amount: number;
    days: number;
}

export interface MedicationData {
    name: string;
    description: string | null;
    frequency: Frequency;
    count: number;
    destinationCount: number;
    startDate: Date;
    endDate: Date;
}

export interface Medication {
    id: number;
    data: MedicationData;
}

export function calculateEndDate(startDate: Date, destinationCount: number, frequency: Frequency): Date {
  const courseDays = destinationCount / (frequency.amount / frequency.days);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + courseDays);
  return endDate;
}
