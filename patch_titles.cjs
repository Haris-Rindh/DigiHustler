const fs = require('fs');
const path = require('path');

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/ \u2014 /g, ' | ');
      content = content.replace(/ \u2013 /g, ' | ');
      content = content.replace(/ - /g, ' | ');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

traverse('src/components');
