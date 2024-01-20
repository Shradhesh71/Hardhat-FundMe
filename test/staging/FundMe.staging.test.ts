import { ethers, getNamedAccounts, network } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { assert } from "chai"

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe: any
      let deployer
      const sendValue = ethers.utils.parseEther("1")
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
      })

      it("Allow people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue })
        await fundMe.withdraw()
        const endingFundMeBalance = await fundMe.provider.getBalance(
          fundMe.address
        )
        assert.equal(endingFundMeBalance.toString(), "0")
      })
    })
