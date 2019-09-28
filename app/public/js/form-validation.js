// Example starter JavaScript for disabling form submissions if there are invalid fields
/* eslint-disable */
(function () {
  'use strict'

  // eslint-disable-next-line no-undef
  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation')

    // Loop over them and prevent submission
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
          // return;
        } else {
          var address = $('#address')[0].value;
          var symbol = $('#tokenSymbol')[0].value;
          var memo = $('#transferMemo')[0].value;

          $.post('/api/token/apply', {
            address: address,
            symbol: symbol,
            memo: memo
          },
          function (data, status) {
            console.log(data, status);
            if (data.code === 0) {
              var htmlTemp = '';
              for (var i = 0, len = data.data.length; i < len; i++) {
                var dataTemp = data.data[i];
                htmlTemp += '<div><b>ChainID:</b> </div>' + dataTemp.chainId;
                htmlTemp += '<div><b>Symbol:</b> </div>' + dataTemp.symbol;
                htmlTemp += '<div><b>Transaction ID:</b> </div>' + dataTemp.txId;
                htmlTemp += '<div> &nbsp; </div>';
              }
              $('#applyResult').html(htmlTemp);
            } else {
              alert(data.msg);
            }
          });
        }
        form.classList.add('was-validated')

        event.preventDefault()
        event.stopPropagation()
      }, false)
    })

    $('#getWallet').click(function () {
      var wallet = window.AElf.wallet.createNewWallet();
      $("#mnemonic").html('<div>mnemonic: </div>' + wallet.mnemonic);
      $("#privateKey").html('<div>privateKey: </div>' + wallet.privateKey);
      $("#walletAddress").html('<div>address: </div>' + wallet.address);
      $("#BIP44Path").html('<div>BIP44Path: </div>' + wallet.BIP44Path);
    });

  }, false);
}());