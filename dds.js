const ipaddr = require("ipaddr.js");
const dgram = require('dgram');

let addressPrefix = [0xFF, 0x12, 0, 0, 0, 0, 0, 0, 0, 0, 0xDD, 0x88];

let portNumber = 2657;

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

function useEntry(name, callback) {

    let address = keyToAddress(name);

    let socket = dgram.createSocket({type:'udp6', reuseAddr: true, ipv6Only: true });

    socket.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        socket.close();
    });

    socket.on('message', (msg, rinfo) => {
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        callback(1, {});
    });

    socket.bind(portNumber, () => {
        console.log('Listening');
        socket.addMembership(addressToString(address));

    });

}

function createEntry({ name, getValue, getMetadata }) {

    let address = keyToAddress(name);

    let socket = dgram.createSocket('udp6');

    socket.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        socket.close();
    });

    socket.on('message', (msg, rinfo) => {
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    });

    socket.send(Buffer.from('test'), portNumber, addressToString(address), (err) => {
        if (err) {
            console.error('send error:', err);
        }
        socket.close();
    });

}


module.exports = { addressBase: addressPrefix, hashString, keyToAddress, addressToString, useEntry, createEntry }
