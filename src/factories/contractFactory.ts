import { Provider, TxData } from 'ethereum-types';

import {
  ERC20DividendCheckpointContract,
  ModuleContract,
  ModuleFactoryContract,
  EtherDividendCheckpointContract,
  DetailedERC20Contract,
  SecurityTokenContract,
  PolyTokenContract,
  GeneralPermissionManagerContract,
  PolyTokenFaucetContract,
  CappedSTOContract,
  CappedSTOFactoryContract,
  USDTieredSTOFactoryContract,
  USDTieredSTOContract,
  CountTransferManagerContract,
  GeneralTransferManagerContract,
  ManualApprovalTransferManagerContract,
  PercentageTransferManagerContract,
  VolumeRestrictionTMContract,
  FeatureRegistryContract,
  ModuleRegistryContract,
  SecurityTokenRegistryContract,
} from '@polymathnetwork/abi-wrappers';

import {
  ERC20DividendCheckpoint,
  Module,
  ModuleFactory,
  EtherDividendCheckpoint,
  DetailedERC20,
  SecurityToken,
  PolyToken,
  GeneralPermissionManager,
  PolyTokenFaucet,
  CappedSTO,
  CappedSTOFactory,
  USDTieredSTOFactory,
  USDTieredSTO,
  CountTransferManager,
  GeneralTransferManager,
  ManualApprovalTransferManager,
  PercentageTransferManager,
  VolumeRestrictionTransferManager,
  FeatureRegistry,
  ModuleRegistry,
  SecurityTokenRegistry,
} from '@polymathnetwork/contract-artifacts';
import PolymathRegistryWrapper from '../contract_wrappers/registries/polymath_registry_wrapper';

export default class ContractFactory {
  private provider: Provider;

  private polymathRegistry: PolymathRegistryWrapper;

  private contractDefaults: Partial<TxData>;

  public constructor(provider: Provider, contractDefaults: Partial<TxData>, polymathRegistry: PolymathRegistryWrapper) {
    this.provider = provider;
    this.polymathRegistry = polymathRegistry;
    this.contractDefaults = contractDefaults;
  }

  public async getModuleContract(address: string): Promise<ModuleContract> {
    return new ModuleContract(Module.abi, address, this.provider, this.contractDefaults);
  }

  public async getERC20DividendCheckpointContract(address: string): Promise<ERC20DividendCheckpointContract> {
    return new ERC20DividendCheckpointContract(
      ERC20DividendCheckpoint.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getModuleFactoryContract(address: string): Promise<ModuleFactoryContract> {
    return new ModuleFactoryContract(ModuleFactory.abi, address, this.provider, this.contractDefaults);
  }

  public async getEtherDividendCheckpointContract(address: string): Promise<EtherDividendCheckpointContract> {
    return new EtherDividendCheckpointContract(
      EtherDividendCheckpoint.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getDetailedERC20Contract(address: string): Promise<DetailedERC20Contract> {
    return new DetailedERC20Contract(DetailedERC20.abi, address, this.provider, this.contractDefaults);
  }

  public async getSecurityTokenContract(address: string): Promise<SecurityTokenContract> {
    return new SecurityTokenContract(SecurityToken.abi, address, this.provider, this.contractDefaults);
  }

  public async getPolyTokenFaucetContract(): Promise<PolyTokenFaucetContract> {
    return new PolyTokenFaucetContract(
      PolyTokenFaucet.abi,
      await this.polymathRegistry.getPolyTokenAddress(),
      this.provider,
      this.contractDefaults,
    );
  }

  public async getPolyTokenContract(): Promise<PolyTokenContract> {
    return new PolyTokenContract(
      PolyToken.abi,
      await this.polymathRegistry.getPolyTokenAddress(),
      this.provider,
      this.contractDefaults,
    );
  }

  public async getGeneralPermissionManagerContract(address: string): Promise<GeneralPermissionManagerContract> {
    return new GeneralPermissionManagerContract(
      GeneralPermissionManager.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getCappedSTOFactoryContract(): Promise<CappedSTOFactoryContract> {
    return new CappedSTOFactoryContract(
      CappedSTOFactory.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'CappedSTOFactory',
      }),
      this.provider,
      this.contractDefaults,
    );
  }

  public async getCappedSTOContract(address: string): Promise<CappedSTOContract> {
    return new CappedSTOContract(CappedSTO.abi, address, this.provider, this.contractDefaults);
  }

  public async getUSDTieredSTOFactoryContract(address: string): Promise<USDTieredSTOFactoryContract> {
    return new USDTieredSTOFactoryContract(USDTieredSTOFactory.abi, address, this.provider, this.contractDefaults);
  }

  public async getUSDTieredSTOContract(address: string): Promise<USDTieredSTOContract> {
    return new USDTieredSTOContract(USDTieredSTO.abi, address, this.provider, this.contractDefaults);
  }

  public async getCountTransferManagerContract(address: string): Promise<CountTransferManagerContract> {
    return new CountTransferManagerContract(CountTransferManager.abi, address, this.provider, this.contractDefaults);
  }

  public async getGeneralTransferManagerContract(address: string): Promise<GeneralTransferManagerContract> {
    return new GeneralTransferManagerContract(
      GeneralTransferManager.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getManualApprovalTransferManagerContract(
    address: string,
  ): Promise<ManualApprovalTransferManagerContract> {
    return new ManualApprovalTransferManagerContract(
      ManualApprovalTransferManager.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getPercentageTransferManagerContract(address: string): Promise<PercentageTransferManagerContract> {
    return new PercentageTransferManagerContract(
      PercentageTransferManager.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getVolumeRestrictionTMContract(address: string): Promise<VolumeRestrictionTMContract> {
    return new VolumeRestrictionTMContract(
      VolumeRestrictionTransferManager.abi,
      address,
      this.provider,
      this.contractDefaults,
    );
  }

  public async getFeatureRegistryContract(): Promise<FeatureRegistryContract> {
    return new FeatureRegistryContract(
      FeatureRegistry.abi,
      await this.polymathRegistry.getFeatureRegistryAddress(),
      this.provider,
      this.contractDefaults,
    );
  }

  public async getModuleRegistryContract(): Promise<ModuleRegistryContract> {
    return new ModuleRegistryContract(
      ModuleRegistry.abi,
      await this.polymathRegistry.getModuleRegistryAddress(),
      this.provider,
      this.contractDefaults,
    );
  }

  public async getSecurityTokenRegistryContract(): Promise<SecurityTokenRegistryContract> {
    return new SecurityTokenRegistryContract(
      SecurityTokenRegistry.abi,
      await this.polymathRegistry.getSecurityTokenRegistryAddress(),
      this.provider,
      this.contractDefaults,
    );
  }
}
