var solnSquareContract = artifacts.require('SolnSquareVerifier');
var verifierContract = artifacts.require('SquareVerifier');
var proof = require('../../zokrates/code/square/proof.json');

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const symbol = "DAV";
    const name = "DAV_Token";

    // Test if a new solution can be added for contract - SolnSquareVerifier
    describe('Test if a new solution can be added for contract - SolnSquareVerifier', function () {
        beforeEach(async function () {
            const verifier = await verifierContract.new({ from: account_one });
            this.contract = await solnSquareContract.new(verifier.address, name, symbol, { from: account_one });
        })

        it('add new solution', async function () {
            let canAdd = true;
            try {
                await this.contract.addSolution(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, account_two, 2, { from: account_two });
            } catch (e) {
                console.log(e)
                canAdd = false;
            }
            assert.equal(canAdd, true, "Solution cannot be added");
        });

        it('add repeat solution', async function () {
            let canAdd = true;
            await this.contract.addSolution(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, account_two, 2, { from: account_two });
            try {
                await this.contract.addSolution(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, account_two, 3, { from: account_two });
            } catch (e) {
                canAdd = false;
            }
            assert.equal(canAdd, false, "Repeated solution can be added");
        });

    });

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    describe('Test if an ERC721 token can be minted for contract - SolnSquareVerifier', function () {
        beforeEach(async function () {
            const verifier = await verifierContract.new({ from: account_one });
            this.contract = await solnSquareContract.new(verifier.address, name, symbol, { from: account_one });
        })

        it('mint ERC721 token ', async function () {
            let canMint = true;
            try {
                await this.contract.addSolution(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, account_two, 2, { from: account_one });
                await this.contract.mintNewNFT(proof.inputs[0], proof.inputs[1], account_two, { from: account_one });
            }
            catch (e) {
                console.log(e);
                canMint = false;
            }
            assert.equal(canMint, true, "cannot mint a token");
        });
    });

})
