import https from 'https';
import tls from 'tls';
import fs from 'fs';
import path from 'path';
const __dirnames = process.cwd();
const trustedCa = ['https/ca.crt'];

https.globalAgent.options.ca = [...tls.rootCertificates];
for (const ca of trustedCa) {
  https.globalAgent.options.ca.push(fs.readFileSync(path.join(__dirnames, ca)));
}
