import Web3 from 'web3';
import TruffleContract from '@truffle/contract';

class Context {
    constructor(postInit) {
      this.web3Provider = null;
      this.contracts = {};
      this.postInit = postInit;
  
      this.init();
    }
  
    async init() {
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
  
      return this.initContract();
    }
  
    initContract() {
      fetch('ColorBlock.json').then(res => res.json()).then(data => {
        var ColorBlockArtifact = data;
        this.contracts.ColorBlock = TruffleContract(ColorBlockArtifact);
        this.contracts.ColorBlock.setProvider(this.web3Provider);
  
        this.postInit();
      });
    }
  }

  export { Context };