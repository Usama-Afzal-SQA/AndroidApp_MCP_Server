#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const PROJECT_ROOT = process.cwd();
const PROMPTS_ROOT = path.join(PROJECT_ROOT, 'prompts', 'android');
const REQUIRED_FRONT_MATTER_KEYS = [
  'title',
  'feature',
  'journey',
  'platform',
  'generated_test',
  'page_objects',
  'tags'
];
const REQUIRED_SHARED_SECTIONS = [
  'Shared Context',
  'Shared Rules',
  'Shared Test Data'
];
const REQUIRED_SCENARIO_SECTIONS = [
  'Goal',
  'Steps',
  'Assertions',
  'Notes'
];

const SHARED_DATA_CONSTANTS = {
  ownerEmail: 'OWNER_EMAIL',
  appPackage: 'GOALLY_PACKAGE',
  guideSearchTerm: 'GUIDE_SEARCH_TERM',
  guideCustomization: 'GUIDE_CUSTOMIZATION',
  confirmationButton: 'CONFIRMATION_BUTTON'
};

const HELPER_IMPORTS = {
  'android.app': {
    names: ['launchFromCleanState'],
    modulePath: path.join(PROJECT_ROOT, 'tests', 'utils', 'android.app')
  },
  'otp.prompt': {
    names: ['promptForOtp'],
    modulePath: path.join(PROJECT_ROOT, 'tests', 'utils', 'otp.prompt')
  }
};

const FLOW_DEFINITIONS = {
  owner_manual_otp_login: {
    pageObjects: [
      'welcome.page',
      'provider-selection.page',
      'email-login.page',
      'otp-verification.page',
      'home.page'
    ],
    helpers: ['android.app', 'otp.prompt'],
    sharedData: ['ownerEmail', 'appPackage'],
    renderLines: () => [
      'await launchFromCleanState(GOALLY_PACKAGE);',
      'await welcomePage.waitForLoaded();',
      'await welcomePage.tapGoallyAccountOwner();',
      'await providerSelectionPage.waitForLoaded();',
      'await providerSelectionPage.tapGetGoally();',
      'await emailLoginPage.waitForLoaded();',
      'await emailLoginPage.enterEmail(OWNER_EMAIL);',
      'await emailLoginPage.tapContinue();',
      'await otpVerificationPage.waitForLoaded();',
      "const otp = await promptForOtp('Please enter the OTP from email: ');",
      'await otpVerificationPage.enterOtp(otp);',
      'await homePage.waitForLoaded();',
      'assert.ok(',
      '  await homePage.isLoaded(3000),',
      "  'Expected the post-login home screen to be visible.'",
      ');'
    ]
  },
  open_copilots_from_home: {
    pageObjects: ['home.page', 'copilots.page'],
    helpers: [],
    sharedData: [],
    renderLines: () => [
      'await homePage.tapCoPilotsButton();',
      'await copilotsPage.waitForLoaded();',
      'assert.ok(',
      '  await copilotsPage.createButton.isExisting(),',
      "  'Expected the CoPilots screen to expose the Create entry point.'",
      ');'
    ]
  },
  create_guide_from_copilots: {
    pageObjects: [
      'copilots.page',
      'guide-template-search.page',
      'copilot-copied-modal.page'
    ],
    helpers: [],
    sharedData: ['guideSearchTerm', 'guideCustomization', 'confirmationButton'],
    renderLines: () => [
      'await copilotsPage.tapCreate();',
      'await copilotsPage.waitForCreateMenu();',
      'assert.equal(',
      '  await copilotsPage.customizeGoallyGuideOption.getText(),',
      "  'Customize Goally Guide'",
      ');',
      'await copilotsPage.tapCustomizeGoallyGuide();',
      'await guideTemplateSearchPage.waitForLoaded();',
      'await guideTemplateSearchPage.searchFor(GUIDE_SEARCH_TERM);',
      'await guideTemplateSearchPage.selectWashClothesIfVisible(5000);',
      'await guideTemplateSearchPage.waitForCustomizeForBully();',
      'assert.equal(',
      '  await guideTemplateSearchPage.getCustomizeForBullyText(),',
      '  GUIDE_CUSTOMIZATION',
      ');',
      'await guideTemplateSearchPage.tapCustomizeForBully();',
      'await copilotCopiedModalPage.waitForLoaded();',
      'assert.equal(',
      '  await copilotCopiedModalPage.okayButton.getText(),',
      '  CONFIRMATION_BUTTON',
      ');',
      'await copilotCopiedModalPage.tapOkay();'
    ]
  }
};

