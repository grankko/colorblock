class DetailsViewModel {
    constructor(context) {
        this.context = context;
        this.onPixelBought = null;

        this.ownerTextBox = document.getElementById('ownerTextBox');
        this.pixelColorTextBox = document.getElementById('pixelColorTextBox');
        this.buyButton = document.getElementById('buyPixelButton');        
    }

    initView() {
        var me = this;
        
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
                    var newColor = me.pixelColorTextBox.value.replace("#", "0x");

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

    pixelSelected(owner, color, cellIndex) {
        this.ownerTextBox.value = owner;
        this.pixelColorTextBox.value = color;
        this.buyButton.dataset.pixelIndex = cellIndex;
    }
}

export { DetailsViewModel };