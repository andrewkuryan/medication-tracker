import { Medication, MedicationData } from '@common/models/shared/Medication';
import { User } from '@common/models/shared/User';
import getClient from '@db/client';
import { insertQuery, selectQuery } from '@db/queries';
import { eq } from '@db/where';
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

export async function getAllMedications(user: User): Promise<Medication[]> {
  const dbClient = await getClient();
  const rawMedications = await dbClient.query<DBMedication>(
    selectQuery(medicationSchema, { where: eq('user_id', user.id) }),
  );

  return rawMedications.rows.map(dbMedicationToMedication);
}
