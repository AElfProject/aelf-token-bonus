// Example starter JavaScript for disabling form submissions if there are invalid fields
/* eslint-disable */
(function () {
  'use strict'

  var websiteList = {
    'AELF': 'https://explorer-test.aelf.io',
    'TELF': 'https://explorer-test.aelf.io',
    '2112': 'https://explorer-test-side01.aelf.io',
    '2113': 'https://explorer-test-side02.aelf.io',
  };

  var csrfToken = document.cookie && document.cookie.match(/csrfToken=[^;]*/)[0].replace('csrfToken=', '');

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
          // var symbol = $('#tokenSymbol')[0].value;
          var memo = $('#transferMemo')[0].value;

          $.ajax({
            type: 'POST',
            url: '/api/token/apply',
            data: {
              address: address,
              memo: memo
            },
            headers: {
              'x-csrf-token': csrfToken
            },
            // dataType: dataType,
            success: function (data, status) {
              console.log(data, status);
              if (+data.code === 0) {
                var htmlTemp = '';
                // https://explorer-test.aelf.io/tx/8388b68fff49ae58dff7ea524ea96c93538782613120e25d20bae85e69279871
                for (var i = 0, len = data.data.length; i < len; i++) {
                  var dataTemp = data.data[i];
                  var linkTemp = websiteList[dataTemp.chainId] + '/tx/' + dataTemp.txId
                  htmlTemp += '<div><b>ChainID:</b> </div>' + dataTemp.chainId;
                  htmlTemp += '<div><b>Symbol:</b> </div>' + dataTemp.symbol;
                  htmlTemp += '<div><b>Transaction ID:</b> </div>' + dataTemp.txId;
                  htmlTemp += '<div><b>Explorer:</b> </div>';
                  htmlTemp += '<div><a href="' + linkTemp + '" target="_blank">' + linkTemp + '</a></div>';
                  htmlTemp += '<div> &nbsp; </div>';
                }
                $('#applyResult').html(htmlTemp);
                $('#resultContainer').show();
              } else {
                alert(data.msg);
              }
            }
          });
        }
        form.classList.add('was-validated');

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
      $('#walletContainer').show();
    });

  }, false);
}());
