import {
  ModuleFactoryContract,
  ModuleFactoryEventArgs,
  ModuleFactoryEvents,
  ModuleFactoryOwnershipTransferredEventArgs,
  ModuleFactoryGenerateModuleFromFactoryEventArgs,
  ModuleFactoryChangeSTVersionBoundEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { BigNumber } from '@0x/utils';
import { ModuleFactory } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { schemas } from '@0x/json-schemas';
import assert from '../../utils/assert';
import ContractWrapper from '../contract_wrapper';
import {
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  FULL_DECIMALS,
} from '../../types';
import { weiToValue } from '../../utils/convert';

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleFactoryEvents.OwnershipTransferred;
  callback: EventCallback<ModuleFactoryOwnershipTransferredEventArgs>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleFactoryEvents.OwnershipTransferred;
}

interface GenerateModuleFromFactorySubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleFactoryEvents.GenerateModuleFromFactory;
  callback: EventCallback<ModuleFactoryGenerateModuleFromFactoryEventArgs>;
}

interface GetGenerateModuleFromFactoryLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleFactoryEvents.GenerateModuleFromFactory;
}

interface ChangeSTVersionBoundSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleFactoryEvents.ChangeSTVersionBound;
  callback: EventCallback<ModuleFactoryChangeSTVersionBoundEventArgs>;
}

interface GetChangeSTVersionBoundLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleFactoryEvents.ChangeSTVersionBound;
}

interface ModuleFactorySubscribeAsyncParams extends Subscribe {
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
  (params: GenerateModuleFromFactorySubscribeAsyncParams): Promise<string>;
  (params: ChangeSTVersionBoundSubscribeAsyncParams): Promise<string>;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<ModuleFactoryOwnershipTransferredEventArgs>[]
  >;
  (params: GetGenerateModuleFromFactoryLogsAsyncParams): Promise<
    LogWithDecodedArgs<ModuleFactoryGenerateModuleFromFactoryEventArgs>[]
  >;
  (params: GetChangeSTVersionBoundLogsAsyncParams): Promise<
    LogWithDecodedArgs<ModuleFactoryChangeSTVersionBoundEventArgs>[]
  >;
}

/**
 * This class includes the functionality related to interacting with the ModuleFactory contract.
 */
export default class ModuleFactoryWrapper extends ContractWrapper {
  public abi: ContractAbi = ModuleFactory.abi;

  protected contract: Promise<ModuleFactoryContract>;

  /**
   * Instantiate ModuleFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<ModuleFactoryContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Get the name of the Module
   */
  public name = async (): Promise<string> => {
    return (await this.contract).name.callAsync();
  };

  /**
   * Get setup cost
   */
  public setupCostInPoly = async (): Promise<BigNumber> => {
    const value = await (await this.contract).setupCostInPoly.callAsync();
    return weiToValue(value, FULL_DECIMALS);
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: Subscribe = async <ArgsType extends ModuleFactoryEventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleFactoryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      ModuleFactory.abi,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetLogs = async <ArgsType extends ModuleFactoryEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleFactoryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      ModuleFactory.abi,
    );
    return logs;
  };
}
