// // import
// // async function
// // call main function
// import { networkConfig } from "../helper-hardhat-config"

// module.exports= async ({ getNamedAccounts, deployments, network }) => {
//     const {deploy, log} = deployments
//     const { deployer } = getNamedAccounts()
//     const chainId: number = network.config.chainId!
//     const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

//     const fundMe = await deploy("FundMe", {
//         from: deployer,
//         args: [ethUsdPriceFeedAddress],
//         log: true,
//         // we need to wait if on a live network so we can verify properly
//         // waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
//       })

// }
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../utils/verify"
import { networkConfig, developmentChains } from "../helper-hardhat-config"

const deployFundMe: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId: number = network.config.chainId!

  let ethUsdPriceFeedAddress: string
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[network.name].ethUsdPriceFeed!
  }
  log("----------------------------------------------------")
  log("Deploying FundMe and waiting for confirmations...")
  const args = [ethUsdPriceFeedAddress]
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  })
  log(`FundMe deployed at ${fundMe.address}`)
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args)
  }
}
export default deployFundMe
deployFundMe.tags = ["all", "fundMe"]
