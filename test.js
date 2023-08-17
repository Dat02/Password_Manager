"use strict";

const { Keychain } = require('./password-manager');
const crypto = require('crypto');
const { byteArrayToString, genRandomSalt, getRandomByteArrray, untypedToTypedArray, bufferToUntypedArray, stringToByteArray } = require("./lib");
const { subtle } = require('crypto').webcrypto;

// async function init(password) {
//     const buffer     = stringToByteArray(password);
//     const key        = await subtle.importKey('raw', buffer, {name: 'PBKDF2'}, false, ['deriveKey']);
//     const privateKey = await subtle.deriveKey({name: 'PBKDF2', hash: {name: 'SHA-256'}, iterations: 100, salt: stringToByteArray("hehe")}, key, {name: 'AES-GCM', length: 256}, true, ['encrypt', 'decrypt']);
//     const macKey = await subtle.deriveKey({name: 'PBKDF2', hash: {name: 'SHA-256'}, iterations: 100, salt: stringToByteArray("hehe")}, key,  { name: 'HMAC', hash: { name: 'SHA-256'}, length: 256 }, true, ['sign', 'verify']);
//     const rawKeyExported = await subtle.exportKey("raw",macKey);
//     console.log( rawKeyExported);
//     // console.log('Key material:', jsonWebKey);
//     // let plainText = stringToByteArray("hianhem");
//     // let iv = crypto.getRandomValues(new Uint8Array(32));
//     // let ecryptedData = await subtle.encrypt({name: "AES-GCM", iv: iv},privateKey,plainText);
//     // console.log(typeof ecryptedData);
// }

// async function gen(password){
//     const salt = stringToByteArray("caubevang02_aNgong582@@");
//     const buffer     = stringToByteArray(password);
//     const key        = await subtle.importKey('raw', buffer, {name: 'PBKDF2'}, false, ['deriveKey']);
//     const aesKey = await subtle.deriveKey({name: 'PBKDF2', hash: {name: 'SHA-256'}, iterations: 10 , salt: salt}, key, {name: 'AES-GCM', length: 256}, false, ['encrypt', 'decrypt']);
//     const macKey = await subtle.deriveKey({name: 'PBKDF2', hash: {name: 'SHA-256'}, iterations: 10 , salt: salt}, key, {name: 'HMAC', hash: 'SHA-256',length: 256}, false, ['sign','verify']);
//     console.log(typeof aesKey, typeof macKey);
// }

// gen("hehoadsk");


// console.log(Keychain.init("hadh"));
// let keychain = new Keychain();
// console.log(keychain.secrets.salt);

// let t = crypto.getRandomValues(new Uint8Array(32));
// console.log(t);
// t = byteArrayToString(t);
// console.log(t);
// t = stringToByteArray(t);
// console.log(t);

async function ed(password){
    const salt = stringToByteArray("caubevang02_aNgong582@@");
    const buffer     = stringToByteArray(password);
    const key        = await subtle.importKey('raw', buffer, {name: 'PBKDF2'}, false, ['deriveKey']);
    const aesKey = await subtle.deriveKey({name: 'PBKDF2', hash: {name: 'SHA-256'}, iterations: 10 , salt: salt}, key, {name: 'AES-GCM', length: 256}, false, ['encrypt', 'decrypt']);
    // const macKey = await subtle.deriveKey({name: 'PBKDF2', hash: {name: 'SHA-256'}, iterations: this.PBKDF2_ITERATIONS , salt: salt}, key, {name: 'HMAC', hash: 'SHA-256',length: 256}, false, ['sign','verify']);

    const plainText  = "xin chao toi la Dat";

    let iv = crypto.getRandomValues(new Uint8Array(32));
    let encryptedValue = await subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      stringToByteArray(plainText)
    );
    
    let arr = new Uint8Array(encryptedValue);
    console.log(arr);
    arr = byteArrayToString(arr);
    arr = stringToByteArray(arr);
    console.log(arr);

    // let res = (await subtle.decrypt({ name: "AES-GCM", iv: iv }, aesKey,arr) );
}

// ed("caube");
// let str = "cabevang fasdf 121211 jdas82 2 jfdaskfjasdioyh 2 a adsf1234 sdfu2 *& ^@ 38r3";
//  str = stringToByteArray(str);
// console.log(str);
// str = byteArrayToString(str);
// console.log(str);






// const plainText = "xin chao toi la Dat";

// // Generate a random initialization vector
// let iv = crypto.getRandomValues(new Uint8Array(32));

// // Encrypt the plaintext using AES-GCM
// let encryptedValue = await subtle.encrypt(
//   { name: "AES-GCM", iv: iv },
//   aesKey,
//   stringToByteArray(plainText)
// );

// // Convert the encrypted value to a Uint8Array
// let encryptedBytes = new Uint8Array(encryptedValue);

// // Convert the encrypted bytes to a string using TextEncoder
// let encodedString = new TextEncoder().encode(encryptedBytes).toString();

// console.log(encodedString); // Output: "Y/3NYjJrvwBoZw/URZQvRzFnWJj8NLPxk00IyN/wg=="

// // Convert the string back to a Uint8Array using TextDecoder
// let decodedBytes = new TextDecoder().decode(Uint8Array.from(atob(encodedString), c => c.charCodeAt(0)));

// // Decrypt the encrypted value using AES-GCM
// let decryptedValue = await subtle.decrypt(
//   { name: "AES-GCM", iv: iv },
//   aesKey,
//   decodedBytes
// );

// // Convert the decrypted value back to a string
// let decryptedText = byteArrayToString(new Uint8Array(decryptedValue));

// console.log(decryptedText); // Output: "xin chao toi la Dat"


// let obj = {
//     kvs :[
//         {x: [1,2]},
//         {y: [2,4]}    
//     ]
// }

// let x = "x";
// console.log(obj.kvs[0][x][1])

async function t(){
let keychain =  await Keychain.init("caubevang");
await keychain.set("facebook","123456k");
console.log(await keychain.get("facebook"));
}
// t();

async function d(){
    const buffer     = stringToByteArray("password123!");
    const key        = await subtle.importKey('raw', buffer, {name: 'PBKDF2'}, false, ['deriveKey']);
    const privateKey = await subtle.deriveKey({name: 'PBKDF2', hash: {name: 'SHA-256'}, iterations: 100000, salt: stringToByteArray("caubevang02_aNgong582@@")}, key, {name: 'AES-GCM', length: 256}, true, ['encrypt', 'decrypt']);
    const rawKeyExported = await subtle.exportKey("raw",privateKey);
    console.log( rawKeyExported);
    let iv = new Uint8Array([36,99,98,241,65,241, 73,188,107,215,4,173]);
    // let plaintText = new Uint8Array([60,  71, 239, 191, 189, 239, 191, 189,
    //     239, 191, 189, 126, 239, 191, 189, 103,
    //     239, 191, 189,  46, 107,  31,  51, 107,
    //      75, 239, 191, 189, 239, 191, 189,  16,
    //     239, 191, 189, 241, 158, 131, 129]);
    let plainText = stringToByteArray('sunetpassword');
    let encryptedValue = await subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        privateKey,
        plainText
      );

    let cipherText = new Uint8Array(encryptedValue);
    let cipherText2 = stringToByteArray(byteArrayToString(cipherText)) ;
    let value = await subtle.decrypt({ name: "AES-GCM", iv: iv},privateKey, cipherText );
    console.log(byteArrayToString(new Uint8Array(value)));
}
d();