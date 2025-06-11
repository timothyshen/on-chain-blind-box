import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BlindBoxSystem", (m) => {
  // Deploy IPPYNFT first (no dependencies)
  const ippyNFT = m.contract("IPPYNFT", []);

  // Deploy BlindBox with IPPYNFT address
  const blindBox = m.contract("BlindBox", [ippyNFT]);

  // Set up the relationship - BlindBox contract address in IPPYNFT
  m.call(ippyNFT, "setBlindBoxContract", [blindBox]);

  return {
    ippyNFT,
    blindBox,
  };
});
