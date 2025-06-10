import { getContext } from "@archethicjs/ae-contract-test"
import { Utils } from "@archethicjs/sdk"

async function main() {

  let prod = false;


  // Récupérer les arguments de la ligne de commande
  const args = process.argv.slice(2); // Les deux premiers éléments sont le chemin de Node.js et le chemin du script

  // Vérifier si le paramètre --prod est présent
  const isProd = args.includes('--prod');

  if (isProd) {
    console.log('Running in production mode');
    prod = true;
  }



  const ctx = await getContext()
  const fundingAccount = await ctx.getAccount()

  if (!prod) {
    // Request testnet funds
   // await fundingAccount.requestFaucet()
  }



  console.log("address ", fundingAccount.address)

  const contractAccount = ctx.getRandomAccount()

  // Fund the contract's chain
  const fundingTx = ctx.archethicClient.transaction.new()
    .setType("transfer")
    .addUCOTransfer(contractAccount.address, Utils.parseBigInt("10"))

  console.log("Funding contract...")
  await fundingAccount.sendTransaction(fundingTx)

  console.log("Deploying contract...")
  const transactionAddress = await ctx.deployContract(contractAccount)

  console.log(`Contract deployed at: ${transactionAddress}`)


 


  process.exit(0)
}

main().catch((error) => {
  console.error(error);
  process.exit(1)
});