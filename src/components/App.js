import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar'
import Main from './Main'
import Betting from '../abis/Betting.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if(window.etherum) {
      window.web3 = new Web3(window.etherum)
      await window.etherum.enable()
    } else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Etherum browser, use meta mask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({account : accounts[0]})
    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    const networkData = Betting.networks[networkId]
    if(networkData) {
      const betting = web3.eth.Contract(Betting.abi, networkData.address)
      this.setState({betting})
      
    } else {
      window.alert("no contract deployed")
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account : '',
      socialNetwork : null,
      postCount : 0,
      posts : [],
      loading : true
    }
  }

  render() {
    return (
      <div>
      <Navbar account={this.state.account}/>
      {this.state.loading ? <div id="loader"> className="text-center mt-5"><p>Loading..</p></div>
        : <Main posts={this.state.posts}/>
      }
      
        
      </div>
    );
  }
}

export default App;
