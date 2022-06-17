import contractABI from './TestToken-abi.json'assert{type: "json"};
const contractAddress = "0xAB8c361D9f7Fd5f0C32261F625a7C181adD6C5e5";
const alchemyKey = "";
const web3 = AlchemyWeb3.createAlchemyWeb3(alchemyKey);

export async function tokenTransfer () {
    if (window.ethereum) {
        window.contract = await new web3.eth.Contract(contractABI, contractAddress);
        let metamaskAccount = window.ethereum.selectedAddress;
        const balances = await window.contract.methods.balanceOf(metamaskAccount).call();
        console.log("Balances:", balances/(10**18));

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