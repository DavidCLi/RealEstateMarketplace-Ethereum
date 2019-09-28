pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./verifier.sol";
// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier{ }

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is HouseToken {
    SquareVerifier public verifierContract;
    constructor(address verifierAddress, string memory name, string memory symbol) HouseToken(name, symbol) public{
        verifierContract = SquareVerifier(verifierAddress);
    }


// TODO define a solutions struct that can hold an index & an address
struct Solution{
    uint solutionIndex;
    address solutionAddress;
    bool minted;
}

// TODO define an array of the above struct
Solution[] SolutionsArray;

// TODO define a mapping to store unique solutions submitted
mapping (bytes32 => Solution) private solutions;


// TODO Create an event to emit when a solution is added
event SolutionAdded(uint solutionIndex, address solutionAddress);


// TODO Create a function to add the solutions to the array and emit the event
function addSolution(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, address _to, uint _tokenId) public
{
    bytes32 key = keccak256(abi.encodePacked(input[0], input[1]));
    require(solutions[key].solutionAddress == address(0),"Solution already used");

    bool verified = verifierContract.verifyTx(a,b,c, input);
    require(verified, "Solution could not be verified");

    Solution memory _solution = Solution({solutionIndex:_tokenId, solutionAddress:_to, minted: false});
    SolutionsArray.push(_solution);
    solutions[key] = _solution;
    emit SolutionAdded(_tokenId, _to);
}

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
    function mintNewNFT(uint a, uint b, address to) public
  {
      bytes32 key = keccak256(abi.encodePacked(a, b));

      require(solutions[key].solutionAddress != address(0), "Solution does not exist");
      require(solutions[key].minted == false, "Token already minted for this solution");
      require(solutions[key].solutionAddress == to, "Only solution address can mint a token");
      super.mint(solutions[key].solutionAddress, solutions[key].solutionIndex);
      solutions[key].minted = true;
  }
}

























