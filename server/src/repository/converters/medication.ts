import { DBMedication, DBMedicationInsert } from '@db/scheme/Medication';
import { Medication, MedicationData } from '@common/models/shared/Medication';
import { User } from '@common/models/shared/User';

export function dbMedicationToMedication(medication: DBMedication): Medication {
  return {
    id: medication.id,
    data: {
      name: medication.name,
      description: medication.description,
      frequency: {
        amount: medication.frequency_amount,
        days: medication.frequency_days,
      },
      count: medication.count,
      destinationCount: medication.destination_count,
      startDate: new Date(medication.start_date),
      endDate: new Date(medication.end_date),
    },
  };
}

export function medicationToDBMedication(
  medicationData: MedicationData,
  user: User,
): DBMedicationInsert {
  return {
    user_id: user.id,
    name: medicationData.name,
    description: medicationData.description,
    frequency_amount: medicationData.frequency.amount,
    frequency_days: medicationData.frequency.days,
    count: medicationData.count,
    destination_count: medicationData.destinationCount,
    start_date: medicationData.startDate.toISOString(),
    end_date: medicationData.endDate.toISOString(),
  };
}

export type MedicationUpdateData = Partial<Omit<MedicationData, 'frequency'> & { frequency?: Partial<MedicationData['frequency']> }>

export function medicationToMedicationUpdate(
  medicationData: MedicationUpdateData,
): Partial<DBMedication> {
  return {
    name: medicationData.name,
    description: medicationData.description,
    frequency_amount: medicationData.frequency?.amount,
    frequency_days: medicationData.frequency?.days,
    count: medicationData.count,
    destination_count: medicationData.destinationCount,
    start_date: medicationData.startDate?.toISOString(),
    end_date: medicationData.endDate?.toISOString(),
  };
}
