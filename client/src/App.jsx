import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
//import getWeb3 from "web3";
import Web3 from "web3";

import "./App.css";

class App extends Component {
    state = { loaded:false , kycAddress:"0x1234...", tokenAddress: null,userTokens:null};
    componentDidMount = async () => {
        try {

            // Get network provider and web3 instance.
            // this.web3 = await getWeb3();
            this.web3 = new Web3(Web3.givenProvider);

            // Use web3 to get the user's accounts.
            this.accounts = await this.web3.eth.getAccounts();
            // Get the contract instance.
            this.networkId = await this.web3.eth.net.getId();
            console.log(this.networkId);

            // this.itemManager = new this.web3.eth.Contract(
            //     ItemManager.abi,
            //     ItemManager.networks[this.networkId] && ItemManager.networks[this.networkId].address,
            // );

            this.tokenInstance = new this.web3.eth.Contract(MyToken.abi,MyToken.networks[this.networkId].address,MyToken.networks[this.networkId]/*MyToken.networks[this.networkId].address*/);
            this.tokenSaleInstance = new this.web3.eth.Contract(MyTokenSale.abi,MyTokenSale.networks[this.networkId].address,MyTokenSale.networks[this.networkId]/*MyTokenSale.networks[this.networkId].address*/);
            this.kycInstance = new this.web3.eth.Contract(KycContract.abi,KycContract.networks[this.networkId].address,KycContract.networks[this.networkId]/*KycContract.networks[this.networkId].address*/);
            
            
            // this.item = new this.web3.eth.Contract(
            //     Item.abi,
            //     Item.networks[this.networkId] && Item.networks[this.networkId].address,
            // );

            // this.listenToPaymentEvent();
            
            // this.listenTokenTransfer();
            console.log("listening2");
            let bal = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
            console.log("bal is "+bal);
            this.setState({ loaded: true, tokenAddress:MyTokenSale.networks[this.networkId].address, userTokens:bal });
            console.log(this.state.tokenAddress);
            //console.log(this.state['loaded']);
            console.log("returned "+this.state.userTokens);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`
            );
            console.error(error);
        }
    };

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked:target.value;
        const name = target.name;
        this.setState({
            [name] : value
        })
        console.log(`input done`);
    }

    handleKycWhitelisting = async () => {
        await this.kycInstance.methods.setKyc(this.state.kycAddress).send({from: this.accounts[0]});
        alert("KYC for"+this.state.kycAddress+"is completed");
        console.log(`white done`);
    }
    
    // listenTokenTransfer = async() =>{
    //     console.log("listening1");
    //     this.tokenInstance.events.Transfer({to:this.accounts[0]}).on("data",this.bal);
    // }

    handleBuyTokens = async() => {
        await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({from:this.accounts[0],value: this.web3.utils.toWei("1","wei")});
    }
    // updateUserTokens = async  () =>{
    //     console.log("reached  ");
    //     let usertokens = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    //     console.log(usertokens);
    //     //return usertokens;
    //     this.setState({userTokens: usertokens});
    // }
    render() {
      if (!this.state.loaded) {
          return <div>Loading Web3, accounts, and contract...</div>;
      }
      return (
          <div className="App">
             <h1 align = "center">GR Tokens</h1>
             <p align="center">Get your tokens today..!!</p>
             <h2 align="center">Kyc whitelisting</h2>
            <p align = 'center'>Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/></p>
            <button  type="button" onClick={this.handleKycWhitelisting}>Add the address to the whitelisting</button>
            <h2 align="center">Buy tokens by sending money to this address: {this.state.tokenAddress}</h2>
            <h2>You currently have: {this.state.userTokens} tokens</h2>
            <button type="button" onClick={this.handleBuyTokens}>Buy more tokens</button>
        </div>
      )
  }
  }
export default App;