class DetailsViewModel {
    constructor(context) {
        this.context = context;
        this.onPixelBought = null;

        this.ownerLink = document.getElementById('ownerLink');
        this.pixelColorPicker = document.getElementById('pixelColorPicker');
        this.buyButton = document.getElementById('buyPixelButton');
        this.bottomPanel = document.getElementById('bottomPanel');

        this.selectedX = document.getElementById('selectedX');
        this.selectedY = document.getElementById('selectedY');
    }

    initView() {
        var me = this;
        this.bottomPanel.style.visibility = 'collapse';

        me.buyButton.addEventListener("click", function(event) {
            event.preventDefault();
      
            me.buyButton.disabled = true;
      
            var colorBlockInstance;
            web3.eth.getAccounts(function(error, accounts) {
                if (error) {
                    console.log(error);
                }
                var account = accounts[0];

                me.context.contracts.ColorBlock.deployed().then(function(instance) {
                    colorBlockInstance = instance;
                    var newColor = me.pixelColorPicker.value.replace("#", "0x");

                    // Call contract
                    return colorBlockInstance.assignPixel(me.buyButton.dataset.pixelIndex, newColor, {from: account});
                }).then(function(result) {
                    // Notify other views that a pixel has changed
                    me.onPixelBought();

                    me.buyButton.disabled = false;
                    console.log(result);
                }).catch(function(err) {
                    me.buyButton.disabled = false;
                    console.log(err.message);
                });
            })
        });
    }

    pixelSelected(owner, color, cellIndex, x, y) {

        this.selectedX.innerText = 'X: ' + x;
        this.selectedY.innerText = 'Y: ' + y;

        this.bottomPanel.style.visibility = 'visible';

        this.ownerLink.innerText = owner;
        this.ownerLink.href = 'https://etherscan.io/address/' + owner;
        this.pixelColorPicker.value = color;
        this.buyButton.dataset.pixelIndex = cellIndex;
    }
}

export { DetailsViewModel };