import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar'
import Main from './Main'
import SocialNetwork from '../abis/SocialNetwork.json'

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
    const networkData = SocialNetwork.networks[networkId]
    if(networkData) {
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({socialNetwork})
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({postCount})
      for(var i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          posts : [...this.state.posts, post]
        })
      }
      this.setState({loading : false})
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
