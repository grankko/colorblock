pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ColorBlock.sol";

contract TestColorBlock {
    ColorBlock colorBlock = ColorBlock(DeployedAddresses.ColorBlock());

    function testUserCanAssignPixel() public {
        bytes3 firstColor = hex"ffffff";
        bytes3 secondColor = hex"ff0000";

        colorBlock.assignPixel(0, firstColor);
        colorBlock.assignPixel(1, secondColor);
    }

    function testUserGetAllPixels() public {
        (uint[] memory pixelIndex, address[] memory owners, bytes3[] memory colors) = colorBlock.getPixels();

        uint ownedByTestContract = 0;
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == address(this)) {
                ownedByTestContract++;
            }
            Assert.equal(pixelIndex[i], i, "pixelIndex should match array indexer");
        }


        Assert.equal(ownedByTestContract, 2, "Contract should own 2 pixels");
    }
}