//this is the setup that will use to test the token;
const Token = artifacts.require("MyToken.sol");


const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;
//require("dotenv").config({path:"./.env"});

//inside this we will write token;
contract("Token Test", async (accounts) => {
    const [deployerAccount, Receipient, otherAccount] = accounts;

    beforeEach(async() => {
        this.myToken = await Token.new(1000000);
    })

    it("all tokens should be in my account", async () => {

        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        //console.log(totalSupply);
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    })

    it("is possible to send tokens between accounts", async () => {
        const sendTokens = 1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(Receipient,sendTokens)).to.eventually.be.fulfilled;
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));//typecast so a bigNumber is subtracting a big no
        return await expect(instance.balanceOf(Receipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    })

    it("is not possible to send tokens greater than the balance",async ()=>{
         
        let instance = this.myToken;
        let balance = await instance.balanceOf(deployerAccount);

        await expect(instance.transfer(Receipient,new BN(balance+1))).to.eventually.be.rejected;
        return await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balance);
    })
});
