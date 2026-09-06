const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.match(/\.(js|jsx|ts|tsx|css|html)$/)) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.resolve(__dirname, 'src'));

let changedFiles = 0;

files.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    let nc = c;
    
    // Replace all tailwind purple/orange/pink utilities with primary-xxx to align spiritual theme
    nc = nc.replace(/\b(bg|text|border|ring|fill|stroke|from|via|to|shadow|decoration|outline)-(purple|orange|pink)-([0-9]{2,3}(?:\/[0-9]+)?)\b/g, '$1-primary-$3');
    
    // Replace dark grays with brand-text
    nc = nc.replace(/\b(text)-gray-(700|800|900)\b/g, '$1-brand-text');
    
    // Replace text-black with brand-text
    nc = nc.replace(/\btext-black\b/g, 'text-brand-text');
    
    if (c !== nc) {
        fs.writeFileSync(f, nc);
        console.log('Updated spiritual theme colors in: ' + path.basename(f));
        changedFiles++;
    }
});

console.log(`\nSuccessfully applied Spiritual color palette to ${changedFiles} files!`);
