var colorBlockContract = artifacts.require("ColorBlock");

module.exports = function(deployer) {
    deployer.deploy(colorBlockContract);
}