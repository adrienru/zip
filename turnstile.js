// turnstile.js

window.onloadTurnstileCallback = function () {
  turnstile.render("#example-container", {
    sitekey: "0x4AAAAAABE79aVbG0qQSWTT,
    callback: function (token) {
      console.log(`Challenge Success ${token}`);
      // Aquí puedes enviar el token al servidor para validarlo
    },
    errorCallback: function (error) {
      console.log("Error en el desafío de Turnstile:", error);
    }
  });
};
