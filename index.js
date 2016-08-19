(function(){

  'use strict';

  var execute = document.getElementById('js-execute');

  execute.addEventListener('click', function() {
    var initializeVector = document.getElementById('js-initialize-vector');

    var encrypt = document.getElementById('js-encrypt'),
        decrypt = document.getElementById('js-decrypt');

    var resultEncrypt = document.getElementById('js-result-encrypt'),
        resultDecrypt = document.getElementById('js-result-decrypt');

    var iv = new Uint8Array(16),
        key;

    crypto.getRandomValues(iv);

    initializeVector.innerHTML = iv;

    Promise
      .resolve()
      .then(function() {
        return (crypto.webkitSubtle || crypto.subtle).generateKey({
          name: 'AES-CBC',
          length: 256
        }, true, ['encrypt', 'decrypt']);
      })
      .then(function(cryptoKey) {
        var value;

        key = cryptoKey;

        value = new TextEncoder('utf-8').encode(
          encrypt.value
        );

        return (crypto.webkitSubtle || crypto.subtle).encrypt({
          name: 'AES-CBC',
          iv: iv
        }, key, value);
      })
      .then(function(encrypted) {
        var hexValue = convertToHex(encrypted).join('');

        resultDecrypt.innerHTML = hexValue;
        decrypt.value = hexValue;

        return encrypted;
      })
      .then(function(encrypted) {
        return (crypto.webkitSubtle || crypto.subtle).decrypt({
          name: 'AES-CBC',
          iv: iv
        }, key, encrypted);
      })
      .then(function(decrypted) {
        var decoder = new TextDecoder('utf-8', {
          fatal: false,
          ignoreBOM: true
        });

        resultEncrypt.innerHTML = decoder.decode(
          new Uint8Array(decrypted)
        );
      })
      .catch(function(err) {
        console.error(err);
      });

  }, false);

  function convertToHex(buffer) {
    var results = [],
        view = new DataView(buffer),
        i, len, value, hexValue;

    for (i = 0, len = view.byteLength; i < len; i += 4) {
      value = view.getUint32(i).toString(16);
      hexValue = ('00000000' + value).slice(-8);

      results.push(hexValue);
    }

    return results;
  }

}());
