const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacePatterns = [
  // Dark mode backgrounds
  { regex: /#0C0C0C/g, replacement: '#09090B' }, // Base bg
  { regex: /#161616/g, replacement: '#18181B' }, // Secondary bg
  { regex: /#1C1C1C/g, replacement: '#18181B' }, // Card bg
  
  { regex: /#111111/g, replacement: '#09090B' }, // Re-standardize all dark sections

  // Dark mode borders
  { regex: /border-\[\#2A2A2A\]/g, replacement: 'border-white/10' },
  { regex: /dark:border-white\/10/g, replacement: 'dark:border-white/10' }, // Just in case
  
  // Light mode standardization
  { regex: /#FFFDF9/g, replacement: '#FAFAFA' },
  { regex: /#F5F1EA/g, replacement: '#FAFAFA' },
  
  // Light mode grays -> Zinc for a premium, less blue/purple tint
  { regex: /text-gray-900/g, replacement: 'text-zinc-900' },
  { regex: /text-gray-800/g, replacement: 'text-zinc-800' },
  { regex: /text-gray-700/g, replacement: 'text-zinc-700' },
  { regex: /text-gray-600/g, replacement: 'text-zinc-600' },
  { regex: /text-gray-500/g, replacement: 'text-zinc-500' },
  { regex: /text-gray-400/g, replacement: 'text-zinc-400' },
  { regex: /text-gray-300/g, replacement: 'text-zinc-300' },
  
  // Light mode borders
  { regex: /border-gray-200/g, replacement: 'border-black/5' },
  { regex: /border-gray-100/g, replacement: 'border-black/5' },
  
  // Light mode backgrounds
  { regex: /bg-gray-50/g, replacement: 'bg-[#FAFAFA]' },
  { regex: /bg-gray-100/g, replacement: 'bg-zinc-100' },
  { regex: /bg-gray-200/g, replacement: 'bg-zinc-200' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      replacePatterns.forEach(pattern => {
        content = content.replace(pattern.regex, pattern.replacement);
      });
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(directoryPath);
console.log('Theme refactor complete!');
