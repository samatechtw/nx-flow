import * as shell from 'shelljs';

export enum CmdStatus {
  Done = 'done',
  Error = 'error',
  ErrorAndDone = 'error_and_done',
  Continue = 'continue',
}

function commandSetup(root: string, args: string[]): string | null {
  const cmd = args.join(' ');
  console.info(`Running: ${cmd}`);

  if (!shell.pwd().endsWith(root)) {
    const paths = shell.pushd('-q', root);
    if (!paths || !paths.length) {
      return null;
    }
  }
  return cmd;
}

// Run a command immediately. Useful for executors
export function executeCommand(root: string, args: string[]): boolean {
  const cmd = commandSetup(root, args);

  if (!cmd || shell.exec(cmd).code !== 0) {
    console.error(`nx-flow command failed:\n> ${cmd}`);
    return false;
  }
  shell.popd();
  return true;
}
