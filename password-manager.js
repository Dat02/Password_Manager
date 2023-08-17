"use strict";

const { resourceLimits } = require("worker_threads");
/********* External Imports ********/

const { byteArrayToString, genRandomSalt, untypedToTypedArray, bufferToUntypedArray, stringToByteArray } = require("./lib");
const { subtle } = require('crypto').webcrypto;
const crypto = require('crypto');

/********* Implementation ********/
class Keychain {

  data = {}; // mang cac object voi key la String(hash(tenmien)), value = [String(iv),String(encrypt(matkhau))]:
  secrets = {};
  /**
   * Initializes the keychain using the provided information. Note that external
   * users should likely never invoke the constructor directly and instead use
   * either Keychain.init or Keychain.load. 
   * Arguments:
   *  You may design the constructor with any parameters you would like. 
   * Return Type: void
   */


  constructor(macKeyParam, aesKeyParam,saltParam) {
    
    this.data.kvs = [];
    
    this.secrets = {
      macKey: macKeyParam,
      aesKey: aesKeyParam,
      salt: saltParam // buffer = byte array
      /* Store member variables that you intend to be private here
         (information that an adversary shoulbyteArrayToString(encryptName);d NOT see). */
    };
    
    this.data.version = "CS 255 Password Manager v1.0";
    // Flag to indicate whether password manager is "ready" or not
    this.ready = true;
  };

  

  /** 
    * Creates an empty keychain with the given password. Once the constructor
    * has finished, the password manager should be in a ready state.
    *
    * Arguments:
    *   password: string
    * Return Type: void
    */
  static async init(password) {
    const salt = stringToByteArray("caubevang02_aNgong582@@");
    const buffer     = stringToByteArray(password);
    const key        = await subtle.importKey('raw', buffer, {name: 'PBKDF2'}, false, ['deriveKey']);
    const aesKey = await subtle.deriveKey({name: 'PBKDF2', hash: {name: 'SHA-256'}, iterations: Keychain.PBKDF2_ITERATIONS , salt: salt}, key, {name: 'AES-GCM', length: 256}, true, ['encrypt', 'decrypt']);
    const macKey = await subtle.deriveKey({name: 'PBKDF2', hash: {name: 'SHA-256'}, iterations: Keychain.PBKDF2_ITERATIONS , salt: salt}, key, {name: 'HMAC', hash: 'SHA-256',length: 256}, false, ['sign','verify']);
    Keychain.aesKey = aesKey;
    return new Keychain(macKey,aesKey,salt);
  }

  /**thí
    *   trustedDataCheck: string
    * Return Type: Keychain
    */
  static async load(password, repr, trustedDataCheck) {
     
      if(byteArrayToString(await subtle.digest("SHA-256",stringToByteArray(repr))) != trustedDataCheck) {
        throw new Error("can not trust the representing");
      }

      const buffer     = stringToByteArray(password);
      const key        = await subtle.importKey('raw', buffer, {name: 'PBKDF2'}, false, ['deriveKey']);
      let temp = await subtle.deriveKey({name: 'PBKDF2', hash: {name: 'SHA-256'}, iterations: Keychain.PBKDF2_ITERATIONS , salt: stringToByteArray("caubevang02_aNgong582@@") }, key, {name: 'AES-GCM', length: 256}, true, ['encrypt', 'decrypt']);
      
      // const rawKeyExported1 = await subtle.exportKey("raw",Keychain.aesKey);
      // const rawKeyExported2 = await subtle.exportKey("raw",temp);

      

      // if( new Uint8Array(rawKeyExported1) != new Uint8Array(rawKeyExported1)) {throw new Error("wrong password");}
      

      //return json (string) value
      
      // console.log(this.data.kvs);
      // return JSON.parse(this.data.kvs);
  };

  /**
    * Returns a JSON serialization of the contents of the keychain that can be 
    * loaded back using the load function. The return value should consist of
    * an array of two strings:
    *   arr[0] = JSON encoding of password manager
    *   arr[1] = SHA-256 checksum (as a string)
    * As discussed in the handout, the first element of the array should contain
    * all of the data in the password manager. The second element is a SHA-256
    * checksum computed over the password manager to preserve integrity. If the
    * password manager is not in a ready-state, return null.it('can set and retrieve multiple passwords', async function() {
    //            *
    * Return Type: array
    */ 
  async dump() {
    if(!this.ready) return null;
    let res = [];
    res[0] = JSON.stringify(this.data);
    let temp =  await subtle.digest("SHA-256",stringToByteArray(res[0]));
    let arrTemp = new Uint8Array(temp);
    res[1] = byteArrayToString(arrTemp);
    return res;
  };