function main() {
  const specPaths = resolveSpecPaths(process.argv.slice(2));

  if (!specPaths.length) {
    throw new Error(
      'No prompt specs found. Pass a spec path or use --all.'
    );
  }

  specPaths.forEach((specPath) => {
    const spec = parseSpec(specPath);
    const outputPath = path.resolve(PROJECT_ROOT, spec.frontMatter.generated_test);
    const output = renderGeneratedSpec(spec, outputPath);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, output);

    console.log(
      `Generated ${path.relative(PROJECT_ROOT, outputPath)} from ${path.relative(PROJECT_ROOT, specPath)}`
    );
  });
}

function resolveSpecPaths(args) {
  if (args.includes('--all')) {
    return walkMarkdownFiles(PROMPTS_ROOT);
  }

  return args.map((inputPath) => {
    const absolutePath = path.resolve(PROJECT_ROOT, inputPath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Prompt spec not found: ${inputPath}`);
    }

    return absolutePath;
  });
}

function walkMarkdownFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  entries
    .slice()
    .sort((left, right) => left.name.localeCompare(right.name))
    .forEach((entry) => {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        files.push(...walkMarkdownFiles(entryPath));
        return;
      }

      if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
        files.push(entryPath);
      }
    });

  return files;
}

function parseSpec(specPath) {
  const fileContents = fs.readFileSync(specPath, 'utf8').replace(/\r\n/g, '\n');
  const { frontMatterSource, bodySource } = splitFrontMatter(fileContents, specPath);
  const frontMatter = parseFrontMatter(frontMatterSource, specPath);
  const sections = splitSections(bodySource, 2);
  const sharedSections = {};
  const scenarios = [];

  sections.forEach((section) => {
    if (section.title.startsWith('Scenario: ')) {
      scenarios.push(parseScenario(section, specPath));
      return;
    }

    sharedSections[section.title] = section.content;
  });

  validateSpec({
    specPath,
    frontMatter,
    sharedSections,
    scenarios
  });

  return {
    specPath,
    frontMatter,
    sharedSections,
    sharedData: parseKeyValueList(sharedSections['Shared Test Data']),
    scenarios
  };
}

function splitFrontMatter(fileContents, specPath) {
  if (!fileContents.startsWith('---\n')) {
    throw new Error(`Expected YAML front matter at the top of ${relativePath(specPath)}.`);
  }

  const closingMarkerIndex = fileContents.indexOf('\n---\n', 4);

  if (closingMarkerIndex === -1) {
    throw new Error(`Missing closing front matter marker in ${relativePath(specPath)}.`);
  }

  return {
    frontMatterSource: fileContents.slice(4, closingMarkerIndex),
    bodySource: fileContents.slice(closingMarkerIndex + 5).trim()
  };
}

function parseFrontMatter(frontMatterSource, specPath) {
  const result = {};
  let activeListKey = null;

  frontMatterSource.split('\n').forEach((rawLine) => {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      return;
    }

    const listMatch = line.match(/^\s*-\s+(.+)$/);

    if (listMatch) {
      if (!activeListKey) {
        throw new Error(`Unexpected list item in front matter for ${relativePath(specPath)}.`);
      }

      result[activeListKey].push(parseScalar(listMatch[1]));
      return;
    }

    const keyValueMatch = line.match(/^([a-z_]+):\s*(.*)$/);

    if (!keyValueMatch) {
      throw new Error(`Invalid front matter line in ${relativePath(specPath)}: ${line}`);
    }

    const [, key, rawValue] = keyValueMatch;

    if (rawValue === '') {
      result[key] = [];
      activeListKey = key;
      return;
    }

    result[key] = parseScalar(rawValue);
    activeListKey = null;
  });

  return result;
}

function parseScalar(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith('`') && trimmed.endsWith('`'))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function splitSections(source, level) {
  const heading = '#'.repeat(level);
  const expression = new RegExp(`^${heading}\\s+(.+)$`, 'gm');
  const matches = Array.from(source.matchAll(expression));

  return matches.map((match, index) => {
    const start = (match.index || 0) + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : source.length;

    return {
      title: match[1].trim(),
      content: source.slice(start, end).trim()
    };
  });
}

function parseScenario(section, specPath) {
  const scenarioName = section.title.slice('Scenario: '.length).trim();
  const subSections = splitSections(section.content, 3);
  const scenarioSections = {};

  subSections.forEach((subSection) => {
    scenarioSections[subSection.title] = subSection.content;
  });

  REQUIRED_SCENARIO_SECTIONS.forEach((requiredSection) => {
    if (!scenarioSections[requiredSection]) {
      throw new Error(
        `Scenario "${scenarioName}" in ${relativePath(specPath)} is missing ### ${requiredSection}.`
      );
    }
  });

  return {
    name: scenarioName,
    sections: scenarioSections,
    flowIds: parseFlowIds(scenarioSections.Notes)
  };
}

