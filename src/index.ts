import {
  PolymathRegistry,
  SecurityToken,
  SecurityTokenRegistry,
  PolyToken,
  ModuleRegistry,
  CappedSTO,
  CappedSTOFactory,
  ModuleFactory,
  USDTieredSTO,
  USDTieredSTOFactory,
  FeatureRegistry,
} from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Provider } from 'ethereum-types';
import { PolymathRegistryWrapper } from './contract_wrappers/polymath_registry_wrapper';
import { SecurityTokenWrapper } from './contract_wrappers/security_token_wrapper';
import { SecurityTokenRegistryWrapper } from './contract_wrappers/security_token_registry_wrapper';
import { PolyTokenWrapper } from './contract_wrappers/poly_token_wrapper';
import { ModuleRegistryWrapper } from './contract_wrappers/module_registry_wrapper';
import { CappedSTOWrapper } from './contract_wrappers/capped_sto_wrapper';
import { CappedSTOFactoryWrapper } from './contract_wrappers/capped_sto_factory_wrapper';
import { ModuleFactoryWrapper } from './contract_wrappers/module_factory_wrapper';
import { USDTieredSTOWrapper } from './contract_wrappers/usd_tiered_sto_wrapper';
import { USDTieredSTOFactoryWrapper } from './contract_wrappers/usd_tiered_sto_factory_wrapper';
import { FeatureRegistryWrapper } from './contract_wrappers/feature_registry_wrapper';
import * as types from './types';
import { assert } from './utils/assert';
import { _getDefaultContractAddresses } from './addresses';
import * as _ from 'lodash';

export * from './types';

/**
 * The PolymathAPI class contains smart contract wrappers helpful to interact with Polymath ecosystem.
 */
export class PolymathAPI {
    /**
     * An instance of the PolymathRegistryWrapper class containing methods
     * for interacting with PolymathRegistry smart contract.
     */
    public polymathRegistry: PolymathRegistryWrapper;
    /**
     * An instance of the SecurityTokenWrapper class containing methods
     * for interacting with SecurityToken smart contract.
     */
    public securityToken: SecurityTokenWrapper;
    /**
     * An instance of the SecurityTokenRegistryWrapper class containing methods
     * for interacting with SecurityTokenRegistry smart contract.
     */
    public securityTokenRegistry: SecurityTokenRegistryWrapper;
    /**
     * An instance of the PolyTokenWrapper class containing methods
     * for interacting with PolyToken smart contract.
     */
    public polyToken: PolyTokenWrapper;
    /**
     * An instance of the ModuleRegistryWrapper class containing methods
     * for interacting with ModuleRegistry smart contract.
     */
    public moduleRegistry: ModuleRegistryWrapper;
    /**
     * An instance of the CappedSTOWrapper class containing methods
     * for interacting with CappedSTO smart contract.
     */
    public cappedSTO: CappedSTOWrapper;
    /**
     * An instance of the CappedSTOFactoryWrapper class containing methods
     * for interacting with CappedSTOFactory smart contract.
     */
    public cappedSTOFactory: CappedSTOFactoryWrapper;
    /**
     * An instance of the ModuleFactoryWrapper class containing methods
     * for interacting with ModuleFactory smart contract.
     */
    public moduleFactory: ModuleFactoryWrapper;
    /**
     * An instance of the USDTieredSTOWrapper class containing methods
     * for interacting with USDTieredSTO smart contract.
     */
    public usdTieredSTO: USDTieredSTOWrapper;
    /**
     * An instance of the USDTieredSTOFactoryWrapper class containing methods
     * for interacting with USDTieredSTOFactory smart contract.
     */
    public usdTieredSTOFactory: USDTieredSTOFactoryWrapper;
    /**
     * An instance of the FeatureRegistryWrapper class containing methods
     * for interacting with FeatureRegistry smart contract.
     */
    public featureRegistry: FeatureRegistryWrapper;

    private readonly web3Wrapper: Web3Wrapper;

    /**
     * Instantiates a new PolymathAPI instance.
     * @return  An instance of the PolymathAPI class.
     */
    constructor(params: types.IApiConstructor) {
      assert.isWeb3Provider('provider', params.dataProvider);

      this.web3Wrapper = new Web3Wrapper(
        params.dataProvider,
      );

      const artifactsArray = [
        PolymathRegistry,
        SecurityToken,
        SecurityTokenRegistry,
        PolyToken,
        ModuleRegistry,
        CappedSTO,
        CappedSTOFactory,
        ModuleFactory,
        USDTieredSTO,
        USDTieredSTOFactory,
        FeatureRegistry,
      ];

      _.forEach(artifactsArray, artifact => { // tslint:disable-line
        this.web3Wrapper.abiDecoder.addABI((artifact as any).abi);
      });

      this.polymathRegistry = new PolymathRegistryWrapper(
        this.web3Wrapper,
        params.polymathRegistryAddress,
      );
      this.securityToken = new SecurityTokenWrapper(
        this.web3Wrapper,
        this.polymathRegistry,
      );
      this.securityTokenRegistry = new SecurityTokenRegistryWrapper(
        this.web3Wrapper,
        this.polymathRegistry,
      );
      this.polyToken = new PolyTokenWrapper(
        this.web3Wrapper,
        this.polymathRegistry,
      );
      this.moduleRegistry = new ModuleRegistryWrapper(
        this.web3Wrapper,
        this.polymathRegistry,
      );
      this.cappedSTO = new CappedSTOWrapper(
        this.web3Wrapper,
        this.polymathRegistry,
      );
      this.cappedSTOFactory = new CappedSTOFactoryWrapper(
        this.web3Wrapper,
        this.polymathRegistry,
      );
      this.moduleFactory = new ModuleFactoryWrapper(
        this.web3Wrapper,
        this.polymathRegistry,
      );
      this.usdTieredSTO = new USDTieredSTOWrapper(
        this.web3Wrapper,
        this.polymathRegistry,
      );
      this.usdTieredSTOFactory = new USDTieredSTOFactoryWrapper(
        this.web3Wrapper,
        this.polymathRegistry,
      );
      this.featureRegistry = new FeatureRegistryWrapper(
        this.web3Wrapper,
        this.polymathRegistry,
      );
    }

    /**
     * Get the account currently used by PolymathAPI
     * @return Address string
     */
    public async getAccount(): Promise<string | undefined> {
      if (!_.isUndefined(this.web3Wrapper)) {
        return (await this.web3Wrapper.getAvailableAddressesAsync())[0];
      } else {
        return undefined;
      }
    }

    /**
     * Is it Testnet network?
     */
    public async isTestnet(): Promise<boolean> {
      return await this.web3Wrapper.getNetworkIdAsync() !== 1;
    }

}
