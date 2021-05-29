pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ColorBlock.sol";

contract TestColorBlock {
    ColorBlock colorBlock = ColorBlock(DeployedAddresses.ColorBlock());

    function testUserCanAssignPixel() public {
        bytes3 firstColor = hex"ffffff";
        bytes3 secondColor = hex"ff0000";

        colorBlock.assignPixel(0, 0, firstColor);
        colorBlock.assignPixel(0, 1, secondColor);
    }

    function testUserGetAllPixels() public {
        (uint[] memory x, uint[] memory y,address[]  memory owner, bytes3[] memory color) = colorBlock.getPixels();

        uint ownedByTestContract = 0;
        for (uint i = 0; i < owner.length; i++) {
            if (owner[i] == address(this)) {
                ownedByTestContract++;
            }
        }


        Assert.equal(ownedByTestContract, 2, "Contract should own 2 pixels");
    }
}