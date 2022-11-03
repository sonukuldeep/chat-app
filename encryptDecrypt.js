import CryptoJS from 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js'

const passphrase = "1235";
//cryptojs cdn added to settings js

export const encryptWithAES = (text) => {
  const entryptedText = CryptoJS.AES.encrypt(text, passphrase).toString();
  return entryptedText;
};

export const decryptWithAES = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};