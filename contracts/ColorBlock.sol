pragma solidity ^0.5.0;

contract ColorBlock {

    struct Pixel {
        address Owner;
        bytes3 Color;
    }

    // todo: doesn't scale, larger grid nukes everything. Relying on events to log seems like a bad idea?
    Pixel[5][5] public colors;

    function assignPixel(uint x, uint y, bytes3 color) public {
        require(x >= 0 && x <= 5);
        require(y >= 0 && y <= 5);

        colors[x][y] = Pixel({Owner: msg.sender, Color: color});
    }

    function getPixels()
        public view
        returns (uint[] memory, uint[] memory, address[] memory, bytes3[] memory)
    {

        uint[] memory storedX = new uint[](25);
        uint[] memory storedY = new uint[](25);
        address[] memory storedOwners = new address[](25);
        bytes3[] memory storedColors = new bytes3[](25);
        
        uint index = 0;

        for (uint x = 0; x < colors.length; x++) {
            for (uint y = 0; y < colors[x].length; y++) {
                Pixel storage pixel = colors[x][y];
                storedX[index] = x;
                storedY[index] = y;
                storedOwners[index] = pixel.Owner;
                storedColors[index] = pixel.Color;
                
                index++;                
            }
        }
        
        return (storedX, storedY, storedOwners, storedColors);
    }
}