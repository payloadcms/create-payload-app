#!/usr/bin/env node

import { getArgs } from '../src/utils/getArgs';
import { getTemplate } from '../src/utils/getTemplate';
import { getProjectName } from '../src/utils/getProjectName';
import { createProject } from '../src/lib/createProject';
import { welcomeMessage, helpMessage, successMessage } from '../src/utils/messages';
import { success } from '../src/utils/log';
import { getDatabaseConnection } from '../src/utils/getDatabaseConnection';
import { getPayloadSecret } from '../src/utils/getPayloadSecret';
import { writeEnvFile } from '../src/utils/writeEnvFile';
import { getLanguage } from '../src/utils/getLanguage';
import { validateTemplate } from '../src/utils/getValidTemplates';
import { error } from '../src/utils/log';
import { init, handleException } from '../src/utils/usage';

const trx = init();

(async () => {
  const args = getArgs();
  if (args['--help'] || args.count === 0) {
    console.log(await helpMessage());
    return 0;
  }
  const templateArg = args['--template'];
  if (templateArg) {
    const valid = await validateTemplate(templateArg);
    if (!valid) {
      console.log(await helpMessage());
      process.exit(1);
    }
  }

  console.log(welcomeMessage);
  try {
    await getProjectName();
    await getLanguage();
    await getTemplate();
    await getDatabaseConnection();
    await getPayloadSecret();
    if (!args['--dry-run']) {
      await createProject();
      await writeEnvFile();
    }
    success('Payload project successfully created');
    console.log(await successMessage());
  } catch (e) {
    handleException(e);
    error(`An error has occurred: ${e && e.message}`);
  } finally {
    trx.finish();
  }
})();