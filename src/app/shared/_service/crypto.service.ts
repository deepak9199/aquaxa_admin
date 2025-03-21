import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  // Method to encrypt a string
  encrypt(value: any, key: string) {
    const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV

    const encrypted = CryptoJS.AES.encrypt(value, keyUtf8, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Combine the IV with the encrypted data
    const encryptedWithIv = iv.concat(encrypted.ciphertext);

    // Encode the combined data in Base64
    return CryptoJS.enc.Base64.stringify(encryptedWithIv);
  }

  // Method to decrypt a string
  decrypt(encryptedValue: any, key: string) {
    const keyUtf8 = CryptoJS.enc.Utf8.parse(key);

    // Decode the Base64-encoded data
    const encryptedWithIv = CryptoJS.enc.Base64.parse(encryptedValue);

    // Extract the IV from the data
    const iv = CryptoJS.lib.WordArray.create(encryptedWithIv.words.slice(0, 4)); // 4 words = 16 bytes
    const ciphertext = CryptoJS.lib.WordArray.create(encryptedWithIv.words.slice(4));

    // Prepare the CipherParams object
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: ciphertext,
      iv: iv
    });

    // Decrypt using AES
    const decrypted = CryptoJS.AES.decrypt(cipherParams, keyUtf8, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
