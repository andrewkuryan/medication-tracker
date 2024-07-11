import * as process from 'node:process';

import * as createTables from './create-tables';

const HELP_MESSAGE = `Usage: npm run db -- [command]
where command: 
    migrate - create tables in the database
    migrate:undo - drop tables in the database`;

const migrations = [
  createTables.migrate,
];

const rollbacks = [
  createTables.rollback,
];

async function migrate() {
  for (const migrate of migrations) {
    await migrate();
  }
}

async function migrateUndo() {
  for (const rollback of rollbacks) {
    await rollback();
  }
}

(async () => {
  switch (process.argv[2]) {
    case 'migrate':
      await migrate();
      console.log('Executed successfully: migrate');
      break;
    case 'migrate:undo':
      await migrateUndo();
      console.log('Executed successfully: migrate:undo');
      break;
    default:
      console.log(HELP_MESSAGE);
  }
  process.exit(0);
})();
