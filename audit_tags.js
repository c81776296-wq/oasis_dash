const fs = require('fs');
const content = fs.readFileSync('App.tsx', 'utf8');
const lines = content.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<>')) console.log(`OPEN at L${i + 1}: ${lines[i].trim()}`);
    if (lines[i].includes('</>')) console.log(`CLOSE at L${i + 1}: ${lines[i].trim()}`);
}
