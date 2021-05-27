const Betting = artifacts.require('./Betting.sol')

require('chai').use(require('chai-as-promised')).should()


contract('Betting', ([deployer, teamA, teamB]) => {
	let betting

	before(async() => {
		betting = await Betting.deployed()
	})

	describe('deployment', async () => {
		it('deploys successfully', async () => {
			const address = await Betting.address
			assert.notEqual(address, '')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)
		})
	})

	describe('bet', async () => {

		let result, totalBets

		it('betting on teamA', async () => {
			
			result = await betting.bet(1, { from: teamA, value : web3.utils.toWei('1', 'Ether')})
			totalBets = await betting.AmountOne()
			const event = result.logs[0].args
			assert.equal(event.teamSelected.toNumber(), 1, 'team is correct')
			assert.equal(event.amountBet, '1000000000000000000', 'amount is correct')
			assert.equal(totalBets, '1000000000000000000', 'totalBetsOne is correct')
		})

		it('betting on teamB', async () => {
			
			result = await betting.bet(2, { from: teamB, value : web3.utils.toWei('1', 'Ether')})
			totalBets = await betting.AmountTwo()
			const event = result.logs[0].args
			assert.equal(event.teamSelected.toNumber(), 2, 'team is correct')
			assert.equal(event.amountBet, '1000000000000000000', 'amount is correct')
			assert.equal(totalBets, '1000000000000000000', 'totalBetsTwo is correct')
			await betting.bet(2, { from: teamB, value : web3.utils.toWei('1', 'Ether')}).should.be.rejected
		})


		it('distribute the prize', async () => {

			let oldPlayer2Balance
			oldPlayer2Balance = await web3.eth.getBalance(teamB)
	 		oldPlayer2Balance = new web3.utils.BN(oldPlayer2Balance)

	 		result = await betting.finaliseWinners(2)

	 		let newPlayer2Balance
	 		newPlayer2Balance = await web3.eth.getBalance(teamB)
	 		newPlayer2Balance = new web3.utils.BN(newPlayer2Balance)
	 		console.log(oldPlayer2Balance.toString())
	 		console.log(newPlayer2Balance.toString())
	 		
			
		})

		
	})

})