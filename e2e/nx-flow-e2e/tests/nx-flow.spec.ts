import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-flow e2e', () => {
  it('should create nx-flow', async () => {
    const plugin = uniq('nx-flow');
    ensureNxProject('@nx-flow/nx-flow', 'dist/packages/nx-flow');
    await runNxCommandAsync(`generate @nx-flow/nx-flow:nx-flow ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('nx-flow');
      ensureNxProject('@nx-flow/nx-flow', 'dist/packages/nx-flow');
      await runNxCommandAsync(
        `generate @nx-flow/nx-flow:nx-flow ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async () => {
      const plugin = uniq('nx-flow');
      ensureNxProject('@nx-flow/nx-flow', 'dist/packages/nx-flow');
      await runNxCommandAsync(
        `generate @nx-flow/nx-flow:nx-flow ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
