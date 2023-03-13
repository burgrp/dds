const ipaddr = require("ipaddr.js");

// Maps key hash to socket
let sockets = {};

let addressPrefix = [0xFF, 0x12, 0, 0, 0, 0, 0, 0, 0, 0, 0xDD, 0x88];

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash &= 0xFFFFFFFF; // Convert to 32bit integer
    }
    return hash;
}

// Calculates IPv6 multicast address for the given key.
function keyToAddress(key) {
    let hash = hashString(key);
    let address = [...addressPrefix, (hash >> 24) & 0xFF, (hash >> 16) & 0xFF, (hash >> 8) & 0xFF, hash & 0xFF];
    return address;
}

function addressToString(address) {
    let ip = ipaddr.fromByteArray(address);
    return ip.toString().toUpperCase();
}

function useRegister(name, callback) {
    callback(1, {});
}

function provideRegister({ name, getValue, getMetadata }) {

}


module.exports = { addressBase: addressPrefix, hashString, keyToAddress, addressToString, useRegister, provideRegister }
