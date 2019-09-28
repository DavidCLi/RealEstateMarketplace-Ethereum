var ERC721MintableComplete = artifacts.require('HouseToken');

contract('TestERC721Mintable', accounts => {

    const account_one   = accounts[0];
    const account_two   = accounts[1];
    const account_three = accounts[2];
    const symbol = "DAV";
    const name = "DAV_Token";

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(name,symbol,{from: account_one});

            // TODO: mint multiple tokens
            for(let number = 0; number < 5; number++){
               await this.contract.mint(account_two,number,{from:account_one});
            }            
        })

        it('should return total supply', async function () { 
            let total = await this.contract.totalSupply.call();
            assert.equal(total.toNumber(), 5, "result not correct");
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf.call(account_two, {from: account_one});;
            assert.equal(parseInt(balance), 5, "Incorrect token balance");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let _tokenURI = await this.contract.tokenURI.call(1, {from: account_one});
            assert(_tokenURI == "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "TokenURI does not match");
        })

        it('should transfer token from one owner to another', async function () { 
            let tokenId = 1;
            await this.contract.transferFrom(account_two,account_three,tokenId,{from:account_two});
            currentOwner = await this.contract.ownerOf.call(tokenId);
            assert.equal(currentOwner, account_three, "Owner should be account_three");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(name,symbol,{from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let failed = false;
            try {
              await this.contract.mint(account_two,8,{from:account_two});
            } catch (e) {
              failed = true;
            }
            assert.equal(failed, true, "should fail when address is not account owner");  
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.owner.call({from: account_one});
            assert.equal(owner, account_one, "owner should be account_one");
        })

    });
})