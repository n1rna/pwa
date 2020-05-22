var CryptoJS = require('crypto-js');

const pack = (bytes) => {
  let str = [];
  let hex = bytes.toString().split(',');
  for (let i = 0; i < bytes.length; i++) {
    str.push(String.fromCharCode(hex[i]));
  }
  return str.join('');
};

const unpack = (str) => {
  let bytes = [];
  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
};

const blobToString = (b) => {
  var u, x;
  u = URL.createObjectURL(b);
  x = new XMLHttpRequest();
  x.open('GET', u, false);
  x.send();
  URL.revokeObjectURL(u);
  return x.responseText;
};

const decryptPrivateMap = (result, key) => {
  try {
    const blob = new Blob([result]);
    const data = blobToString(blob);

    const decodedKey = CryptoJS.enc.Base64.parse(key).toString();
    const decodedResult = CryptoJS.enc.Base64.parse(data);

    var iv = CryptoJS.enc.Hex.parse(pack(unpack(decodedKey).slice(0, 16)));
    var secret = CryptoJS.enc.Hex.parse(pack(unpack(decodedKey).slice(16, 48)));

    var decrypted = CryptoJS.TripleDES.decrypt(decodedResult, secret, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
    });
    return decrypted.toString();
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export { decryptPrivateMap };
