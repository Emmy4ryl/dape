// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ApeMarket {
	struct Ape {
        	address owner;
		address token;
		uint tokenId;
		uint price;
	}

	uint private apeId = 0;
	mapping(uint => Ape) private apes;

	function createApe(address token, uint tokenId, uint price) external {
		Ape memory ape = Ape(
            		msg.sender,
			token,
			tokenId,
			price
		);
		apes[apeId] = ape;
		apeId++;
	}

	function getApe(uint _apeId) public view returns (Ape memory) {
		return apes[_apeId];
	}

	function getApeLength()public view returns (uint){
		return apeId;
	}

	function buyApe(uint _apeId) public payable {
		Ape storage ape = apes[_apeId];

		require(msg.value == ape.price, "Insufficient payment");

		IERC721(ape.token).transferFrom(ape.owner, msg.sender, ape.tokenId);
		payable(ape.owner).transfer(msg.value);

        	ape.owner = msg.sender;
	}
}
