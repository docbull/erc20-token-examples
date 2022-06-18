import contractABI from './TestToken-abi.json'assert{type: "json"};
const contractAddress = "0xAB8c361D9f7Fd5f0C32261F625a7C181adD6C5e5";
const alchemyKey = "https://eth-rinkeby.alchemyapi.io/v2/-Ji3kkJnrDIJC6fOd68MhCOTXijRu1qy";
const web3 = AlchemyWeb3.createAlchemyWeb3(alchemyKey);

export async function tokenTransfer () {
    if (window.ethereum) {
        window.contract = await new web3.eth.Contract(contractABI, contractAddress);
        const value = web3.utils.toBN(1 * (10**18));
        const data = await  window.contract.methods.transfer(contractAddress, value);
        const transactionParameters = {
            to: contractAddress,
            from: window.ethereum.selectedAddress,
            'data': data.encodeABI(),
        }
        try {
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log("NONE OF ETHERUEM");
    }
}

export async function getBalances() {
    let messages;
    if (window.ethereum) {
        window.contract = await new web3.eth.Contract(contractABI, contractAddress);
        const balances = await window.contract.methods.balanceOf(window.ethereum.selectedAddress).call();
        console.log("Balances:", balances/(10**18));
        messages = `
            <div>
                Account: ${window.ethereum.selectedAddress}
            <div>
            <div>
                Balances: ${balances/(10**18)}
            <div>
        `
    } else {
        messages = `
            <div>
                Your need to login
            <div>
        `
    }
    document.getElementById("user-info").innerHTML += messages;
}