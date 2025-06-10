import { getContext, getUpgradeContractTx } from "@archethicjs/ae-contract-test"

async function main() {
  const ctx = await getContext()

  if (process.env["CONTRACT"] === undefined) {
    throw new Error("CONTRACT env var is required")
  }

  const fundingAccount = await ctx.getAccount()
  const contractAddress = process.env["CONTRACT"]

  console.log(`Upgrading contract ${contractAddress}`)

  await ctx.updateContract(fundingAccount, contractAddress)

  console.log("Contract upgraded")
  process.exit(0)
}

main().catch((error) => {
  console.error(error);
  process.exit(1)
});