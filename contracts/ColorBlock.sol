pragma solidity ^0.5.0;

contract ColorBlock {

    struct Pixel {
        address Owner;
        bytes3 Color;
    }

    // todo: doesn't scale, larger grid nukes everything. Relying on events to log seems like a bad idea?
    uint constant gridSize = 5*5;
    Pixel[gridSize] public pixels;

    function assignPixel(uint pixelIndex, bytes3 color) public {
        require(pixelIndex >= 0 && pixelIndex <= gridSize);

        pixels[pixelIndex] = Pixel({Owner: msg.sender, Color: color});
    }

    function getPixels()
        public view
        returns (uint[] memory, address[] memory, bytes3[] memory)
    {

        // can't return struct? flatten object
        uint[] memory statePixelIndex = new uint[](gridSize);
        address[] memory stateOwners = new address[](gridSize);
        bytes3[] memory stateColors = new bytes3[](gridSize);
        
        uint index = 0;

        for (uint i = 0; i < pixels.length; i++) {
            Pixel storage pixel = pixels[i];
            statePixelIndex[i] = i;
            stateOwners[i] = pixel.Owner;
            stateColors[index] = pixel.Color;
            
            index++;
        }
        
        return (statePixelIndex, stateOwners, stateColors);
    }
}