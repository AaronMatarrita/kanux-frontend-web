# Security Rules for Main Branch

This document describes the security rules and configuration files that can be used to protect the main branch of the kanux-frontend-web repository.

## Overview

The main branch can be protected with a comprehensive set of security rules to ensure code quality and prevent unauthorized changes. These rules are enforced through GitHub Rulesets, CODEOWNERS, and CI workflows **after** they have been properly configured in the repository's GitHub settings. Simply committing these files does not enable enforcement by itself; a repository administrator must import and activate the ruleset and branch protection settings as described below.

## Branch Protection Rules

The following rules are configured in `.github/rulesets/main-branch-protection.json`:

### 1. Pull Request Requirements
- **Required Approvals**: At least 1 approval is required before merging
- **Code Owner Review**: Changes must be reviewed by a code owner
- **Stale Review Dismissal**: Reviews are automatically dismissed when new commits are pushed
- **Review Thread Resolution**: All review comments must be resolved before merging

### 2. Status Check Requirements
- **Required Checks**: The "build" status check must pass before merging
- **Strict Mode**: Branches must be up-to-date with the base branch before merging

### 3. History Protection
- **Linear History**: Merge commits are disallowed; contributors must use squash or rebase merges (depending on repository settings) to maintain a clean, linear history
- **Force Push Prevention**: Force pushes to the main branch are blocked
- **Branch Deletion Prevention**: The main branch cannot be deleted

## Code Owners

The CODEOWNERS file (`.github/CODEOWNERS`) defines who is responsible for reviewing changes:

- **Default Owner**: @AaronMatarrita owns all files in the repository
- **GitHub Configuration**: @AaronMatarrita must approve changes to `.github/` directory
- **Documentation**: @AaronMatarrita must approve changes to markdown files

## CI/CD Workflow

The CI workflow (`.github/workflows/ci.yml`) runs automatically on:
- Pushes to the main branch
- Pull requests targeting the main branch

### Validation Steps:
1. **Repository Structure**: Verifies that required files exist (README.md)
2. **Security Files Check**: Ensures CODEOWNERS and ruleset files are present
3. **JSON Validation**: Validates all JSON configuration files for syntax errors

## How to Work with Protected Branches

### Creating a Pull Request
1. Create a feature branch from main
2. Make your changes and commit them
3. Push your branch to GitHub
4. Open a pull request targeting the main branch
5. Wait for CI checks to pass
6. Request a review from the code owner (@AaronMatarrita)
7. Address any review comments
8. Once approved and all checks pass, the PR can be merged

### Best Practices
- Keep pull requests small and focused
- Write clear commit messages
- Ensure all tests pass before requesting review
- Respond to review comments promptly
- Keep your branch up-to-date with main

## Applying the Ruleset

The ruleset defined in `.github/rulesets/main-branch-protection.json` can be applied to the repository through the GitHub web interface:

1. Go to repository Settings
2. Navigate to Rules → Rulesets
3. Click "New ruleset" → "Import a ruleset"
4. Upload the `main-branch-protection.json` file
5. Review and activate the ruleset

Alternatively, the ruleset can be applied via the GitHub API or GitHub CLI.

## Troubleshooting

### Cannot Push to Main Branch
This is expected behavior. Always work on a feature branch and create a pull request.

### CI Check Failing
Review the CI workflow logs to identify the issue. Common problems:
- Missing required files
- Invalid JSON syntax in configuration files
- Repository structure issues

### Review Not Approved
Ensure you've requested a review from @AaronMatarrita and addressed all comments.

## Additional Security Measures

For enhanced security, consider:
- Enabling branch protection rules in GitHub repository settings
- Configuring required status checks
- Setting up vulnerability scanning
- Implementing signed commits
- Enabling secret scanning

## References

- [GitHub Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Actions](https://docs.github.com/en/actions)
