import { tokenTransfer } from "./erc20/interact.js";

window.onload = function () {
    $("#transfer").click(function () {
        console.log("💰 Tanferring 1 token ...");
        tokenTransfer();
    })
}