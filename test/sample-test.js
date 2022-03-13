const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Apes', function () {
  let client;
  let owner;

  let apesOfSpace;

  const value = ethers.utils.parseEther('0.35');

  beforeEach(async function () {
    [owner, client] = await ethers.getSigners();

    const ApesOfSpace = await ethers.getContractFactory('ApesOfSpace');
    apesOfSpace = await ApesOfSpace.connect(owner).deploy();
    await apesOfSpace.deployed();
  });

  it('Validate owner', async function () {
    const address = await apesOfSpace.owner();
    expect(address).to.equal(owner.address);
  });

  it('Switch contract mode and mint new apes', async function () {
    const flipSaleStateTx = await apesOfSpace.connect(owner).flipSaleState();
    await flipSaleStateTx.wait();
    expect(await apesOfSpace.saleIsActive()).to.equal(true);

    expect(await ethers.provider.getBalance(apesOfSpace.address)).to.equal(0);

    const mintApesTx = await apesOfSpace.mintApes(10, { value });
    await mintApesTx.wait();

    expect(await ethers.provider.getBalance(apesOfSpace.address)).to.equal(
      value
    );
  });
});
