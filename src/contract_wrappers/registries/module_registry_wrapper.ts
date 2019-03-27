import {
  ModuleRegistryContract,
  ModuleRegistryEventArgs,
  ModuleRegistryEvents,
  ModuleRegistryPauseEventArgs,
  ModuleRegistryUnpauseEventArgs,
  ModuleRegistryModuleUsedEventArgs,
  ModuleRegistryModuleRegisteredEventArgs,
  ModuleRegistryModuleVerifiedEventArgs,
  ModuleRegistryModuleRemovedEventArgs,
  ModuleRegistryOwnershipTransferredEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { ModuleRegistry } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import { ContractWrapper } from '../contract_wrapper';
import {
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
  TxPayableParams,
  TxParams,
} from '../../types';
import { assert } from '../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { BigNumber } from '@0x/utils';

interface IPauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.Pause,
  callback: EventCallback<ModuleRegistryPauseEventArgs>,
}

interface IGetPauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.Pause,
}

interface IUnpauseSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.Unpause,
  callback: EventCallback<ModuleRegistryUnpauseEventArgs>,
}

interface IGetUnpauseLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.Unpause,
}

interface IModuleUsedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.ModuleUsed,
  callback: EventCallback<ModuleRegistryModuleUsedEventArgs>,
}

interface IGetModuleUsedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.ModuleUsed,
}

interface IModuleRegisteredSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.ModuleRegistered,
  callback: EventCallback<ModuleRegistryModuleRegisteredEventArgs>,
}

interface IGetModuleRegisteredLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.ModuleRegistered,
}

interface IModuleVerifiedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.ModuleVerified,
  callback: EventCallback<ModuleRegistryModuleVerifiedEventArgs>,
}

interface IGetModuleVerifiedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.ModuleVerified,
}

interface IModuleRemovedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.ModuleRemoved,
  callback: EventCallback<ModuleRegistryModuleRemovedEventArgs>,
}

interface IGetModuleRemovedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.ModuleRemoved,
}

interface IOwnershipTransferredSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: ModuleRegistryEvents.OwnershipTransferred,
  callback: EventCallback<ModuleRegistryOwnershipTransferredEventArgs>,
}

interface IGetOwnershipTransferredLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: ModuleRegistryEvents.OwnershipTransferred,
}

interface IModuleRegistrySubscribeAsyncParams {
  (params: IPauseSubscribeAsyncParams): Promise<string>,
  (params: IUnpauseSubscribeAsyncParams): Promise<string>,
  (params: IModuleUsedSubscribeAsyncParams): Promise<string>,
  (params: IModuleRegisteredSubscribeAsyncParams): Promise<string>,
  (params: IModuleVerifiedSubscribeAsyncParams): Promise<string>,
  (params: IModuleRemovedSubscribeAsyncParams): Promise<string>,
  (params: IOwnershipTransferredSubscribeAsyncParams): Promise<string>,
}

