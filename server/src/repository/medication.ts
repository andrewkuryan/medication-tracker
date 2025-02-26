import { Medication } from '@common/models/shared/Medication';
import { User } from '@common/models/shared/User';
import getClient from '@db/client';
import {
  deleteQuery, insertQuery, selectQuery, updateQuery,
} from '@db/queries';
import { eq } from '@db/where';
import { desc } from '@db/order';
import { DBMedication, medicationSchema } from '@db/scheme/Medication';
import {
  dbMedicationToMedication,
  medicationToDBMedication,
  medicationToMedicationUpdate,
  MedicationCreateData,
  MedicationUpdateData,
} from '@repository/converters/medication';

export async function createMedication(
  user: User,
  data: MedicationCreateData,
): Promise<Medication> {
  const dbClient = await getClient();
  const medicationResult = await dbClient.query<DBMedication>(
    insertQuery(medicationSchema, medicationToDBMedication(data, user)),
  );

  return dbMedicationToMedication(medicationResult.rows[0]);
}

export async function updateMedication(
  medicationId: number,
  newData: MedicationUpdateData,
): Promise<Medication> {
  const dbClient = await getClient();
  const medicationResult = await dbClient.query<DBMedication>(
    updateQuery(medicationSchema, medicationToMedicationUpdate(newData), {
      where: eq('id', medicationId),
    }),
  );

  return dbMedicationToMedication(medicationResult.rows[0]);
}

export async function getAllMedications(user: User): Promise<Medication[]> {
  const dbClient = await getClient();
  const rawMedications = await dbClient.query<DBMedication>(
    selectQuery(medicationSchema, {
      where: eq('user_id', user.id),
      orderBy: desc(['created_at']),
    }),
  );

  return rawMedications.rows.map(dbMedicationToMedication);
}

export async function deleteMedication(medicationId: number): Promise<Medication> {
  const dbClient = await getClient();
  const medicationResult = await dbClient.query<DBMedication>(
    deleteQuery(medicationSchema, eq('id', medicationId)),
  );

  return dbMedicationToMedication(medicationResult.rows[0]);
}
