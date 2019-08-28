import {
  CappedSTOContract,
  CappedSTOEventArgs,
  CappedSTOEvents,
  CappedSTOTokenPurchaseEventArgs,
  CappedSTOSetAllowBeneficialInvestmentsEventArgs,
  CappedSTOSetFundRaiseTypesEventArgs,
  CappedSTOPauseEventArgs,
  CappedSTOUnpauseEventArgs,
  Web3Wrapper,
  LogWithDecodedArgs,
  BigNumber,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import STOWrapper from './sto_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  TxParams,
  Subscribe,
  GetLogs,
  FundRaiseType,
  FULL_DECIMALS,
} from '../../../types';
import { bigNumberToDate, valueToWei, weiToValue } from '../../../utils/convert';
import functionsUtils from '../../../utils/functions_utils';

interface TokenPurchaseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents.TokenPurchase;
  callback: EventCallback<CappedSTOTokenPurchaseEventArgs>;
}

interface GetTokenPurchaseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents.TokenPurchase;
}

interface SetAllowBeneficialInvestmentsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents.SetAllowBeneficialInvestments;
  callback: EventCallback<CappedSTOSetAllowBeneficialInvestmentsEventArgs>;
}

interface GetSetAllowBeneficialInvestmentsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents.SetAllowBeneficialInvestments;
}

interface SetFundRaiseTypesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents.SetFundRaiseTypes;
  callback: EventCallback<CappedSTOSetFundRaiseTypesEventArgs>;
}

interface GetSetFundRaiseTypesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents.SetFundRaiseTypes;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents.Pause;
  callback: EventCallback<CappedSTOPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents.Unpause;
  callback: EventCallback<CappedSTOUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents.Unpause;
}

