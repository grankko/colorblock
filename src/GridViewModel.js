class GridViewModel {
    constructor(context) {
        this.context = context;
        this.onPixelSelected = null;
        this.rowCount = null;

        this.colorGridContainer = document.getElementById('colorgridContainer');
    }

    drawPixels() {
        var colorBlockInstance;
        var me = this;
    
        // Call contract to get pixel from chain
        this.context.contracts.ColorBlock.deployed().then(function(instance) {
            colorBlockInstance = instance;
            return colorBlockInstance.getPixels.call();
        }).then(function(pixels) {
            
            // Calculate size of the grid
            me.rowCount = Math.sqrt(pixels[0].length);
            me.colorGridContainer.style.setProperty('--grid-rows', me.rowCount);
            me.colorGridContainer.style.setProperty('--grid-cols', me.rowCount);
            me.colorGridContainer.innerHTML = '';            
  
            // Render grid
            for (var i = 0; i < pixels[0].length; i++) {
                let pixelIndex = web3.utils.BN(pixels[0][i]).toNumber();
                let owner = pixels[1][i];
                let color = pixels[2][i];
                color = '#' + color.substr(2,6); // Convert to color format
  
                let cell = document.createElement("div");
                cell.style.setProperty('background-color', color);
                cell.dataset.owner = owner;
                cell.dataset.pixelIndex = pixelIndex;
                cell.dataset.color = color;
                cell.addEventListener("click", me.pixelClicked.bind(me));

                me.colorGridContainer.appendChild(cell).className = "cell";
            }
        }).catch(function(err) {
            console.log(err.message);
        });
    }

    pixelClicked(event) {
        event.preventDefault();
  
        let cellIndex = event.target.dataset.pixelIndex;
        let color = event.target.dataset.color;
        let owner = event.target.dataset.owner;

        let x = (cellIndex % this.rowCount) +1;
        let y = Math.floor(cellIndex / this.rowCount) +1;

        this.onPixelSelected(owner, color, cellIndex, x, y);
    }
}

export { GridViewModel };
