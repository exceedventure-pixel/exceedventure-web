const fs = require('fs');
let code = fs.readFileSync('src/Header/Nav/DesktopNav.tsx', 'utf8');

code = code.replace(
  '<CMSLink\n                  {...item.link as any}\n                  appearance="link"',
  '<CMSLink\n                  {...item.link as any}\n                  label={null as any}\n                  appearance="link"'
);
code = code.replace(
  '<CMSLink\r\n                  {...item.link as any}\r\n                  appearance="link"',
  '<CMSLink\r\n                  {...item.link as any}\r\n                  label={null as any}\r\n                  appearance="link"'
);

code = code.replace(
  '<CMSLink key={idx} {...(subItem.link as any)} className',
  '<CMSLink key={idx} {...(subItem.link as any)} label={null as any} className'
);

fs.writeFileSync('src/Header/Nav/DesktopNav.tsx', code);

// Also fix Component.client.tsx Logo!
let cc = fs.readFileSync('src/Header/Component.client.tsx', 'utf8');
cc = cc.replace(
  "src={(safeTheme === 'dark' && darkLogoUrl) ? darkLogoUrl : lightLogoUrl || '/exceed-venture-logo.svg'}",
  "src={safeTheme === 'dark' ? (darkLogoUrl || '/exceed-venture-logo-dark.svg') : (lightLogoUrl || '/exceed-venture-logo.svg')}"
);
fs.writeFileSync('src/Header/Component.client.tsx', cc);
console.log('Fixed files');