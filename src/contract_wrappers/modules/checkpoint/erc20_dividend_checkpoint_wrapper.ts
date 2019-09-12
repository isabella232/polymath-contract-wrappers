import {
  ERC20DividendCheckpointContract_3_0_0,
  ERC20DividendCheckpointEventArgs_3_0_0,
  ERC20DividendCheckpointEvents_3_0_0,
  ERC20DividendCheckpointERC20DividendDepositedEventArgs_3_0_0,
  ERC20DividendCheckpointERC20DividendClaimedEventArgs_3_0_0,
  ERC20DividendCheckpointERC20DividendReclaimedEventArgs_3_0_0,
  ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs_3_0_0,
  ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs_3_0_0,
  ERC20DividendCheckpointSetWithholdingEventArgs_3_0_0,
  ERC20DividendCheckpointSetWithholdingFixedEventArgs_3_0_0,
  ERC20DetailedContract_3_0_0,
  BigNumber,
  LogWithDecodedArgs,
  Web3Wrapper,
  PolyResponse,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import DividendCheckpointWrapper from './dividend_checkpoint_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  Perm,
  ErrorCode,
  ContractVersion,
} from '../../../types';
import { numberToBigNumber, dateToBigNumber, stringToBytes32, valueToWei } from '../../../utils/convert';

interface ERC20DividendDepositedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.ERC20DividendDeposited;
  callback: EventCallback<ERC20DividendCheckpointERC20DividendDepositedEventArgs_3_0_0>;
}

interface GetERC20DividendDepositedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.ERC20DividendDeposited;
}

interface ERC20DividendClaimedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.ERC20DividendClaimed;
  callback: EventCallback<ERC20DividendCheckpointERC20DividendClaimedEventArgs_3_0_0>;
}

interface GetERC20DividendClaimedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.ERC20DividendClaimed;
}

interface ERC20DividendReclaimedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.ERC20DividendReclaimed;
  callback: EventCallback<ERC20DividendCheckpointERC20DividendReclaimedEventArgs_3_0_0>;
}

interface GetERC20DividendReclaimedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.ERC20DividendReclaimed;
}

interface ERC20DividendWithholdingWithdrawnSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.ERC20DividendWithholdingWithdrawn;
  callback: EventCallback<ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs_3_0_0>;
}

interface GetERC20DividendWithholdingWithdrawnLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.ERC20DividendWithholdingWithdrawn;
}

interface SetDefaultExcludedAddressesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.SetDefaultExcludedAddresses;
  callback: EventCallback<ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs_3_0_0>;
}

interface GetSetDefaultExcludedAddressesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.SetDefaultExcludedAddresses;
}

interface SetWithholdingSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.SetWithholding;
  callback: EventCallback<ERC20DividendCheckpointSetWithholdingEventArgs_3_0_0>;
}

interface GetSetWithholdingLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.SetWithholding;
}

interface SetWithholdingFixedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.SetWithholdingFixed;
  callback: EventCallback<ERC20DividendCheckpointSetWithholdingFixedEventArgs_3_0_0>;
}

interface GetSetWithholdingFixedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ERC20DividendCheckpointEvents_3_0_0.SetWithholdingFixed;
}

interface ERC20DividendCheckpointSubscribeAsyncParams extends Subscribe {
  (params: ERC20DividendDepositedSubscribeAsyncParams): Promise<string>;
  (params: ERC20DividendClaimedSubscribeAsyncParams): Promise<string>;
  (params: ERC20DividendReclaimedSubscribeAsyncParams): Promise<string>;
  (params: ERC20DividendWithholdingWithdrawnSubscribeAsyncParams): Promise<string>;
  (params: SetDefaultExcludedAddressesSubscribeAsyncParams): Promise<string>;
  (params: SetWithholdingSubscribeAsyncParams): Promise<string>;
  (params: SetWithholdingFixedSubscribeAsyncParams): Promise<string>;
}