function parseFlowIds(notesSource) {
  return notesSource
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- flow:'))
    .map((line) => line.replace('- flow:', '').trim());
}

function validateSpec(spec) {
  REQUIRED_FRONT_MATTER_KEYS.forEach((key) => {
    if (!(key in spec.frontMatter)) {
      throw new Error(`Missing front matter key "${key}" in ${relativePath(spec.specPath)}.`);
    }
  });

  if (spec.frontMatter.platform !== 'android') {
    throw new Error(
      `Only Android prompt specs are supported right now: ${relativePath(spec.specPath)}.`
    );
  }

  if (!Array.isArray(spec.frontMatter.page_objects) || !spec.frontMatter.page_objects.length) {
    throw new Error(`Expected page_objects to be a non-empty list in ${relativePath(spec.specPath)}.`);
  }

  if (!Array.isArray(spec.frontMatter.tags) || !spec.frontMatter.tags.length) {
    throw new Error(`Expected tags to be a non-empty list in ${relativePath(spec.specPath)}.`);
  }

  REQUIRED_SHARED_SECTIONS.forEach((sectionName) => {
    if (!spec.sharedSections[sectionName]) {
      throw new Error(`Missing ## ${sectionName} in ${relativePath(spec.specPath)}.`);
    }
  });

  if (!spec.scenarios.length) {
    throw new Error(`Expected at least one scenario in ${relativePath(spec.specPath)}.`);
  }

  const declaredPageObjects = new Set(spec.frontMatter.page_objects);
  const sharedData = parseKeyValueList(spec.sharedSections['Shared Test Data']);

  spec.scenarios.forEach((scenario) => {
    if (!scenario.flowIds.length) {
      throw new Error(
        `Scenario "${scenario.name}" in ${relativePath(spec.specPath)} must declare at least one flow in ### Notes.`
      );
    }

    scenario.flowIds.forEach((flowId) => {
      const flow = FLOW_DEFINITIONS[flowId];

      if (!flow) {
        throw new Error(
          `Scenario "${scenario.name}" in ${relativePath(spec.specPath)} references an unsupported flow: ${flowId}.`
        );
      }

      flow.pageObjects.forEach((pageObjectId) => {
        if (!declaredPageObjects.has(pageObjectId)) {
          throw new Error(
            `Flow "${flowId}" requires page object "${pageObjectId}" in ${relativePath(spec.specPath)}.`
          );
        }
      });

      flow.sharedData.forEach((dataKey) => {
        if (!sharedData[dataKey]) {
          throw new Error(
            `Flow "${flowId}" requires shared test data "${dataKey}" in ${relativePath(spec.specPath)}.`
          );
        }
      });
    });
  });

  if (!spec.frontMatter.generated_test.startsWith('generated-tests/')) {
    throw new Error(
      `generated_test must write under generated-tests/: ${relativePath(spec.specPath)}.`
    );
  }
}

