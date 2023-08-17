"use strict";

const crypto = require('crypto');
// const { getRandomValues } = require('node:crypto').webcrypto;

let encoder = new TextEncoder();
let decoder = new TextDecoder();

let stringToByteArray = function(str) {
  return encoder.encode(str);
}

let byteArrayToString = function(arr) {
  return decoder.decode(arr);
}

let getRandomByteArrray = function(len){
  return crypto.getRandomValues(new Uint8Array(len));
}

let genRandomSalt = function(len=16) {
  return byteArrayToString(crypto.getRandomValues(new Uint8Array(len)));
  
}

let untypedToTypedArray = function(arr) {
  return new Uint8Array(arr);
}

let bufferToUntypedArray = function(arr) {
  return Array.from(new Uint8Array(arr));
}

module.exports = {
  stringToByteArray: stringToByteArray,
  byteArrayToString: byteArrayToString,
  genRandomSalt: genRandomSalt,
  getRandomByteArrray: getRandomByteArrray,
  untypedToTypedArray: untypedToTypedArray,
  bufferToUntypedArray: bufferToUntypedArray,
};
