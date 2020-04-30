//decrypt key

const { generateKeyPair } = require('crypto');
generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: ''
  }
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
  console.log("-----------------------------------------------------------------");
  console.log(publicKey);
  console.log("-----------------------------------------------------------------");
  console.log(privateKey);
console.log("-----------------------------------------------------------------");
});
