//generate keypair to file
module.exports.generateKeys = () => {
  return new Promise((resolve, reject) => {
    const {
      generateKeyPair
    } = require('crypto');
    let crypto = require("crypto");
    generateKeyPair('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    }, (err, publicKey, privateKey) => {
      // Handle errors and use the generated key pair.
      if(err){
        reject(err);
      }
      resolve([publicKey, privateKey]);
    });
  });
}
