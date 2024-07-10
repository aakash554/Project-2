import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import styles from '../styles/AtmStyles.module.css';  

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [transactions, setTransactions] = useState([]);
  const [depositValue, setdepositValue] = useState('');
  const [withdrawlValue, setwithdrawlValue] = useState('');

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const updateTransactionHistory = (type, amount) => {
    const newTransaction = { type, amount, timestamp: new Date().toLocaleString() };
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }

  const handleDepositChange = (event) => {
    setdepositValue(event.target.value);
  };

  const handlewithdrawlChange = (event) => {
    setwithdrawlValue(event.target.value);
  };

  const getBalance = async() => {
    if (atm) {
      try {
        const balance = await atm.getBalance();
        setBalance(balance.toNumber());
      } catch (error) {
        console.error("Error fetching balance:", error);
        // Log more details about the contract and connection
        console.log("Contract address:", contractAddress);
        console.log("Connected account:", account);
        console.log("ATM contract object:", atm);
      }
    }
  }

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(depositValue);
      await tx.wait()
      getBalance();
      updateTransactionHistory('Deposit', depositValue);
    }
  }

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(withdrawlValue);
      await tx.wait()
      getBalance();
      updateTransactionHistory('Withdrawal', withdrawlValue);
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }


    return (
      <div className={styles.page}>
        <main className={styles.container}>
          <h1 className={styles.title}>Aakash's ATM</h1>
          {!account ? (
            <button className={styles.connectButton} onClick={connectAccount}>Connect Metamask Wallet</button>
          ) : (
            <>
              <div className={styles.accountInfo}>
                <p><strong>Account:</strong> {account}</p>
                <p><strong>Balance:</strong> <span className={styles.balance}>{balance} ETH</span></p>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="deposit-amount">Deposit Amount (ETH):</label>
                <input
                  id="deposit-amount"
                  className={styles.input}
                  type="text"
                  value={depositValue}
                  onChange={handleDepositChange}
                  placeholder="Enter amount to deposit"
                />
                <button className={styles.button} onClick={deposit}>Deposit ETH</button>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="withdraw-amount">Withdraw Amount (ETH):</label>
                <input
                  id="withdraw-amount"
                  className={styles.input}
                  type="text"
                  value={withdrawlValue}
                  onChange={handlewithdrawlChange}
                  placeholder="Enter amount to withdraw"
                />
                <button className={styles.button} onClick={withdraw}>Withdraw ETH</button>
              </div>
              <div className={styles.transactionHistory}>
                <h2>Transaction History</h2>
                <ul className={styles.transactionList}>
                  {transactions.map((tx, index) => (
                    <li key={index} className={styles.transactionItem}>
                      <strong>{tx.type}:</strong> {tx.amount} ETH - {tx.timestamp}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </main>
      </div>
    );
  }

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Aakash's ATM!</h1></header>
      {initUser()}
    </main>
  )
}
