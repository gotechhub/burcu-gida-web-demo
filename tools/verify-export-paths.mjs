import { verifyExportAliases } from './normalize-export-paths.mjs';

// Read-only filesystem verification. HTTP/browser checks remain separate.
const verification = verifyExportAliases({ checkManifest: true });
console.log(JSON.stringify(verification, null, 2));
