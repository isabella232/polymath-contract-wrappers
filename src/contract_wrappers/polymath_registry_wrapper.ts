import { PolymathRegistryContract } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistry } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { assert } from '../utils/assert';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import * as AddressesUtils from '../utils/addresses';
import { ITxParams, NetworkId } from '../types';

/**
* @param contractName is the key for the contract address mapping
*/
export interface IGetAddressParams {
  contractName: string;
}


enum Contracts {
  PolyToken = "PolyToken",
  ModuleRegistry = "ModuleRegistry",
  FeatureRegistry = "FeatureRegistry",
  SecurityTokenRegistry = "SecurityTokenRegistry",
  PolyUsdOracle = "PolyUsdOracle",
  EthUsdOracle = "EthUsdOracle"
}

/**
 * This class includes the functionality related to interacting with the PolymathRegistry contract.
 */
export class PolymathRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = PolymathRegistry.abi;
  public address?: string;
  private polymathRegistryContract: Promise<PolymathRegistryContract>;

  /**
   * Instantiate PolymathRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param address The address of the PolymathRegistry contract.
   */
  constructor(web3Wrapper: Web3Wrapper, registryAddress?: string) {
    super(web3Wrapper);
    this.address = registryAddress;
    this.polymathRegistryContract = this._getPolymathRegistryContract();
  }

  /**
   * Gets the contract address
   * @return address string
   */
  public getAddress = async (params: IGetAddressParams): Promise<string> => {
    assert.isString('contractName', params.contractName);
    const address = await (await this.polymathRegistryContract).getAddress.callAsync(
      params.contractName,
    );
    return address;
  }

  /**
   * Gets the PolyToken contract address
   * @return address string
   */
  public getPolyTokenAddress = async (): Promise<string> => {
    return await this.getAddress({
      contractName: Contracts.PolyToken,
    });
  }

  /**
   * Gets the ModuleRegistry contract address
   * @return address string
   */
  public getModuleRegistryAddress = async (): Promise<string> => {
    return await this.getAddress({
      contractName: Contracts.ModuleRegistry,
    });
  }

  /**
   * Gets the FeatureRegistry contract address
   * @return address string
   */
  public getFeatureRegistryAddress = async (): Promise<string> => {
    return await this.getAddress({
      contractName: Contracts.FeatureRegistry,
    });
  }

  /**
   * Gets the SecurityTokenRegistry contract address
   * @return address string
   */
  public getSecurityTokenRegistryAddress = async (): Promise<string> => {
    return await this.getAddress({
      contractName: Contracts.SecurityTokenRegistry,
    });
  }

  /**
   * Gets the PolyUsdOracle contract address
   * @return address string
   */
  public getPolyUsdOracleAddress = async (): Promise<string> => {
    return await this.getAddress({
      contractName: Contracts.PolyUsdOracle,
    });
  }

  /**
   * Gets the EthUsdOracle contract address
   * @return address string
   */
  public getEthUsdOracleAddress = async (): Promise<string> => {
    return await this.getAddress({
      contractName: Contracts.EthUsdOracle,
    });
  }

  private async _getDefaultAddress(): Promise<string> {
    const networkId: NetworkId = <NetworkId> await this._web3Wrapper.getNetworkIdAsync();
    return AddressesUtils.getDefaultContractAddresses(networkId);
  }

  private async _getPolymathRegistryContract(): Promise<PolymathRegistryContract> {
    return new PolymathRegistryContract(
      this.abi,
      !_.isUndefined(this.address) ? this.address : await this._getDefaultAddress(),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
