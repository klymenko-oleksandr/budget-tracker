#!/usr/bin/env node

/**
 * Pre-deployment checklist script
 * Verifies that the app is ready for production deployment
 */

const fs = require('fs');

console.log('🚀 Budget Tracker - Pre-Deployment Check\n');

const checks = [
    {
        name: 'Package.json exists',
        check: () => fs.existsSync('package.json'),
        fix: 'Ensure package.json is in the root directory',
    },
    {
        name: 'Next.js config exists',
        check: () => fs.existsSync('next.config.ts') || fs.existsSync('next.config.js'),
        fix: 'Create next.config.ts file',
    },
    {
        name: 'Environment example exists',
        check: () => fs.existsSync('.env.example'),
        fix: 'Create .env.example with required variables',
    },
    {
        name: 'TypeScript config exists',
        check: () => fs.existsSync('tsconfig.json'),
        fix: 'Ensure tsconfig.json exists',
    },
    {
        name: 'Build script exists',
        check: () => {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            return pkg.scripts && pkg.scripts.build;
        },
        fix: 'Add "build": "next build" to package.json scripts',
    },
    {
        name: 'Start script exists',
        check: () => {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            return pkg.scripts && pkg.scripts.start;
        },
        fix: 'Add "start": "next start" to package.json scripts',
    },
    {
        name: 'Prisma schema exists',
        check: () => fs.existsSync('prisma/schema.prisma'),
        fix: 'Ensure Prisma schema is configured',
    },
    {
        name: 'Source directory exists',
        check: () => fs.existsSync('src'),
        fix: 'Ensure src directory with app structure exists',
    },
];

let passed = 0;
let failed = 0;

checks.forEach(({ name, check, fix }) => {
    const result = check();
    if (result) {
        console.log(`✅ ${name}`);
        passed++;
    } else {
        console.log(`❌ ${name}`);
        console.log(`   Fix: ${fix}`);
        failed++;
    }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
    console.log('🎉 Your app is ready for deployment!');
    console.log('\n🚀 Next steps:');
    console.log('1. Push your code to GitHub');
    console.log('2. Connect to Vercel');
    console.log('3. Add environment variables');
    console.log('4. Deploy!');
} else {
    console.log('⚠️  Please fix the issues above before deploying.');
}

console.log('\n📖 Full deployment guide: https://nextjs.org/docs/deployment');
