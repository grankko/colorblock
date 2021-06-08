import Web3 from 'web3';
import TruffleContract from '@truffle/contract';

// todo: make work, then refactor out in classes
class App {
  constructor() {
    this.web3Provider = null;
    this.contracts = {};
  }
  
    async init() {
      return await this.initWeb3();
    }
  
    async initWeb3() {
      if (window.ethereum) {
        this.web3Provider = window.ethereum;
        try {
          await window.ethereum.enable();
        } catch (error) {
          console.error("User denied account access");
        }
      } else if (window.web3) {
        this.web3Provider = window.web3.currentProvider;
      } else {
        this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(this.web3Provider);
      this.initBuyButton();
      return this.initContract();
    }

    initBuyButton() {
      var buyButton = document.getElementById('buyPixelButton');
      var me = this;
      buyButton.addEventListener("click", function(event) {
        event.preventDefault();

        buyButton.disabled = true;

        var colorBlockInstance;
        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }
          var account = accounts[0];
          me.contracts.ColorBlock.deployed().then(function(instance) {
            colorBlockInstance = instance;
            var newColor = document.getElementById('pixelColorTextBox').value.replace("#", "0x");
            return colorBlockInstance.assignPixel(buyButton.dataset.pixelIndex, newColor, {from: account});
          }).then(function(result) {
            me.drawPixels();
            buyButton.disabled = false;
            console.log(result);
          }).catch(function(err) {
            buyButton.disabled = false;
            console.log(err.message);
          });
        })
      });
    }
  
    initContract() {
      fetch('ColorBlock.json').then(res => res.json()).then(data => {
        var ColorBlockArtifact = data;
        this.contracts.ColorBlock = TruffleContract(ColorBlockArtifact);
        this.contracts.ColorBlock.setProvider(this.web3Provider);
  
        return this.drawPixels();
      });
    }

    drawPixels() {
      var colorBlockInstance;
  
      this.contracts.ColorBlock.deployed().then(function(instance) {
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

            var cellIndex = event.target.dataset.pixelIndex;
            var color = event.target.dataset.color;
            var owner = cell.dataset.owner;

            document.getElementById('ownerTextBox').value = owner;
            document.getElementById('pixelColorTextBox').value = color;
            var buyButton = document.getElementById('buyPixelButton');
            buyButton.dataset.pixelIndex = cellIndex;
          });
          container.appendChild(cell).className = "cell";
        }

      }).catch(function(err) {
        console.log(err.message);
      });
    }
}

document.addEventListener('DOMContentLoaded', function () { 
  var app = new App();
  app.init();
});