interface CappedSTOSubscribeAsyncParams extends Subscribe {
  (params: TokenPurchaseSubscribeAsyncParams): Promise<string>;
  (params: SetAllowBeneficialInvestmentsSubscribeAsyncParams): Promise<string>;
  (params: SetFundRaiseTypesSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetCappedSTOLogsAsyncParams extends GetLogs {
  (params: GetTokenPurchaseLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOTokenPurchaseEventArgs>[]>;
  (params: GetSetAllowBeneficialInvestmentsLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTOSetAllowBeneficialInvestmentsEventArgs>[]
  >;
  (params: GetSetFundRaiseTypesLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOSetFundRaiseTypesEventArgs>[]>;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOUnpauseEventArgs>[]>;
}

export namespace CappedSTOTransactionParams {
  export interface ChangeAllowBeneficialInvestments extends ChangeAllowBeneficialInvestmentsParams {}
  export interface BuyTokens extends BuyTokensParams {}
  export interface BuyTokensWithPoly extends BuyTokensWithPolyParams {}
}

interface InvestorsParams extends TxParams {
  investorAddress: string;
}

interface ChangeAllowBeneficialInvestmentsParams extends TxParams {
  allowBeneficialInvestments: boolean;
}

interface BuyTokensParams extends TxParams {
  beneficiary: string;
  value: BigNumber;
}

interface BuyTokensWithPolyParams extends TxParams {
  investedPOLY: BigNumber;
}

// // Return types ////
interface CappedSTODetails {
  /** Timestamp at which offering gets start. */
  startTime: Date;
  /** Timestamp at which offering ends. */
  endTime: Date;
  /** Number of token base units this STO will be allowed to sell to investors. */
  cap: BigNumber;
  /** Token units a buyer gets(multiplied by 10^18) per wei / base unit of POLY */
  rate: BigNumber;
  /** Amount of funds raised */
  fundsRaised: BigNumber;
  /** Number of individual investors this STO have. */
  investorCount: number;
  /** Amount of tokens get sold. */
  totalTokensSold: BigNumber;
  /** Boolean value to justify whether the fund raise type is POLY or not, i.e true for POLY. */
  isRaisedInPoly: boolean;
}
// // End of return types ////

/**
 * This class includes the functionality related to interacting with the CappedSTO contract.
 */
export default class CappedSTOWrapper extends STOWrapper {
  protected contract: Promise<CappedSTOContract>;

  /**
   * Instantiate CappedSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<CappedSTOContract>, contractFactory: ContractFactory) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * How many token units a buyer gets (multiplied by 10^18) per wei / base unit of POLY
   */
  public rate = async () => {
    return weiToValue(await (await this.contract).rate.callAsync(), FULL_DECIMALS);
  };

  /**
   * How many token base units this STO will be allowed to sell to investors
   */
  public cap = async () => {
    return weiToValue(
      await (await this.contract).cap.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  public allowBeneficialInvestments = async () => {
    return (await this.contract).allowBeneficialInvestments.callAsync();
  };

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public investors = async (params: InvestorsParams) => {
    return (await this.contract).investors.callAsync(params.investorAddress);
  };

  public changeAllowBeneficialInvestments = async (params: ChangeAllowBeneficialInvestmentsParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    assert.assert(
      (await this.allowBeneficialInvestments()) !== params.allowBeneficialInvestments,
      'Does not change value',
    );
    return (await this.contract).changeAllowBeneficialInvestments.sendTransactionAsync(
      params.allowBeneficialInvestments,
      params.txData,
      params.safetyFactor,
    );
  };

  public buyTokens = async (params: BuyTokensParams) => {
    assert.isNonZeroETHAddressHex('beneficiary', params.beneficiary);
    assert.assert(!(await this.paused()), 'Should not be paused');
    assert.isBigNumberGreaterThanZero(params.value, 'Amount invested should not be equal to 0');
    const weiBalance = await this.web3Wrapper.getBalanceInWeiAsync(await this.getCallerAddress(params.txData));
    assert.assert(weiBalance.isGreaterThan(valueToWei(params.value, FULL_DECIMALS)), 'Insufficient ETH funds');
    assert.assert(
      await this.fundRaiseTypes({
        type: FundRaiseType.ETH,
      }),
      'Mode of investment is not ETH',
    );
    if (await this.allowBeneficialInvestments()) {
      assert.assert(
        functionsUtils.checksumAddressComparision(params.beneficiary, await this.getCallerAddress(params.txData)),
        'Beneficiary address does not match msg.sender',
      );
    }
    assert.isPastDate(bigNumberToDate(await this.startTime()), 'Offering is not yet started');
    assert.isFutureDate(bigNumberToDate(await this.endTime()), 'Offering is closed');
    const txPayableData = {
      ...params.txData,
      value: valueToWei(params.value, FULL_DECIMALS),
    };
    return (await this.contract).buyTokens.sendTransactionAsync(params.beneficiary, txPayableData, params.safetyFactor);
  };

  public buyTokensWithPoly = async (params: BuyTokensWithPolyParams) => {
    assert.isBigNumberGreaterThanZero(params.investedPOLY, 'Amount invested should not be equal to 0');
    assert.assert(!(await this.paused()), 'Should not be paused');
    assert.assert(
      await this.fundRaiseTypes({
        type: FundRaiseType.POLY,
      }),
      'Mode of investment is not POLY',
    );
    const polyTokenBalance = await (await this.polyTokenContract()).balanceOf.callAsync(
      await this.getCallerAddress(params.txData),
    );
    assert.assert(
      polyTokenBalance.isGreaterThanOrEqualTo(valueToWei(params.investedPOLY, FULL_DECIMALS)),
      'Budget less than amount unable to transfer fee',
    );
    assert.isPastDate(bigNumberToDate(await this.startTime()), 'Offering is not yet started');
    assert.isFutureDate(bigNumberToDate(await this.endTime()), 'Offering is closed');
    return (await this.contract).buyTokensWithPoly.sendTransactionAsync(
      valueToWei(params.investedPOLY, FULL_DECIMALS),
      params.txData,
      params.safetyFactor,
    );
  };

  public capReached = async () => {
    return (await this.contract).capReached.callAsync();
  };

  public getTokensSold = async () => {
    return weiToValue(
      await (await this.contract).getTokensSold.callAsync(),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  public getSTODetails = async () => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const result = await (await this.contract).getSTODetails.callAsync();
    const typedResult: CappedSTODetails = {
      startTime: bigNumberToDate(result[0]),
      endTime: bigNumberToDate(result[1]),
      cap: weiToValue(result[2], decimals),
      rate: weiToValue(result[3], FULL_DECIMALS),
      fundsRaised: weiToValue(result[3], FULL_DECIMALS),
      investorCount: new BigNumber(result[5]).toNumber(),
      totalTokensSold: weiToValue(result[6], decimals),
      isRaisedInPoly: result[7],
    };
    return typedResult;
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: CappedSTOSubscribeAsyncParams = async <ArgsType extends CappedSTOEventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents);
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
  public getLogsAsync: GetCappedSTOLogsAsyncParams = async <ArgsType extends CappedSTOEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents);
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