  /**
    * Fetches the data (as a string) corresponding to the given domain from the KVS.
    * If there is no entry in the KVS that matches the given domain, then return
    * null. If the password manager is not in a ready state, throw an exception. If
    * tampering has been detected with the records, throw an exception.
    *
    * Arguments:
    *   name: string
    * Return Type: Promise<string>
    */
  async get(name) {
    if(!this.ready) throw new Error("Keychain not initialized");
    let encryptName = await subtle.sign("HMAC", this.secrets.macKey, stringToByteArray(name));
    let enameByte = new Uint8Array(encryptName);
    let nameStore = byteArrayToString(enameByte);
    let i = 0;
    let tempKvs = this.data.kvs;
    for(i=0; i<tempKvs.length; i++){
        if(tempKvs[i].hasOwnProperty(nameStore)){
          let iv = tempKvs[i][nameStore][0];
          let data = tempKvs[i][nameStore][1];
          const rawKeyExported = await subtle.exportKey("raw",this.secrets.aesKey);

          // console.log("key to decrypt:",rawKeyExported);
          // console.log("iv to decrypt: ",iv);
          // console.log("data to decrypt:", data);

          
          let dataDecrypt = await subtle.decrypt({ name: "AES-GCM", iv: iv }, this.secrets.aesKey, data);
          let arrTemp = new Uint8Array(dataDecrypt);
          let res = byteArrayToString(arrTemp);
          return res;
        }
    }
    return null;
  };

  /** 
  * Inserts the domain and associated data into the KVS. If the domain is
  * already in the password manager, this method should update its value. If
  * not, create a new entry in the password manager. If the password manager is
  * not in a ready state, throw an exception.
  *
  * Arguments:
  *   name: string
  *   value: string
  * Return Type: void
  */
  async set(name, value) {

    if(!this.ready) throw new Error("not initialized");

    //get the hash of name and the ecrytpion of value
    let encryptedName = await subtle.sign("HMAC", this.secrets.macKey,stringToByteArray(name));


    let iv = crypto.getRandomValues(new Uint8Array(12));

    const rawKeyExported = await subtle.exportKey("raw",this.secrets.aesKey);
    // console.log("name and value to encrypt: ", name, value);
    // console.log("key to encrypt: ", rawKeyExported );
    // console.log("iv to encrypt: ", iv);
    

    let encryptedValue = await subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      this.secrets.aesKey,
      stringToByteArray(value)
    );

    let enameByte = new Uint8Array(encryptedName);
    let evalueByte = new Uint8Array(encryptedValue);
    let nameStore = byteArrayToString(enameByte);

  
    //push to kvs
    let kvsTemp = this.data["kvs"];
    let i = 0;
    for(i=0; i<kvsTemp.length; i++){
        if(kvsTemp[i].hasOwnProperty(nameStore)){
            kvsTemp[i][nameStore] = [iv,evalueByte];
            break;
        }
    }
    if(i==kvsTemp.length){
      kvsTemp.push({
       [nameStore] : [iv,evalueByte]
      });
    }

    // console.log( stringToByteArray(valueStore));
    
    // console.log(kvsTemp);

  }

  /**
    * Removes the record with name from the password manager. Returns true
    * if the record with the specified name is removed, false otherwise. If
    * the password manager is not in a ready state, throws an exception.
    *
    * Arguments:
    *   name: string
    * Return Type: Promise<boolean>
  */
  async remove(name) {
      if(!this.ready) throw new Error("Keychain not initialized.");
      let encryptName = await subtle.sign("HMAC", this.secrets.macKey, new TextEncoder().encode(name));
      encryptName = byteArrayToString(encryptName);
      let i = 0;
      let tempKvs = this.data.kvs;
      for(i=0; i<tempKvs.length; i++){
        if(tempKvs[i].hasOwnProperty(encryptName)){
          tempKvs.splice(i,1);
          return true;
        }
    }
    return false;
      
  }

  static get PBKDF2_ITERATIONS() { return 100000; }
};

module.exports = {
  Keychain: Keychain
}