interface IGetModuleRegistryLogsAsyncParams {
  (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryPauseEventArgs>>>,
  (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryUnpauseEventArgs>>>,
  (params: IGetModuleUsedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryModuleUsedEventArgs>>>,
  (params: IGetModuleRegisteredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryModuleRegisteredEventArgs>>>,
  (params: IGetModuleVerifiedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryModuleVerifiedEventArgs>>>,
  (params: IGetModuleRemovedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryModuleRemovedEventArgs>>>,
  (params: IGetOwnershipTransferredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ModuleRegistryOwnershipTransferredEventArgs>>>,
}

interface GetValueByVariableParams {
  variable: string,
}

interface GetValueByKeyParams {
  key: string,
}

interface InitializeParams extends TxPayableParams {
  polymathRegistry: string,
  owner: string,
}

interface ModuleFactoryParams extends TxParams {
  moduleFactory: string,
}

interface VerifyModuleParams extends TxParams {
  moduleFactory: string,
  verified: boolean,
}

interface GetTagsByTypeAndTokenParams {
  moduleType: number|BigNumber,
  securityToken: string,
}

interface ModuleTypeParams {
  moduleType: number,
}

/**
 * @param moduleType is the module type to look for
 * @param securityToken is the address of SecurityToken
 */
interface GetModulesByTypeAndTokenParams {
  moduleType: number|BigNumber,
  securityToken: string,
}

interface ReclaimERC20Params extends TxParams {
  tokenContract: string,
}

interface TransferOwnershipParams extends TxParams {
  newOwner: string,
}

/**
 * This class includes the functionality related to interacting with the ModuleRegistry contract.
 */
export class ModuleRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = ModuleRegistry.abi;
  protected _contract: Promise<ModuleRegistryContract>;
  private _polymathRegistry: PolymathRegistryWrapper;

  /**
   * Instantiate ModuleRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this._polymathRegistry = polymathRegistry;
    this._contract = this._getModuleRegistryContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this._contract).address;
  }

  public getBytes32Value = async (params: GetValueByVariableParams): Promise<string> => {
    return await (await this._contract).getBytes32Value.callAsync(
      params.variable,
    )
  }

  public getBytesValue = async (params: GetValueByVariableParams): Promise<string> => {
    return await (await this._contract).getBytesValue.callAsync(
      params.variable,
    )
  }

  public getAddressValue = async (params: GetValueByVariableParams): Promise<string> => {
    return await (await this._contract).getAddressValue.callAsync(
      params.variable,
    )
  }

  public getArrayAddress = async (params: GetValueByKeyParams): Promise<string[]> => {
    return await (await this._contract).getArrayAddress.callAsync(
      params.key,
    )
  }

  public getBoolValue = async (params: GetValueByVariableParams): Promise<boolean> => {
    return await (await this._contract).getBoolValue.callAsync(
      params.variable,
    )
  }

  public getStringValue = async (params: GetValueByVariableParams): Promise<string> => {
    return await (await this._contract).getStringValue.callAsync(
      params.variable,
    )
  }

  public getArrayBytes32 = async (params: GetValueByKeyParams): Promise<string[]> => {
    return await (await this._contract).getArrayBytes32.callAsync(
      params.key,
    )
  }
  
  public getUintValue = async (params: GetValueByVariableParams): Promise<BigNumber> => {
    return await (await this._contract).getUintValue.callAsync(
      params.variable,
    )
  }

  public getArrayUint = async (params: GetValueByKeyParams): Promise<BigNumber[]> => {
    return await (await this._contract).getArrayUint.callAsync(
      params.key,
    )
  }

  public initialize = async (params: InitializeParams) => {
    return async () => {
      return (await this._contract).initialize.sendTransactionAsync(
        params.polymathRegistry,
        params.owner,
        params.txData,
        params.safetyFactor,
      );
    }
  }

  public useModule = async (params: ModuleFactoryParams) => {
    return async () => {
      return (await this._contract).useModule.sendTransactionAsync(
        params.moduleFactory,
        params.txData,
        params.safetyFactor,
      );
    }
  }

  public registerModule = async (params: ModuleFactoryParams) => {
    return async () => {
      return (await this._contract).registerModule.sendTransactionAsync(
        params.moduleFactory,
        params.txData,
        params.safetyFactor,
      );
    }
  }

  public removeModule = async (params: ModuleFactoryParams) => {
    return async () => {
      return (await this._contract).removeModule.sendTransactionAsync(
        params.moduleFactory,
        params.txData,
        params.safetyFactor,
      );
    }
  }

  public verifyModule = async (params: VerifyModuleParams) => {
    return async () => {
      return (await this._contract).verifyModule.sendTransactionAsync(
        params.moduleFactory,
        params.verified,
        params.txData,
        params.safetyFactor,
      );
    }
  }

  public getTagsByTypeAndToken = async (params: GetTagsByTypeAndTokenParams): Promise<[string[], string[]]> => {
    return await (await this._contract).getTagsByTypeAndToken.callAsync(
      params.moduleType,
      params.securityToken,
    )
  }

  public getTagsByType = async (params: ModuleTypeParams): Promise<[string[], string[]]> => {
    return await (await this._contract).getTagsByType.callAsync(
      params.moduleType,
    )
  }

  public getReputationByFactory = async (params: ModuleFactoryParams): Promise<string[]> => {
    return await (await this._contract).getReputationByFactory.callAsync(
      params.moduleFactory,
    )
  }

  public getModulesByType = async (params: ModuleTypeParams): Promise<string[]> => {
    return await (await this._contract).getModulesByType.callAsync(
      params.moduleType,
    )
  }

  /**
   * Returns the list of available Module factory addresses of a particular type for a given token.
   * @return address array that contains the list of available addresses of module factory contracts.
   */
  public getModulesByTypeAndToken = async (params: GetModulesByTypeAndTokenParams): Promise<string[]> => {
    return await (await this._contract).getModulesByTypeAndToken.callAsync(
      params.moduleType,
      params.securityToken,
    )
  }

  public reclaimERC20 = async (params: ReclaimERC20Params) => {
    return async () => {
      return (await this._contract).reclaimERC20.sendTransactionAsync(
        params.tokenContract,
        params.txData,
        params.safetyFactor,
      );
    }
  }

  public pause = async (params: TxParams) => {
    return async () => {
      return (await this._contract).pause.sendTransactionAsync(
        params.txData,
        params.safetyFactor,
      );
    }
  }

  public unpause = async (params: TxParams) => {
    return async () => {
      return (await this._contract).unpause.sendTransactionAsync(
        params.txData,
        params.safetyFactor,
      );
    }
  }

  public updateFromRegistry = async (params: TxParams) => {
    return async () => {
      return (await this._contract).updateFromRegistry.sendTransactionAsync(
        params.txData,
        params.safetyFactor,
      );
    }
  }

  public transferOwnership = async (params: TransferOwnershipParams) => {
    return async () => {
      return (await this._contract).transferOwnership.sendTransactionAsync(
        params.newOwner,
        params.txData,
        params.safetyFactor,
      );
    }
  }

  public owner = async (): Promise<string> => {
    return await (await this._contract).owner.callAsync()
  }

  public isPaused = async (): Promise<boolean> => {
    return await (await this._contract).isPaused.callAsync()
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: IModuleRegistrySubscribeAsyncParams = async <ArgsType extends ModuleRegistryEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleRegistryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        ModuleRegistry.abi,
        params.callback,
        !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Cancel a subscription
   * @param subscriptionToken Subscription token returned by `subscribe()`
   */
  public unsubscribe = (subscriptionToken: string): void => {
    assert.isValidSubscriptionToken('subscriptionToken', subscriptionToken);
    this._unsubscribe(subscriptionToken);
  }

  /**
   * Cancels all existing subscriptions
   */
  public unsubscribeAll = (): void => {
    super._unsubscribeAll();
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetModuleRegistryLogsAsyncParams = async <ArgsType extends ModuleRegistryEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleRegistryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        ModuleRegistry.abi,
    );
    return logs;
  }

  private async _getModuleRegistryContract(): Promise<ModuleRegistryContract> {
    return new ModuleRegistryContract(
      this.abi,
      await this._polymathRegistry.getModuleRegistryAddress(),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}