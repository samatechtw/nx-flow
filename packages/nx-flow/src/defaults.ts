export const VSCodeExtensionsFilePath = '.vscode/extensions.json';

export const recommendedExtensions = ['onflow.cadence'];

const onflowTypesVersion = '^0.0.5';
const onflowFclVersion = '^0.0.77';

export const AppDependencies = {
  '@onflow/fcl': onflowFclVersion,
  '@onflow/types': onflowTypesVersion,
  '@onflow/util-uid': '^0.0.1',
  '@onflow/util-invariant': '^0.0.0',
  '@onflow/util-actor': '^0.0.2',
  '@samatech/cadence-lint': '^0.2.0',
};

export const AppDevDependencies = {};

export const TestAppDependencies = {
  '@onflow/fcl': onflowFclVersion,
  '@onflow/types': onflowTypesVersion,
};

export const TestAppDevDependencies = {
  'flow-js-testing': '^0.1.13',
  '@babel/core': '^7.15.5',
  '@babel/preset-env': '^7.15.6',
  'babel-jest': '^27.2.0',
};
