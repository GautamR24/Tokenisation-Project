var MyToken = artifacts.require("MyToken");

var MyTokenSale = artifacts.require("MyTokenSale");

var MyKycContract = artifacts.require("KycContract");

//require("dotenv").config({path:"./.env"});

module.exports = async function(deployer){
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(MyToken,1000000);//total supply tokens in total
    await deployer.deploy(MyKycContract);
    await deployer.deploy(MyTokenSale,1,addr[0],MyToken.address, MyKycContract.address);/*wallet address which gets money*//*token address*/
    let instance = await MyToken.deployed(); 
    await instance.transfer(MyTokenSale.address,1000000); //sending all the tokens to MyTokenSale contract;
}