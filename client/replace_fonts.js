const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'src', 'sections');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Remove `style={{ fontFamily: 'var(--font-heading)' }}`
  let newContent = content.replace(/style=\{\{\s*fontFamily:\s*'var\(--font-heading\)'\s*\}\}/g, '');
  // Remove empty style tags `style={{ }}` that might have been left over if they were the only prop, though the regex above removes the whole style prop.
  newContent = newContent.replace(/style=\{\{\s*\}\}/g, '');
  // also handle variants -> animation
  newContent = newContent.replace(/variants=\{\{\s*hidden:\s*\{.*?\},\s*visible:\s*\{.*?\}\s*\}\}/gs, 'animation="fade-up"');
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      replaceInFile(filePath);
    }
  });
}

walk(sectionsDir);
console.log('Done replacing inline styles and variants.');
