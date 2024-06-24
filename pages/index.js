import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositValue, setdepositValue] = useState('');
  const [withdrawlValue, setwithdrawlValue] = useState('');

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
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
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(depositValue);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(withdrawlValue);
      await tx.wait()
      getBalance();
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
      <div className="container">
      <p>Your Account: {account}</p>
      <p>Your Balance: {balance}</p>
      <div className="input-container">
        <label>
          Enter amount to deposit:
          <input
            type="text"
            value={depositValue}
            onChange={handleDepositChange}
          />
        </label>
        <button onClick={deposit}>Deposit  ETH</button>
      </div>
      <div className="input-container">
        <label>
          Enter amount to withdraw:
          <input
            type="text"
            value={withdrawlValue}
            onChange={handlewithdrawlChange}
          />
        </label>
        <button onClick={withdraw}>Withdraw  ETH</button>
      </div>
      <style jsx>
          {`
          button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}
.input-container {
  margin-bottom: 20px;
}

input[type="text"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

input[type="text"]:focus {
  outline: none;
  border-color: #4CAF50;
}
          `}
        </style>
    </div>
        
      
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Aakash's ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        

.container {
  margin: auto;
  max-width: 600px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

}

header {
  margin-bottom: 20px;
}



      `}
      </style>
    </main>
  )
}
