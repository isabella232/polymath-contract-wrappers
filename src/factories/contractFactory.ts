import {
  ERC20DividendCheckpointContract_3_0_0,
  ModuleContract_3_0_0,
  ModuleFactoryContract_3_0_0,
  EtherDividendCheckpointContract_3_0_0,
  ERC20DetailedContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  PolyTokenContract_3_0_0,
  GeneralPermissionManagerContract_3_0_0,
  PolyTokenFaucetContract_3_0_0,
  CappedSTOContract_3_0_0,
  CappedSTOFactoryContract_3_0_0,
  USDTieredSTOFactoryContract_3_0_0,
  USDTieredSTOContract_3_0_0,
  CountTransferManagerContract_3_0_0,
  GeneralTransferManagerContract_3_0_0,
  ManualApprovalTransferManagerContract_3_0_0,
  PercentageTransferManagerContract_3_0_0,
  LockUpTransferManagerContract_3_0_0,
  BlacklistTransferManagerContract_3_0_0,
  VolumeRestrictionTMContract_3_0_0,
  FeatureRegistryContract_3_0_0,
  ModuleRegistryContract_3_0_0,
  ISecurityTokenRegistryContract_3_0_0,
  PolymathRegistryContract_3_0_0,
  VestingEscrowWalletContract_3_0_0,
  Web3Wrapper,
  CallData,
  Provider,
  ContractAbi,
} from '@polymathnetwork/abi-wrappers';
import assert from '../utils/assert';
import getDefaultContractAddresses from '../utils/addresses';
import { PolymathContract, NetworkId } from '../types';

async function getPolymathRegistryContract(web3Wrapper: Web3Wrapper, address?: string) {
  return new PolymathRegistryContract_3_0_0(
    address || (await getDefaultContractAddresses((await web3Wrapper.getNetworkIdAsync()) as NetworkId)), // for optional address
    web3Wrapper.getProvider(),
    web3Wrapper.getContractDefaults(),
  );
}

export default class ContractFactory {
  private web3Wrapper: Web3Wrapper;

  private abiArray: ContractAbi[];

  private provider: Provider;

  private polymathRegistry: Promise<PolymathRegistryContract_3_0_0>;

  private contractDefaults: Partial<CallData> | undefined;

  public constructor(web3Wrapper: Web3Wrapper, abiArray: ContractAbi[], polymathRegistryAddress?: string) {
    this.web3Wrapper = web3Wrapper;
    this.abiArray = abiArray;
    this.provider = web3Wrapper.getProvider() as Provider;
    this.contractDefaults = this.web3Wrapper.getContractDefaults();
    this.polymathRegistry = getPolymathRegistryContract(web3Wrapper, polymathRegistryAddress);
  }

  public async getModuleContract(address: string): Promise<ModuleContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new ModuleContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getERC20DividendCheckpointContract(address: string): Promise<ERC20DividendCheckpointContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new ERC20DividendCheckpointContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getPolymathRegistryContract(): Promise<PolymathRegistryContract_3_0_0> {
    const contract = await this.polymathRegistry;
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getModuleFactoryContract(address: string): Promise<ModuleFactoryContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new ModuleFactoryContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getEtherDividendCheckpointContract(address: string): Promise<EtherDividendCheckpointContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new EtherDividendCheckpointContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getVestingEscrowWalletContract(address: string): Promise<VestingEscrowWalletContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new VestingEscrowWalletContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getERC20DetailedContract(address: string): Promise<ERC20DetailedContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new ERC20DetailedContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getAlternativeERC20Contract(address: string): Promise<ERC20DetailedContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new ERC20DetailedContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getSecurityTokenContract(address: string): Promise<ISecurityTokenContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new ISecurityTokenContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getPolyTokenFaucetContract(): Promise<PolyTokenFaucetContract_3_0_0> {
    const contract = new PolyTokenFaucetContract_3_0_0(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.PolyToken),
      this.provider,
      this.contractDefaults,
    );
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getPolyTokenContract(): Promise<PolyTokenContract_3_0_0> {
    const contract = new PolyTokenContract_3_0_0(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.PolyToken),
      this.provider,
      this.contractDefaults,
    );
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getGeneralPermissionManagerContract(address: string): Promise<GeneralPermissionManagerContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new GeneralPermissionManagerContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getCappedSTOFactoryContract(address: string): Promise<CappedSTOFactoryContract_3_0_0> {
    const contract = new CappedSTOFactoryContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getCappedSTOContract(address: string): Promise<CappedSTOContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new CappedSTOContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getUSDTieredSTOFactoryContract(address: string): Promise<USDTieredSTOFactoryContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new USDTieredSTOFactoryContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getUSDTieredSTOContract(address: string): Promise<USDTieredSTOContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new USDTieredSTOContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getCountTransferManagerContract(address: string): Promise<CountTransferManagerContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new CountTransferManagerContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getGeneralTransferManagerContract(address: string): Promise<GeneralTransferManagerContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new GeneralTransferManagerContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getManualApprovalTransferManagerContract(
    address: string,
  ): Promise<ManualApprovalTransferManagerContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new ManualApprovalTransferManagerContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getPercentageTransferManagerContract(address: string): Promise<PercentageTransferManagerContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new PercentageTransferManagerContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getLockUpTransferManagerContract(address: string): Promise<LockUpTransferManagerContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new LockUpTransferManagerContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getBlacklistTransferManagerContract(address: string): Promise<BlacklistTransferManagerContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new BlacklistTransferManagerContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getVolumeRestrictionTMContract(address: string): Promise<VolumeRestrictionTMContract_3_0_0> {
    assert.isETHAddressHex('address', address);
    const contract = new VolumeRestrictionTMContract_3_0_0(address, this.provider, this.contractDefaults);
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getFeatureRegistryContract(): Promise<FeatureRegistryContract_3_0_0> {
    const contract = new FeatureRegistryContract_3_0_0(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.FeatureRegistry),
      this.provider,
      this.contractDefaults,
    );
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getModuleRegistryContract(): Promise<ModuleRegistryContract_3_0_0> {
    const contract = new ModuleRegistryContract_3_0_0(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.ModuleRegistry),
      this.provider,
      this.contractDefaults,
    );
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }

  public async getSecurityTokenRegistryContract(): Promise<ISecurityTokenRegistryContract_3_0_0> {
    const contract = new ISecurityTokenRegistryContract_3_0_0(
      await (await this.polymathRegistry).getAddress.callAsync(PolymathContract.SecurityTokenRegistry),
      this.provider,
      this.contractDefaults,
    );
    this.abiArray.forEach((abi): void => {
      contract.addABItoDecoder(abi);
    });
    return contract;
  }
}
