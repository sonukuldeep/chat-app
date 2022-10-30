import { AES, enc } from 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';

const encryptWithAES = (text) => {
  const passphrase = '123';
  return AES.encrypt(text, passphrase).toString();
};

const decryptWithAES = (ciphertext) => {
  const passphrase = '123';
  const bytes = AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(enc.Utf8);
  return originalText;
};