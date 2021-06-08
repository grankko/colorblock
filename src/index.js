// todo: make work, then refactor out in classes
App = {
    web3Provider: null,
    contracts: {},
  
    init: async function() {
      return await App.initWeb3();
    },
  
    initWeb3: async function() {
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
          await window.ethereum.enable();
        } catch (error) {
          console.error("User denied account access");
        }
      } else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
      } else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(App.web3Provider);
      App.initBuyButton();
      return App.initContract();
    },

    initBuyButton: function() {
      var buyButton = document.getElementById('buyPixelButton');
      buyButton.addEventListener("click", function(event) {
        event.preventDefault();

        buyButton.disabled = true;

        var colorBlockInstance;
        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }
          var account = accounts[0];
          App.contracts.ColorBlock.deployed().then(function(instance) {
            colorBlockInstance = instance;
            var newColor = document.getElementById('pixelColorTextBox').value.replace("#", "0x");
            return colorBlockInstance.assignPixel(buyButton.dataset.pixelIndex, newColor, {from: account});
          }).then(function(result) {
            App.drawPixels();
            buyButton.disabled = false;
            console.log(result);
          }).catch(function(err) {
            buyButton.disabled = false;
            console.log(err.message);
          });
        })
      });
    },
  
    initContract: function() {
      $.getJSON('ColorBlock.json', function(data) {
        var ColorBlockArtifact = data;
        App.contracts.ColorBlock = TruffleContract(ColorBlockArtifact);
        App.contracts.ColorBlock.setProvider(App.web3Provider);
  
        return App.drawPixels();
      });
    },

    drawPixels: function() {
      var colorBlockInstance;
  
      App.contracts.ColorBlock.deployed().then(function(instance) {
        colorBlockInstance = instance;
        return colorBlockInstance.getPixels.call();
      }).then(function(pixels) {
        
        let rows = Math.sqrt(pixels[0].length);
        let container = document.getElementById('colorgridContainer');
        container.innerHTML = '';
        container.style.setProperty('--grid-rows', rows);
        container.style.setProperty('--grid-cols', rows);

        for (var i = 0; i < pixels[0].length; i++) {
          let pixelIndex = web3.utils.BN(pixels[0][i]).toNumber();
          let owner = pixels[1][i];
          let color = pixels[2][i];
          color = '#' + color.substr(2,6);

          let cell = document.createElement("div");
          cell.style.setProperty('background-color', color);
          cell.dataset.owner = owner;
          cell.dataset.pixelIndex = pixelIndex;
          cell.dataset.color = color;
          cell.addEventListener("click", function(event) {
            event.preventDefault();

            var cellIndex = parseInt($(event.target).data('pixelIndex'));
            var color = event.target.dataset.color;
            var owner = cell.dataset.owner;

            document.getElementById('ownerTextBox').value = owner;
            document.getElementById('pixelColorTextBox').value = color;
            var buyButton = document.getElementById('buyPixelButton');
            buyButton.dataset.pixelIndex = pixelIndex;
          });
          container.appendChild(cell).className = "cell";
        }

      }).catch(function(err) {
        console.log(err.message);
      });
    }
}

  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  