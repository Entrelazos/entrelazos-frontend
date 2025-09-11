#!/usr/bin/env node

/**
 * Script to check if your recent commits follow conventional format
 * Run with: node scripts/check-commits.js
 */

const { execSync } = require('child_process');

const CONVENTIONAL_TYPES = [
  'feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'
];

function getRecentCommits(count = 10) {
  try {
    const output = execSync(`git log --oneline -${count}`, { encoding: 'utf8' });
    return output.trim().split('\n').map(line => {
      const [hash, ...messageParts] = line.split(' ');
      return {
        hash: hash,
        message: messageParts.join(' ')
      };
    });
  } catch (error) {
    console.error('Error getting commits:', error.message);
    return [];
  }
}

function isConventionalCommit(message) {
  const conventionalPattern = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .{1,}/;
  return conventionalPattern.test(message);
}

function analyzeCommits() {
  console.log('🔍 Analyzing recent commits for conventional format...\n');
  
  const commits = getRecentCommits(10);
  
  if (commits.length === 0) {
    console.log('❌ No commits found');
    return;
  }

  let conventionalCount = 0;
  let nonConventionalCount = 0;

  commits.forEach(commit => {
    const isConventional = isConventionalCommit(commit.message);
    const status = isConventional ? '✅' : '❌';
    const color = isConventional ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';
    
    console.log(`${status} ${color}${commit.hash}${reset}: ${commit.message}`);
    
    if (isConventional) {
      conventionalCount++;
    } else {
      nonConventionalCount++;
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`✅ Conventional commits: ${conventionalCount}`);
  console.log(`❌ Non-conventional commits: ${nonConventionalCount}`);
  
  if (nonConventionalCount > 0) {
    console.log(`\n💡 To fix this for better automated releases:`);
    console.log(`   1. Use "npm run commit" for future commits`);
    console.log(`   2. Or format manually like: "feat: add new feature"`);
    console.log(`\n📚 Valid types: ${CONVENTIONAL_TYPES.join(', ')}`);
    console.log(`\n⚠️  Non-conventional commits won't trigger version bumps`);
  } else {
    console.log(`\n🎉 All commits follow conventional format!`);
  }
}

// Run the analysis
analyzeCommits();