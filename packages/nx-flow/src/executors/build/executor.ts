import { BuildAppExecutorSchema } from './schema';

export default async function runExecutor(options: BuildAppExecutorSchema) {
  console.log(
    'Build executor ran for Flow. Cadence is currently interpreted, so there is nothing to do!',
    options
  );
  return {
    success: true,
  };
}
