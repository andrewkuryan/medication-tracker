import { Medication, MedicationData } from '@common/models/shared/Medication';
import { User } from '@common/models/shared/User';
import getClient from '@db/client';
import { insertQuery } from '@db/queries';
import { DBMedication, medicationSchema } from '@db/scheme/Medication';
import { dbMedicationToMedication, medicationToDBMedication } from '@repository/converters/medication';

export async function createMedication(user: User, data: MedicationData): Promise<Medication> {
  const dbClient = await getClient();
  const medicationResult = await dbClient.query<DBMedication>(
    insertQuery(medicationSchema, medicationToDBMedication(data, user)),
  );
  const rawMedication = medicationResult.rows[0];

  return dbMedicationToMedication(rawMedication);
}
