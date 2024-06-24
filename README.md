# Ethereum ATM DApp

## Overview

This project is an Ethereum-based decentralized application (DApp) that simulates an ATM, allowing the owner to deposit and withdraw Ether. The project includes a smart contract written in Solidity and a React frontend to interact with the contract.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm or yarn
- MetaMask extension installed in your browser
- Hardhat (for contract deployment and testing)

## Project Setup
- Clone the repository
- Install dependencies
- Compile and Deploy Smart Contract
- Start the Local Blockchain
- Connect MetaMask to Local Blockchain
- Run the Frontend Application

### Project Structure
- `Assessment.sol`: The main contract for deposit and withdrawal operations.
- `deploy.js`: Script to deploy the Assessment contract.
- `index.js`: The main page that interacts with the smart contract.

## Usage
- **Connect MetaMask**: Click the "Please connect your Metamask wallet" button to connect your wallet.
- **Deposit Ether**: Enter the amount of Ether you want to deposit and click "Deposit ETH".
- **Withdraw Ether**: Enter the amount of Ether you want to withdraw and click "Withdraw ETH".
- **View Balance**: The balance will be displayed on the page.

## Smart Contract Overview

The `Assessment` contract allows only the owner to deposit and withdraw Ether. It includes:

- `deposit(uint256 _amount)`: Allows the owner to deposit Ether.
- `withdraw(uint256 _withdrawAmount)`: Allows the owner to withdraw Ether.
- `getBalance()`: Returns the current balance of the contract.

## Frontend Overview

The React frontend interacts with the smart contract using ethers.js. It includes:

- Wallet connection via MetaMask.
- Displaying the connected account and contract balance.
- Input fields and buttons for deposit and withdrawal operations.
  

## Authors

Contributors names and contact info

Aakash Sharma  
(aakasharma5504@gmail.com)

## Acknowledgements

- Hardhat
- Ethers.js
- Reeact
