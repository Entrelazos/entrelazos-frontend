# Release Workflow Documentation

## Overview

This project uses automated semantic versioning and releases based on conventional commits. The release process is fully automated using GitHub Actions.

## Commit Message Format

We use [Conventional Commits](https://conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature (triggers minor version bump)
- **fix**: A bug fix (triggers patch version bump)  
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: Code changes that neither fix a bug nor add a feature
- **perf**: Performance improvements
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools
- **ci**: Changes to CI configuration files and scripts

### Breaking Changes

Add `BREAKING CHANGE:` in the footer or use `!` after type to trigger major version bump:

```
feat!: remove deprecated API endpoint

BREAKING CHANGE: The old API endpoint has been removed, use the new one instead.
```

## Release Branches

- **main**: Production releases (1.0.0, 1.1.0, 1.2.1, etc.)
- **beta**: Pre-release versions (1.1.0-beta.1, 1.1.0-beta.2, etc.)
- **alpha**: Alpha versions (1.1.0-alpha.1, 1.1.0-alpha.2, etc.)

## How to Contribute

### Using Commitizen (Recommended)

1. Stage your changes: `git add .`
2. Use the interactive commit tool: `npm run commit`
3. Follow the prompts to create a conventional commit

### Manual Commits

If you prefer manual commits, ensure they follow the conventional format:

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login validation issue"
git commit -m "docs: update API documentation"
```

## Release Process

### Automatic Releases

1. **PR Validation**: When you create a PR, the CI pipeline runs tests and validates commit messages
2. **Merge to Main**: When PR is merged to `main`, the release workflow automatically:
   - Analyzes commits since last release
   - Determines the next version number
   - Generates changelog
   - Creates GitHub release with tag
   - Deploys to production

### Manual Release (if needed)

```bash
# Run semantic release locally (not recommended)
npm run semantic-release
```

## Version Numbering

Following [Semantic Versioning](https://semver.org/):

- **Major** (X.0.0): Breaking changes
- **Minor** (X.Y.0): New features (backward compatible)
- **Patch** (X.Y.Z): Bug fixes

## Examples

### Adding a New Feature
```bash
git add .
npm run commit
# Select: feat
# Description: add dark mode toggle
# Result: feat: add dark mode toggle
# This will trigger a minor version bump (1.0.0 → 1.1.0)
```

### Fixing a Bug
```bash
git add .
npm run commit
# Select: fix
# Description: resolve navigation menu issue
# Result: fix: resolve navigation menu issue
# This will trigger a patch version bump (1.1.0 → 1.1.1)
```

### Breaking Change
```bash
git add .
npm run commit
# Select: feat
# Breaking change: Yes
# Description: redesign user settings API
# Result: feat!: redesign user settings API
# This will trigger a major version bump (1.1.1 → 2.0.0)
```

## Troubleshooting

### Commit Message Validation Fails
- Ensure your commit message follows conventional format
- Use `npm run commit` for guided commit creation
- Check the error message for specific issues

### Release Fails
- Check GitHub Actions logs
- Ensure all tests pass
- Verify commit messages are conventional
- Check if GITHUB_TOKEN has proper permissions

### Pre-release Versions
To create pre-release versions, push to `beta` or `alpha` branches:

```bash
git checkout -b beta
git push origin beta  # Creates 1.1.0-beta.1
```