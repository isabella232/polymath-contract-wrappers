import {
  ModuleFactoryContract,
  ModuleFactoryEventArgs,
  ModuleFactoryEvents,
  ModuleFactoryOwnershipRenouncedEventArgs,
  ModuleFactoryOwnershipTransferredEventArgs,
  ModuleFactoryChangeFactorySetupFeeEventArgs,
  ModuleFactoryChangeFactoryUsageFeeEventArgs,
  ModuleFactoryChangeFactorySubscriptionFeeEventArgs,
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
import { weiToValue, bytes32ToString } from '../../utils/convert';

interface OwnershipRenouncedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleFactoryEvents.OwnershipRenounced;
  callback: EventCallback<ModuleFactoryOwnershipRenouncedEventArgs>;
}

interface GetOwnershipRenouncedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleFactoryEvents.OwnershipRenounced;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleFactoryEvents.OwnershipTransferred;
  callback: EventCallback<ModuleFactoryOwnershipTransferredEventArgs>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleFactoryEvents.OwnershipTransferred;
}

interface ChangeFactorySetupFeeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleFactoryEvents.ChangeFactorySetupFee;
  callback: EventCallback<ModuleFactoryChangeFactorySetupFeeEventArgs>;
}

interface GetChangeFactorySetupFeeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleFactoryEvents.ChangeFactorySetupFee;
}

interface ChangeFactoryUsageFeeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleFactoryEvents.ChangeFactoryUsageFee;
  callback: EventCallback<ModuleFactoryChangeFactoryUsageFeeEventArgs>;
}

interface GetChangeFactoryUsageFeeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleFactoryEvents.ChangeFactoryUsageFee;
}

interface ChangeFactorySubscriptionFeeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleFactoryEvents.ChangeFactorySubscriptionFee;
  callback: EventCallback<ModuleFactoryChangeFactorySubscriptionFeeEventArgs>;
}

interface GetChangeFactorySubscriptionFeeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleFactoryEvents.ChangeFactorySubscriptionFee;
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
  (params: OwnershipRenouncedSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
  (params: ChangeFactorySetupFeeSubscribeAsyncParams): Promise<string>;
  (params: ChangeFactoryUsageFeeSubscribeAsyncParams): Promise<string>;
  (params: ChangeFactorySubscriptionFeeSubscribeAsyncParams): Promise<string>;
  (params: GenerateModuleFromFactorySubscribeAsyncParams): Promise<string>;
  (params: ChangeSTVersionBoundSubscribeAsyncParams): Promise<string>;
}

interface GetModuleFactoryLogsAsyncParams extends GetLogs {
  (params: GetOwnershipRenouncedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ModuleFactoryOwnershipRenouncedEventArgs>[]
  >;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<ModuleFactoryOwnershipTransferredEventArgs>[]
  >;
  (params: GetChangeFactorySetupFeeLogsAsyncParams): Promise<
    LogWithDecodedArgs<ModuleFactoryChangeFactorySetupFeeEventArgs>[]
  >;
  (params: GetChangeFactoryUsageFeeLogsAsyncParams): Promise<
    LogWithDecodedArgs<ModuleFactoryChangeFactoryUsageFeeEventArgs>[]
  >;
  (params: GetChangeFactorySubscriptionFeeLogsAsyncParams): Promise<
    LogWithDecodedArgs<ModuleFactoryChangeFactorySubscriptionFeeEventArgs>[]
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
    const name = await (await this.contract).name.callAsync();
    return bytes32ToString(name);
  };

  /**
   * Get the version of the Module
   */
  public version = async (): Promise<string> => {
    return (await this.contract).version.callAsync();
  }

  /**
   * Get setup cost
   */
  public getSetupCost = async (): Promise<BigNumber> => {
    const value = await (await this.contract).getSetupCost.callAsync();
    return weiToValue(value, FULL_DECIMALS);
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: ModuleFactorySubscribeAsyncParams = async <ArgsType extends ModuleFactoryEventArgs>(
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
  public getLogsAsync: GetModuleFactoryLogsAsyncParams = async <ArgsType extends ModuleFactoryEventArgs>(
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
