// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ApeMarket {
    struct Ape {
        address payable seller;
        address payable owner;
        address token;
        uint tokenId;
        uint price;
        bool sold;
    }

    address owner;
    bool paused;

    uint private apeId = 0;
    mapping(uint => Ape) private apes;

    //	blacklist malicious addresses
    mapping(address => bool) public blacklist;

    modifier onlyOwner {
        require(msg.sender == owner, "Only callable by owner of contract");
        _;
    }

    modifier notBlacklisted {
        require(!blacklist[msg.sender], "You are blacklisted");
        _;
    }


    //	ensure the contract is not paused
    modifier mintNotPaused {
        require( paused == false, "Minting and buying has been paused on this contract");
        _;
    }

    constructor(address _owner)  {
        owner = _owner;
    }




    function createApe(address token, uint tokenId, uint price) external mintNotPaused notBlacklisted {
        require(token != address(0), "Token address cannot be 0");
        require(price  > 0, "Price cannot be 0");
        Ape memory ape = Ape(
            payable(msg.sender),
            payable(msg.sender),
            token,
            tokenId,
            price,
            false
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

    function buyApe(uint _apeId) public payable  mintNotPaused notBlacklisted {
        Ape storage ape = apes[_apeId];

        require(msg.value >= ape.price, "Insufficient payment");

        IERC721(ape.token).transferFrom(ape.owner, msg.sender, ape.tokenId);
        payable(ape.seller).transfer(msg.value);

        ape.sold = true;
        ape.owner = payable(msg.sender);
        ape.seller = payable(msg.sender);

    }

    function pauseMinting() public onlyOwner {
        paused = true;
    }
    function unPauseMinting() public onlyOwner {
        paused = false;
    }
}
