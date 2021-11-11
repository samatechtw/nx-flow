import { ExecutorContext } from '@nrwl/devkit';
import { LintExecutorSchema } from './schema';
import { getWorkspaceRoot } from '../../utils';
import { executeCommand } from '../../shell';

export default async function runExecutor(
  options: LintExecutorSchema,
  context: ExecutorContext
) {
  console.log('Executor ran for lint', options);
  const workspaceRoot = getWorkspaceRoot(context);

  try {
    const args = ['node', 'node_modules/.bin/cadence-lint'];
    if (options.configPath) {
      args.push('--configPath', `"${options.configPath}"`);
    }
    if (options.files) {
      args.push('--files', `"${options.files}"`);
    }
    if (options.strict) {
      args.push('--strict');
    }
    const success = executeCommand(workspaceRoot, args);

    return { success };
  } catch (e) {
    return { success: false };
  }
}
