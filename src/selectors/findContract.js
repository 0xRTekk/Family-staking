const findContract = (artifacts, contracts, networkID, contractName) => {
  const correctArtifact = artifacts.find((artifact) => artifact.contractName === contractName);
  const correctAddr = correctArtifact.networks[networkID].address;
  const correctContract = contracts.find((contract) => contract.options.address === correctAddr);
  return correctContract;
}

export default findContract;