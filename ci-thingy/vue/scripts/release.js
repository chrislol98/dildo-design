// @ts-check
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import minimist from 'minimist';
import enquirer from 'enquirer';
import semver from 'semver';
import { execa } from 'execa';
import pico from 'picocolors';

let versionUpdated = false;
const { prompt } = enquirer;
const skippedPackages = [];
const currentVersion = createRequire(import.meta.url)('../package.json').version;
const args = minimist(process.argv.slice(2), {
  alias: {
    skipBuild: 'skip-build',
    skipTests: 'skip-tests',
    skipGit: 'skip-git',
    skipPrompts: 'skip-prompts',
  },
});
const isDryRun = args.dry;
const isCanary = args.canary;
const skipGit = args.skipGit || args.canary;

const packages = fs.readdirSync(path.resolve(__dirname, '../packages')).filter((p) => {
  const pkgRoot = path.resolve(__dirname, '../packages', p);
  if (fs.statSync(pkgRoot).isDirectory()) {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(pkgRoot, 'package.json'), 'utf-8'));
    return !pkg.private;
  }
});
// alpha
const preId = args.preid || semver.prerelease(currentVersion)?.[0];
const versionIncrements = [
  'patch',
  'minor',
  'major',
  ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
];
const inc = (i) => semver.inc(currentVersion, i, preId);
const keepThePackageName = (pkgName) => pkgName;
const getPkgRoot = (pkg) => path.resolve(__dirname, '../packages/' + pkg);
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts });
const dryRun = (bin, args, opts = {}) =>
  console.log(pico.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts);

function updateVersions(version, getNewPackageName) {
  // update root package.json
  updatePackage(path.resolve(__dirname, '..'), version, getNewPackageName);
  // update all packages
  packages.forEach((p) => updatePackage(getPkgRoot(p), version, getNewPackageName));
}

function updatePackage(pkgRoot, version, getNewPackageName) {
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.name = getNewPackageName(pkg.name);
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

async function publishPackage(pkgName, version) {
  if (skippedPackages.includes(pkgName)) {
    return;
  }

  let releaseTag = null;
  if (args.tag) {
    releaseTag = args.tag;
  } else if (version.includes('alpha')) {
    releaseTag = 'alpha';
  } else if (version.includes('beta')) {
    releaseTag = 'beta';
  } else if (version.includes('rc')) {
    releaseTag = 'rc';
  }

  try {
    await run(
      'pnpm',
      [
        'publish',
        ...(releaseTag ? ['--tag', releaseTag] : []),
        '--access',
        'public',
        ...(isDryRun ? ['--dry-run'] : []),
        ...(skipGit ? ['--no-git-checks'] : []),
      ],
      {
        cwd: getPkgRoot(pkgName),
        stdio: 'pipe',
      }
    );
    console.log(pico.green(`Successfully published ${pkgName}@${version}`));
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(pico.red(`Skipping already published: ${pkgName}`));
    } else {
      throw e;
    }
  }
}

const runIfNotDry = isDryRun ? dryRun : run;
// look hear !!!!!!!!!!!!!!!!!!!!!!!!!
async function main() {
  let targetVersion = args._[0];

  if (!targetVersion) {
    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements.map((i) => `${i} (${inc(i)})`).concat(['custom']),
    });

    if (release === 'custom') {
      const result = await prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      });
      targetVersion = result.version;
    } else {
      targetVersion = release.match(/\((.*)\)/)[1];
    }
  }
  // 1.update all package versions and inter-dependencies
  updateVersions(targetVersion, keepThePackageName);
  versionUpdated = true;
  // generate changelog
  await run(`pnpm`, ['run', 'changelog']);

  if (!isCanary) {
    // why ?
    // nUpdating lockfile...
    await run(`pnpm`, ['install', '--prefer-offline']);
  }

  // publish packages
  for (const pkg of packages) {
    await publishPackage(pkg, targetVersion);
  }

  if (!skipGit) {
    const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
    if (stdout) {
      await runIfNotDry('git', ['add', '-A']);
      await runIfNotDry('git', ['commit', '-m', `release: v${targetVersion}`]);
    } else {
      console.log('No changes to commit.');
    }
  }

  // push to GitHub
  if (!skipGit) {
    await runIfNotDry('git', ['tag', `v${targetVersion}`]);
    await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
    await runIfNotDry('git', ['push']);
  }
}

main().catch((err) => {
  if (versionUpdated) {
    // revert to current version on failed releases
    updateVersions(currentVersion);
  }
  console.error(err);
  process.exit(1);
});
