const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client', 'src', 'data', 'weBuildData.js');
let content = fs.readFileSync(filePath, 'utf-8');

// The file contains things like:
// projects: [
//   {
//     title: 'Delhi International Airport - T3',

// Let's just do a regex replace to add `projectType: 'Landmark',` after `title: '...',` for the first match after `projects: [`
// Wait, an easier way is to just inject it directly in a few places.
// Let's use a simpler approach: finding `{` inside `projects: [` array and adding `projectType`.

// But since it's a JS file, not JSON, we can't easily parse it with JSON.parse.
// Let's do a simple regex:
let count = 0;
content = content.replace(/title:\s*'([^']+)',\n\s*image:/g, (match, title) => {
  count++;
  // Alternate between Landmark and Iconic
  const type = count % 2 === 0 ? 'Iconic' : 'Landmark';
  return `title: '${title}',\n        projectType: '${type}',\n        category: 'fallback-category',\n        image:`;
});

// Write it back
fs.writeFileSync(filePath, content, 'utf-8');
console.log(`Updated ${count} projects.`);
