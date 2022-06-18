import { tokenTransfer, getBalances } from "./erc20/interact.js";

window.onload = function () {
    getBalances();
    $("#transfer").click(function () {
        console.log("💰 Tanferring 1 token ...");
        tokenTransfer();
    })
}