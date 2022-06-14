require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json');
const contractAddress = '0x6f3f635A9762B47954229Ea479b4541eAF402A6A';

const testABI = require('../TestToken-abi.json');
const testContractAddress = '0x847c9794fc03ee5abf74455929313b13464bd902';

export const helloWorldContract = new web3.eth.Contract(
    contractABI,
    contractAddress,
);

export const testContract = new web3.eth.Contract(
    testABI,
    testContractAddress,
)

export const loadCurrentMessage = async () => { 
    const message = await helloWorldContract.methods.message().call();
    return message;
};

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆🏽 Write a message in the text-field above.",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your browser.
                    </a>
                </p>
            )
        }
    }
};

export const getCurrentWalletConnected = async () => {
   if (window.ethereum) {
       try {
           const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write a message in the text-field above.",
                }
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                }
            }
        } catch (err) {
            return {
                address: "",status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your browser.
                    </a>
                </p>
            )
        }     
    }
};

export const updateMessage = async (address, message) => {
    if (!window.ethereum || address == null) {
        return {
            status: "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }

    if (message.trim() === "") {
        return {
            status: "❌ Your message cannot be an empty string.",
        }
    }

    // const test = await testContract.methods.balanceOf(address).call();
    // console.log(test/(10**18));

    let balances = await testContract.methods.balanceOf(address).call();
    console.log("Balances:", balances/(10**18));

    let records = await testContract.methods.inquery(address).call();
    console.log("Records:", records);

    let recording = await testContract.methods.record(1);
    const txParameters = {
        to: testContractAddress,
        from: address,
        data: recording.encodeABI(),
    }
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [txParameters],
        })
    } catch (err) {
        console.log(err);
    }

    // const receiver = '0x1B8e6F4a982Dfe488006dC6Eac723029D15370B2';
    // const value = 1 * (10**18);
    // const amount = web3.utils.toBN(value);
    // const test = await testContract.methods.transfer(receiver, amount);
    // console.log("Test:", test);
    // const txParameters = {
    //     to: testContractAddress,
    //     from: address,
    //     data: test.encodeABI(),
    // }
    // try {
    //     const txHash = await window.ethereum.request({
    //         method: "eth_sendTransaction",
    //         params: [txParameters],
    //     });
    //     console.log(txHash);
    // } catch (err) {
    //     console.log(err);
    // }

    const data = helloWorldContract.methods.update(message);
    console.log("The data:", data);

    const transactionParameters = {
        to: contractAddress,
        from: address,
        // gas: Number(21000).toString(16),
        // gasPrice: Number(2500000).toString(16),
        // value: Number(1000000000000000000).toString(16),
        // data contains the call to our Hello World smart contract's 
        // update method, receiving our message string variable as input
        data: data.encodeABI(),
        // data: helloWorldContract.methods.update(message).encodeABI(),
    }

    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        })
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
                        View the status of your transaction on Etherscan!
                    </a>
                    <br />
                    ℹ️ Once the transaction is verified by the network, the message will
                    be updated automatically.
              </span>
            ),
        };
    } catch (error) {
        return {
            status: "😥 " + error.message,
        }
    }
};
