import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  joinPathFragments,
  updateJson,
} from '@nrwl/devkit';
import { addPackageWithInit } from '@nrwl/workspace';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import * as path from 'path';
import { FlowAppGeneratorSchema } from './schema';
import {
  AppDevDependencies,
  AppDependencies,
  VSCodeExtensionsFilePath,
  recommendedExtensions,
} from '../../defaults';
import { updateDependencies } from '../../utils';

interface NormalizedSchema extends FlowAppGeneratorSchema {
  projectName: string;
  projectTitle: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  host: Tree,
  options: FlowAppGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? names(options.directory).fileName
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectTitle = options.title || projectName;
  const projectRoot = joinPathFragments(
    getWorkspaceLayout(host).appsDir,
    projectDirectory
  );
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectTitle,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    // Hack for copying dotfiles - use as a template in the filename
    // e.g. "__dot__eslintrc.js" => ".eslintrc.js"
    dot: '.',
    template: '',
  };
  generateFiles(
    host,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

function updateExtensionRecommendations(host: Tree) {
  if (!host.exists(VSCodeExtensionsFilePath)) {
    host.write(VSCodeExtensionsFilePath, '{ "recommendations": [] }');
  }

  updateJson(host, VSCodeExtensionsFilePath, (json) => {
    json.recommendations ??= [];
    for (const extension of recommendedExtensions) {
      if (
        Array.isArray(json.recommendations) &&
        !json.recommendations.includes(extension)
      )
        json.recommendations.push(extension);
    }
    return json;
  });
}

export default async function (host: Tree, options: FlowAppGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, options);
  const { projectRoot } = normalizedOptions;

  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: joinPathFragments(projectRoot, 'src'),
    targets: {
      build: {
        executor: 'nx-flow:build-app',
        options: {
          dist: joinPathFragments('dist', projectRoot),
        },
      },
      test: {
        executor: '@nrwl/jest:jest',
        outputs: [joinPathFragments('coverage', projectRoot)],
        options: {
          jestConfig: joinPathFragments(projectRoot, 'jest.config.ts'),
          passWithNoTests: true,
        },
      },
      lint: {
        executor: '@nrwl/linter:eslint',
        options: {
          lintFilePatterns: [`${projectRoot}/**/*.{js,ts}`],
        },
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  const depsTask = updateDependencies(
    host,
    AppDependencies,
    AppDevDependencies
  );

  addFiles(host, normalizedOptions);

  updateExtensionRecommendations(host);

  addPackageWithInit('@nrwl/jest');
  await formatFiles(host);

  return runTasksInSerial(depsTask);
}
