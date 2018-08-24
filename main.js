const XAdES = require("xadesjs");

function getXml() {
  return document.getElementById("xml1").value;
}

function generateKey(alg) {
  return crypto.subtle.generateKey(alg, false, ["sign", "verify"])
}

function exportKey(key) {
  return crypto.subtle.exportKey("jwk", key)
}

function error(e) {
  alert(e.message);
  console.error(e);
}

function sign() {
  // var transforms = [];
  // if (isEnveloped())
  //     transforms.push("enveloped");
  // transforms.push(getCanonMethod());
  // console.log(transforms);

  // var alg = getAlgorithm();
  var keys, signature, res = {};
  Promise.resolve()
    .then(function () {
      return generateKey({
        name: "ECDSA",
        namedCurve: "P-256",
        modulusLength: 1024,
        publicExponent: new Uint8Array([1, 0, 1]),
      });
    })
    .then(function (ks) {
      keys = ks;
      return exportKey(ks.publicKey)
    })
    .then(function (jwk) {
      res.jwk = jwk;
    })
    .then(function () {
      signature = new XAdES.SignedXml();

      return signature.Sign(                  // Signing document
        { name: "ECDSA", hash: { name: "SHA-1" } },                                    // algorithm
        keys.privateKey,                        // key
        XAdES.Parse(getXml()),                  // document
        {                                       // options
          keyValue: keys.publicKey,
          references: [
            { hash: "SHA-256", transforms: ["enveloped"] }
          ],
          productionPlace: {
            country: "Country",
            state: "State",
            city: "City",
            code: "Code",
          },
          signerRoles: {
            claimed: ["Some role"]
          }
        })
    })
    .then(function () {
      var sig = signature.toString()
      res.signature = sig;

      //document.getElementById("jwk").value = JSON.stringify(res.jwk);
      //document.getElementById("signature").value = res.signature;
      console.log(res.signature);
    })
    .catch(function (e) {
      console.error(e);
    });

}