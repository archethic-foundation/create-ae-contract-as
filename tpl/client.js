import { getContext } from "@archethicjs/ae-contract-test";
import Archethic from "@archethicjs/sdk";


import config from './archethic.config.js';


// Constants for contract address and network URL
const CONTRACT_ADDRESS = "00002ebaf0d86aa241bcfaa94fd108a4ccad03b11c2f1b2ae9a4431c3436086c335c";
 

 
// Helper function to introduce a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to display the counter value from the contract
async function displayCounter(archethic, label) {
  try {
    const responseFn = await archethic.network.callFunction(CONTRACT_ADDRESS, "getCounter");
    console.log(`${label} Counter:`, responseFn);
  } catch (error) {
    console.error(`Error fetching counter for ${label}:`, error);
    throw error; // Re-throw the error to handle it in the main function
  }
}

// Main function to execute the transaction flow
async function main() {
  let archethic;
  try {
    // Initialize Archethic instance and connect to the network
    archethic = new Archethic(config.endpoint);
    await archethic.connect();

    // Get the context and funding account
    const ctx = await getContext();
    const fundingAccount = await ctx.getAccount();

    // Fetch and log the balance
    const balance = await archethic.network.getBalance(fundingAccount.address);
  
    // Request testnet funds if balance is insufficient
    if (balance < 5) {
      console.log("Requesting funds from faucet...");
      await fundingAccount.requestFaucet();
    }

    // Display the counter before the transaction
    await displayCounter(archethic, "Before");

    // Build the transaction to call the increment function in the contract
    const callTx = ctx.archethicClient.transaction.new()
      .setType("transfer")
      .addRecipient(CONTRACT_ADDRESS, "inc", { value: 5 });

    // Send the transaction
    console.log("Calling the incrementing function in the contract...");
    await fundingAccount.sendTransaction(callTx);

    // Introduce a small delay before checking the counter again
    await delay(1500);

    // Display the counter after the transaction
    await displayCounter(archethic, "After");

    process.exit(0);
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

// Execute the main function
main();