function parseKeyValueList(sectionSource) {
  return sectionSource.split('\n').reduce((result, rawLine) => {
    const line = rawLine.trim();
    const match = line.match(/^- ([^:]+):\s+(.+)$/);

    if (!match) {
      return result;
    }

    const [, label, rawValue] = match;
    result[toCamelCase(label)] = normalizeMarkdownValue(rawValue);
    return result;
  }, {});
}

function normalizeMarkdownValue(rawValue) {
  const trimmed = rawValue.trim();

  if (
    (trimmed.startsWith('`') && trimmed.endsWith('`')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function renderGeneratedSpec(spec, outputPath) {
  const requiredPageObjects = new Set();
  const requiredHelpers = new Set();
  const requiredSharedData = new Set();

  spec.scenarios.forEach((scenario) => {
    scenario.flowIds.forEach((flowId) => {
      const flow = FLOW_DEFINITIONS[flowId];

      flow.pageObjects.forEach((pageObjectId) => requiredPageObjects.add(pageObjectId));
      flow.helpers.forEach((helperId) => requiredHelpers.add(helperId));
      flow.sharedData.forEach((dataKey) => requiredSharedData.add(dataKey));
    });
  });

  const lines = [
    '/**',
    ' * AUTO-GENERATED. REGENERATE FROM PROMPT SPEC.',
    ` * Source: ${relativePath(spec.specPath)}`,
    ' */',
    '',
    "const assert = require('node:assert/strict');",
    ''
  ];

  spec.frontMatter.page_objects
    .filter((pageObjectId) => requiredPageObjects.has(pageObjectId))
    .forEach((pageObjectId) => {
      lines.push(
        `const ${pageObjectVariableName(pageObjectId)} = require(${jsString(
          toRequirePath(outputPath, path.join(PROJECT_ROOT, 'tests', 'pageobjects', pageObjectId))
        )});`
      );
    });

  if (requiredHelpers.size) {
    lines.push('');

    Array.from(requiredHelpers)
      .sort()
      .forEach((helperId) => {
        const helper = HELPER_IMPORTS[helperId];

        lines.push(
          `const { ${helper.names.join(', ')} } = require(${jsString(
            toRequirePath(outputPath, helper.modulePath)
          )});`
        );
      });
  }

  if (requiredSharedData.size) {
    lines.push('');

    Array.from(requiredSharedData)
      .sort((left, right) => left.localeCompare(right))
      .forEach((dataKey) => {
        const constantName = SHARED_DATA_CONSTANTS[dataKey] || toConstantCase(dataKey);

        lines.push(`const ${constantName} = ${jsString(spec.sharedData[dataKey])};`);
      });
  }

  lines.push('');
  lines.push(`describe(${jsString(spec.frontMatter.title)}, () => {`);

  spec.scenarios.forEach((scenario) => {
    lines.push(`  it(${jsString(scenario.name)}, async function () {`);
    lines.push('    this.timeout(300000);');
    lines.push('');

    scenario.flowIds.forEach((flowId, flowIndex) => {
      const flow = FLOW_DEFINITIONS[flowId];

      if (flowIndex > 0) {
        lines.push('');
      }

      flow.renderLines(spec.sharedData).forEach((line) => {
        lines.push(`    ${line}`);
      });
    });

    lines.push('  });');
    lines.push('');
  });

  lines.push('});');

  return `${lines.join('\n')}\n`;
}

function pageObjectVariableName(pageObjectId) {
  return `${toCamelCase(pageObjectId.replace(/\.page$/, ''))}Page`;
}

function toCamelCase(value) {
  const parts = String(value)
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);

  return parts
    .map((part, index) => {
      const lowerPart = part.toLowerCase();

      if (index === 0) {
        return lowerPart;
      }

      return `${lowerPart.charAt(0).toUpperCase()}${lowerPart.slice(1)}`;
    })
    .join('');
}

function toConstantCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .toUpperCase();
}

function toRequirePath(fromFilePath, targetModulePath) {
  const relativePath = path.relative(path.dirname(fromFilePath), targetModulePath).replace(/\\/g, '/');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function jsString(value) {
  return `'${String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")}'`;
}

function relativePath(targetPath) {
  return path.relative(PROJECT_ROOT, targetPath).replace(/\\/g, '/');
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
