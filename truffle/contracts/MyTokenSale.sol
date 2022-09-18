pragma solidity 0.6.1;

import "./Crowdsale.sol";
import "./KycContract.sol";
contract MyTokenSale is Crowdsale {

    KycContract kyc;
    constructor(
        uint256 rate,    // in how many wei we can purchase the token
        address payable wallet, //send money to this wallet for purchasing
        IERC20 token, //this token get transferred to the customer who bought it and sent money to the wallet
        KycContract _kyc
    )
        //MintedCrowdsale()
        Crowdsale(rate, wallet, token)
        public
    {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override{
        super._preValidatePurchase(beneficiary,weiAmount);//calling base contract function.
        require(kyc.KycCompleted(msg.sender),"Kyc not completed, purchase not allowed");        
    }
}