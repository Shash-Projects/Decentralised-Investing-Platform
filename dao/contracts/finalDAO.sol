// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// CustomToken Contract
contract CustomToken is ERC20 {
    address public owner;

    constructor() ERC20("CustomToken", "CTK") {
        // Empty constructor
    }

    function initialize(address _owner, uint256 initialSupply) external {
        //require(owner == address(0), "Already initialized");
        owner = _owner;
        _mint(owner, initialSupply);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function toktransfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function getAccountBalance(address _address) external view returns (uint256) {
        return balanceOf(_address);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}

// Dao Contract
contract Dao{
    address public owner;
    uint256 public noOfExperts;
    uint256 public minStake;
    uint256 public minAcceptanceToPassProposal;
    address public intokenowner;
    address public toksaleadrs;
    address[] public panelOfExperts;
    mapping(address => uint256) public stakes;
    address payable private  target;

//for tokensale

    IERC20 public token;
    
    uint256 public tokenprice; // in wei
    uint256 tend;
    
    uint256 public goal;
    uint256 public tokensSold;
    bool public goalReached;
    
    uint256 public saleEnd;
    address payable public investAddress;

    mapping(address => uint256) public tokenBalance;
    address[] public buyers;
    uint256 proposerMargin;

    // Event Declarations
    event expertAddedToPanel(uint256 index, address expert);
    event expertAlreadyInPanel(uint256 index, address expert);
    event expertPanelFull();
    event proposalCreated(uint256 proposalId);
    event votedSuccessfully(bool vote, address voter);
    event votedAlready(address voter);
    event proposalExpired(uint256 proposalId);
    event ProposalBalance(uint256 proposalId, uint256 balance);
    event TokenBalance(address indexed contractAddress, uint256 balance);

    event Sell(address indexed buyer, uint256 amount);
    event SaleSuccessful();
    event SaleFailed();
    event FundDistributedSuccessfully(uint256 amount);
    event check(uint256 profit, uint256 proposer, uint256 buyer, uint256 total);



    constructor(uint256 _noOfExperts, uint256 _minAcceptanceToPassProposal, uint256 _stakeAmount) {
        owner = msg.sender;
        panelOfExperts.push(owner);
        noOfExperts = _noOfExperts;
        minAcceptanceToPassProposal = _minAcceptanceToPassProposal;
        minStake = _stakeAmount * 1 ether;

    }

   struct Proposal {
    address target;
    uint256 yesCount;
    uint256 noCount;
    uint256 amountToInvest;
    uint256 marginForStakers;
    uint256 marginForPublic;
    uint256 expiry;
    bool executed;
    bytes data;
    uint256 initialSupply;
    address customTokenAddress; // Added to store CustomToken address
    uint256 tokenprice; // in wei
}

 
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorised to perform this action");
        _;
    }

    // Only experts can propose for an investment
    modifier checkAccess() {
        bool access = false;
        for (uint256 i = 0; i < panelOfExperts.length; i++) {
            if (panelOfExperts[i] == msg.sender) {
                access = true;
            }
        }
        require(access, "Only an expert can make a proposal");
        _;
    }

    modifier saleActive() {
        require(block.timestamp < tend, "Sale has ended");
        _;
    }

    receive() external payable {}
    fallback() external payable {}

    Proposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public proposalVotes; // marks whether voted already or not

    // Does not force the user to stake the entire amount at one go
    function stake() public payable {
       if (panelOfExperts.length == noOfExperts) {
            emit expertPanelFull();     
        }

        require(msg.value >= minStake, "Amount transferred must be greater than equal to minimum staking amount");
        stakes[msg.sender] += msg.value;

        if (stakes[msg.sender] >= minStake) {
            addExpert();
        }
    }

    function addExpert() private {
        for (uint256 i = 0; i < panelOfExperts.length; i++) {
            if (panelOfExperts[i] == msg.sender) {
                emit expertAlreadyInPanel(i, msg.sender);
                return;
            }
        }
        

        panelOfExperts.push(msg.sender);
        emit expertAddedToPanel(panelOfExperts.length - 1, msg.sender);
    }
    
    
    function makeProposal(
        address payable _target,
       // uint256 _amountToInvest,
        uint256 _marginForStakers, 
        uint256 _marginForPublic,
        uint256 _expiryHr,
        uint256 _initialSupply,
        uint _tokenprice
    ) public checkAccess {
        Proposal storage prop = proposals.push(); // returns a reference to the newly added struct.
        prop.target = _target;
        target = _target;
       // prop.amountToInvest = _amountToInvest * 1 ether;
        prop.marginForPublic = _marginForPublic;
        prop.marginForStakers = _marginForStakers;
        prop.expiry = block.timestamp + (_expiryHr * 1 hours);
        tend = prop.expiry;
        prop.initialSupply = _initialSupply; // Set the initial supply 
        goal=prop.initialSupply;
        prop.tokenprice = _tokenprice * 1 ether;
        tokenprice = prop.tokenprice;
        
        proposerMargin = _marginForStakers;
        emit proposalCreated(proposals.length - 1);
    }
  

CustomToken public customToken;

  function voteForProposal(bool vote, uint256 index) public checkAccess {
    if (block.timestamp > proposals[index].expiry) {
        emit proposalExpired(index);
        return;
    }
    if (proposalVotes[index][msg.sender] == true) {
        emit votedAlready(msg.sender);
        return;
    }
    if (vote) {
        proposals[index].yesCount++;
        proposalVotes[index][msg.sender] = true;
    } else {
        proposals[index].noCount++;
        proposalVotes[index][msg.sender] = true;
    }

    emit votedSuccessfully(vote, msg.sender);

    if (proposals[index].yesCount >= minAcceptanceToPassProposal && !proposals[index].executed) {
        //(bool s,) = proposals[index].target.call(proposals[index].data);
        // this was supposed to create tokens to generate public funding
       
            customToken = new CustomToken();

            customToken.initialize(address(this), proposals[index].initialSupply);

            // Get balance of this account
            uint256 balance = customToken.getAccountBalance(address(this));
            emit TokenBalance(address(this), balance);

            proposals[index].executed = true;
    }
}

//from tokensale
event balanceOfTokens(uint256 bal);

function buyTokens(uint256 numberOfTokens) public payable saleActive {
    require(msg.value == numberOfTokens * tokenprice, "Incorrect ether value");
    require(customToken.balanceOf(address(this)) >= numberOfTokens, "Not enough tokens available");

    // Update buyer's balance and tokens sold
    if (tokenBalance[msg.sender] == 0) {
        buyers.push(msg.sender);
    }
    tokenBalance[msg.sender] += numberOfTokens;
    tokensSold += numberOfTokens;
    emit balanceOfTokens(customToken.balanceOf(address(this)));
    // Transfer tokens to the buyer
   // bool success = token.transfer(msg.sender, numberOfTokens);
    //require(success, "Token transfer failed");

    if ((block.timestamp >= saleEnd ||  customToken.balanceOf(address(this))== 0) && (tokensSold >= goal)) {
        goalReached = true;
        emit SaleSuccessful();
        investFunds(target); // Fund automatically transferred to investment site
    }

    emit Sell(msg.sender, numberOfTokens);
}

   function investFunds(address payable _investaddress) public {
        //require(goalReached, "Goal not reached");
        totalInvested = address(this).balance;
        _investaddress.transfer(address(this).balance);
    }

    function refundBuyers() public onlyOwner {
        require(!goalReached, "Goal was reached");

        for (uint256 i = 0; i < buyers.length; i++) {
            address buyer = buyers[i];
            uint256 noOfTokens = tokenBalance[buyer];
            if (noOfTokens > 0) {
                // Re-entrancy guard ( Check-Effecr-Interaction )
                tokenBalance[buyer] = 0;
                payable(buyer).transfer(noOfTokens * tokenprice);
            }
        }
    }


// Fund Distribution contract
uint256 totalInvested;
uint256 profits =0;
uint256 totalReturn;
uint buyersShare;


function investment() public  {
    // this function simulates env where we have recceived our investment returns in this contract
    // for this the contracct balance shouldn't be zero, increase using stake

    totalReturn = address(this).balance;
}

function fundDistribution() external payable onlyOwner {
 
    require (buyers.length > 0 , "No investors "); 
    require ( panelOfExperts.length> 0 , "No experts"); 
    require(address(this).balance > 0, "No balance to distribute");
    // solidity does not deal with decimal values
    // any value btw 0-1 will be zero
    uint256 proposerShare = (totalReturn * proposerMargin* 8) / (100 * panelOfExperts.length* 10); // 80%, leaving 20% for gas fees 
    require(proposerShare > 0, "Proposer share is zero");



    buyersShare =( (totalReturn-(proposerShare*(panelOfExperts.length)))*8) / (buyers.length*10); // 80%, leaving 20% for gas fees 
    require(proposerShare > 0, "Proposer share is zero");
    require(buyersShare > 0, "Buyers share is zero");
       
    for (uint256 i=0; i< panelOfExperts.length; i++){
        payable(panelOfExperts[i]).transfer(proposerShare);
    }

    emit check(profits, proposerShare, buyersShare, totalReturn);
    emit FundDistributedSuccessfully(proposerShare);
   
     for (uint i = 0; i < buyers.length; i++) {
        payable(buyers[i]).transfer((buyersShare)*tokenBalance[buyers[i]]);
    }

    emit FundDistributedSuccessfully(buyersShare);
    }

    function addProfits() external payable onlyOwner {
        profits += msg.value;
    }


}