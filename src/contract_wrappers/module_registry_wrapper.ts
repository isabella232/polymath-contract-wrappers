import { ModuleRegistryContract } from 'polymath-abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { ModuleRegistry } from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { IModulesByTypeAndToken } from '../types';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the ModuleRegistry contract.
 */
export class ModuleRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = ModuleRegistry.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private moduleRegistryContract: Promise<ModuleRegistryContract>;
  /**
   * Instantiate ModuleRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param networkId Desired networkId
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
    this.moduleRegistryContract = this._getModuleRegistryContract();
  }

  /**
   * Returns the contract address
   */
  public async address(): Promise<string> {
    return (await this.moduleRegistryContract).address;
  }

  /**
   * Returns the list of available Module factory addresses of a particular type for a given token.
   * @return address array that contains the list of available addresses of module factory contracts.
   */
  public async getModulesByTypeAndToken(params: IModulesByTypeAndToken): Promise<string[]> {
    return await (await this.moduleRegistryContract).getModulesByTypeAndToken.callAsync(
      params.moduleType,
      params.securityToken,
    );
  }

  private async _getModuleRegistryContract(): Promise<ModuleRegistryContract> {
    return new ModuleRegistryContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'ModuleRegistry',
      }),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
  }
}
