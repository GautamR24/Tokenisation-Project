pragma solidity 0.6.1;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract KycContract is Ownable{
    mapping(address => bool) allowed;

    function setKyc(address _add) public onlyOwner{
        allowed[_add] = true;
    }

    function Kycrevoke(address _add) public onlyOwner{
        allowed[_add] = false;
    }
    
    function KycCompleted(address _add) public view returns(bool){
        return allowed[_add];
    }
}