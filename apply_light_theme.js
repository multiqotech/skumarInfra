const fs = require('fs');
const path = require('path');

const replacements = [
  // Backgrounds
  { from: /bg-\[#0C0C0C\]/g, to: 'bg-[#f7f9fc]' },
  { from: /bg-\[#141414\]/g, to: 'bg-white' },
  { from: /bg-\[#1a1a1a\]/g, to: 'bg-[#f7f9fc]' },
  { from: /bg-\[#0a0a0a\]/g, to: 'bg-[#f7f9fc]' },
  { from: /bg-\[#111\]/g, to: 'bg-white' },
  { from: /bg-\[#222\]/g, to: 'bg-[#f0f4f8]' },
  { from: /bg-gray-800/g, to: 'bg-[#f0f4f8]' },
  { from: /bg-gray-900/g, to: 'bg-[#e2e8f0]' },
  { from: /bg-gray-700/g, to: 'bg-gray-200' },
  { from: /bg-black\/50/g, to: 'bg-[#183964]\/40' },
  { from: /bg-black\/60/g, to: 'bg-[#183964]\/40' },
  { from: /bg-black\/80/g, to: 'bg-[#183964]\/40' },
  { from: /bg-black\/20/g, to: 'bg-[#183964]\/5' },
  { from: /bg-white\/5/g, to: 'bg-[#183964]\/5' },
  { from: /bg-white\/10/g, to: 'bg-[#183964]\/10' },
  { from: /bg-white\/20/g, to: 'bg-[#183964]\/20' },
  
  // Borders
  { from: /border-\[#222\]/g, to: 'border-[#183964]\/10' },
  { from: /border-\[#2a2a2a\]/g, to: 'border-[#183964]\/10' },
  { from: /border-\[#333\]/g, to: 'border-[#183964]\/20' },
  { from: /border-gray-700/g, to: 'border-[#183964]\/10' },
  { from: /border-gray-800/g, to: 'border-[#183964]\/10' },

  // Text Colors
  { from: /text-white/g, to: 'text-[#183964]' },
  { from: /text-gray-400/g, to: 'text-[#6b7280]' },
  { from: /text-gray-300/g, to: 'text-[#4b5563]' },
  { from: /text-gray-500/g, to: 'text-[#6b7280]' },
  { from: /text-black/g, to: 'text-white' }, // e.g. for buttons since we changed them to orange
  
  // Hovers
  { from: /hover:bg-gray-800/g, to: 'hover:bg-[#f0f4f8]' },
  { from: /hover:bg-gray-700/g, to: 'hover:bg-gray-300' },
  { from: /hover:bg-white\/10/g, to: 'hover:bg-[#183964]\/10' },
  { from: /hover:bg-white\/5/g, to: 'hover:bg-[#183964]\/5' },
  { from: /hover:text-white/g, to: 'hover:text-[#183964]' },
  
  // Prose
  { from: /prose-invert/g, to: 'prose' },
  { from: /prose-li:text-gray-300/g, to: 'prose-li:text-[#4b5563]' },
  { from: /prose-p:text-gray-300/g, to: 'prose-p:text-[#4b5563]' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content;
  
  replacements.forEach(rep => {
    newContent = newContent.replace(rep.from, rep.to);
  });
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log('Updated: ' + filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      processFile(filePath);
    }
  }
}

walk('d:/freelance/skConstruction/admin/src/app');
walk('d:/freelance/skConstruction/admin/src/components');

