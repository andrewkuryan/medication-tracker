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
  for (let i = 0; i < migrations.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await migrations[i]();
  }
}

async function migrateUndo() {
  for (let i = 0; i < rollbacks.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await rollbacks[i]();
  }
}

(async () => {
  switch (process.argv[2]) {
    case 'migrate':
      await migrate();
      // eslint-disable-next-line no-console
      console.log('Executed successfully: migrate');
      break;
    case 'migrate:undo':
      await migrateUndo();
      // eslint-disable-next-line no-console
      console.log('Executed successfully: migrate:undo');
      break;
    default:
      // eslint-disable-next-line no-console
      console.log(HELP_MESSAGE);
  }
  process.exit(0);
})();
