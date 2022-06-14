//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.14;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "./node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    // Setttle is a settlement of that users' rewards
    event Settle(address indexed from, address indexed to, uint tokens);
    event Record(address indexed user, uint chunk);

    string private constant _name = "Test Token Coin"; // the name that will be shown on wallet
    string private constant _symbol = "TTC";           // it indicates the coin's symbol (e.g., ETH from Ethereum)
    uint8 private constant _decimals = 18;             // this number means the decimal of the amount of the coin

    mapping(address => uint256) records;

    uint256 private _initial_supply;

    constructor(uint total) ERC20(_name, _symbol) public {
        _initial_supply = total * (10 ** _decimals);

        _mint(msg.sender, _initial_supply);
    }

    function settle(address receiver, uint numTokens) public returns (bool) {
        emit Settle(msg.sender, receiver, numTokens);
        return true;
    }

    function payment(uint numTokens) public returns (bool) {
        return true;
    }

    function record(uint chunk) public returns (bool) {
        require(chunk <= records[msg.sender]);
        records[msg.sender] += chunk;
        return true;
    }

    function inquery(address tokenOwner) public view returns (uint) {
        return records[tokenOwner];
    }

    // function balanceOf(address account) public view virtual override returns (uint256) {
    //     return _balances[account];
    // }
}