interface GetERC20DividendCheckpointLogsAsyncParams extends GetLogs {
  (params: GetERC20DividendDepositedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendDepositedEventArgs_3_0_0>[]
  >;
  (params: GetERC20DividendClaimedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendClaimedEventArgs_3_0_0>[]
  >;
  (params: GetERC20DividendReclaimedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendReclaimedEventArgs_3_0_0>[]
  >;
  (params: GetERC20DividendWithholdingWithdrawnLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs_3_0_0>[]
  >;
  (params: GetSetDefaultExcludedAddressesLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs_3_0_0>[]
  >;
  (params: GetSetWithholdingLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointSetWithholdingEventArgs_3_0_0>[]
  >;
  (params: GetSetWithholdingFixedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ERC20DividendCheckpointSetWithholdingFixedEventArgs_3_0_0>[]
  >;
}

export namespace ERC20DividendCheckpointTransactionParams {
  export interface CreateDividend extends CreateDividendParams {}
  export interface CreateDividendWithCheckpoint extends CreateDividendWithCheckpointParams {}
  export interface CreateDividendWithExclusions extends CreateDividendWithExclusionsParams {}
  export interface CreateDividendWithCheckpointAndExclusions extends CreateDividendWithCheckpointAndExclusionsParams {}
}

/**
 * @param dividendIndex Index of the dividend
 */
interface DividendIndexParams {
  dividendIndex: number;
}

/**
 * @param maturity Time from which dividend can be paid
 * @param expiry Time until dividend can no longer be paid, and can be reclaimed by issuer
 * @param token Address of ERC20 token in which dividend is to be denominated
 * @param amount Amount of specified token for dividend
 * @param name Name/Title for identification
 */
interface CreateDividendParams extends TxParams {
  maturity: Date;
  expiry: Date;
  token: string;
  amount: BigNumber;
  name: string;
}

/**
 * @param checkpointId Checkpoint id from which to create dividends
 */
interface CreateDividendWithCheckpointParams extends CreateDividendParams {
  checkpointId: number;
}

/**
 * @param excluded List of addresses to exclude
 */
interface CreateDividendWithExclusionsParams extends CreateDividendParams {
  excluded: string[];
}

/**
 * @param checkpointId Checkpoint id from which to create dividends
 * @param excluded List of addresses to exclude
 */
interface CreateDividendWithCheckpointAndExclusionsParams extends CreateDividendParams {
  checkpointId: number;
  excluded: string[];
}

/**
 * This class includes the functionality related to interacting with the ERC20DividendCheckpoint contract.
 */
export default class ERC20DividendCheckpointWrapper extends DividendCheckpointWrapper {
  public contract: Promise<ERC20DividendCheckpointContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  public erc20DetailedContract = async (address: string): Promise<ERC20DetailedContract_3_0_0> => {
    return this.contractFactory.getERC20DetailedContract(address);
  };

  public getDecimals = async (dividendIndex: number): Promise<BigNumber> => {
    const token = await this.dividendTokens({
      dividendIndex,
    });
    const decimals = await (await this.erc20DetailedContract(token)).decimals.callAsync();
    return decimals;
  };

  /**
   * Instantiate ERC20DividendCheckpointWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ERC20DividendCheckpointContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Mapping to token address for each dividend
   */
  public dividendTokens = async (params: DividendIndexParams): Promise<string> => {
    return (await this.contract).dividendTokens.callAsync(numberToBigNumber(params.dividendIndex));
  };

  /**
   * Creates a dividend and checkpoint for the dividend
   */
  public createDividend = async (params: CreateDividendParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.checkIfDividendCreationIsValid(
      params.expiry,
      params.maturity,
      params.amount,
      params.name,
      params.token,
      params.txData,
    );
    const decimals = await (await this.erc20DetailedContract(params.token)).decimals.callAsync();
    return (await this.contract).createDividend.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.token,
      valueToWei(params.amount, decimals),
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Creates a dividend with a provided checkpoint
   */
  public createDividendWithCheckpoint = async (params: CreateDividendWithCheckpointParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.checkIfDividendCreationIsValid(
      params.expiry,
      params.maturity,
      params.amount,
      params.name,
      params.token,
      params.txData,
      params.checkpointId,
    );
    const decimals = await (await this.erc20DetailedContract(params.token)).decimals.callAsync();
    return (await this.contract).createDividendWithCheckpoint.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.token,
      valueToWei(params.amount, decimals),
      numberToBigNumber(params.checkpointId),
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Creates a dividend and checkpoint for the dividend with excluded addresses
   */
  public createDividendWithExclusions = async (params: CreateDividendWithExclusionsParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.checkIfDividendCreationIsValid(
      params.expiry,
      params.maturity,
      params.amount,
      params.name,
      params.token,
      params.txData,
      undefined,
      params.excluded,
    );
    const decimals = await (await this.erc20DetailedContract(params.token)).decimals.callAsync();
    return (await this.contract).createDividendWithExclusions.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.token,
      valueToWei(params.amount, decimals),
      params.excluded,
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Creates a dividend with a provided checkpoint and with excluded addresses
   */
  public createDividendWithCheckpointAndExclusions = async (
    params: CreateDividendWithCheckpointAndExclusionsParams,
  ): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    await this.checkIfDividendCreationIsValid(
      params.expiry,
      params.maturity,
      params.amount,
      params.name,
      params.token,
      params.txData,
      params.checkpointId,
      params.excluded,
    );
    const decimals = await (await this.erc20DetailedContract(params.token)).decimals.callAsync();
    return (await this.contract).createDividendWithCheckpointAndExclusions.sendTransactionAsync(
      dateToBigNumber(params.maturity),
      dateToBigNumber(params.expiry),
      params.token,
      valueToWei(params.amount, decimals),
      numberToBigNumber(params.checkpointId),
      params.excluded,
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: ERC20DividendCheckpointSubscribeAsyncParams = async <
    ArgsType extends ERC20DividendCheckpointEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DividendCheckpointEvents_3_0_0);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = await this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetERC20DividendCheckpointLogsAsyncParams = async <
    ArgsType extends ERC20DividendCheckpointEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DividendCheckpointEvents_3_0_0);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
    );
    return logs;
  };
}
