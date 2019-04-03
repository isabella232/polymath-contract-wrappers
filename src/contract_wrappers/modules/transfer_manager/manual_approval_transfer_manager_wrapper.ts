import {
    ManualApprovalTransferManagerContract,
    ManualApprovalTransferManagerEventArgs,
    ManualApprovalTransferManagerEvents,
    ManualApprovalTransferManagerAddManualApprovalEventArgs,
    ManualApprovalTransferManagerModifyManualApprovalEventArgs,
    ManualApprovalTransferManagerRevokeManualApprovalEventArgs,
    ManualApprovalTransferManagerPauseEventArgs,
    ManualApprovalTransferManagerUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { ManualApprovalTransferManager } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import {
    TxParams,
    IGetLogsAsyncParams,
    ISubscribeAsyncParams,
    EventCallback,
    ISubscribe,
    IGetLogs
} from '../../../types';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { ModuleWrapper } from '../module_wrapper';
  
  interface IAddManualApprovalSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.AddManualApproval,
    callback: EventCallback<ManualApprovalTransferManagerAddManualApprovalEventArgs>,
  }
  
  interface IGetAddManualApprovalLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.AddManualApproval,
  }

  interface IModifyManualApprovalSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.ModifyManualApproval,
    callback: EventCallback<ManualApprovalTransferManagerModifyManualApprovalEventArgs>,
  }
  
  interface IGetModifyManualApprovalLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.ModifyManualApproval,
  }

  interface IRevokeManualApprovalSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.RevokeManualApproval,
    callback: EventCallback<ManualApprovalTransferManagerRevokeManualApprovalEventArgs>,
  }
  
  interface IGetRevokeManualApprovalLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.RevokeManualApproval,
  }

  interface IPauseSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.Pause,
    callback: EventCallback<ManualApprovalTransferManagerPauseEventArgs>,
  }
  
  interface IGetPauseLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.Pause,
  }

  interface IUnpauseSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.Unpause,
    callback: EventCallback<ManualApprovalTransferManagerUnpauseEventArgs>,
  }
  
  interface IGetUnpauseLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.Unpause,
  }

  interface IManualApprovalTransferManagerSubscribeAsyncParams extends ISubscribe {
    (params: IAddManualApprovalSubscribeAsyncParams): Promise<string>,
    (params: IModifyManualApprovalSubscribeAsyncParams): Promise<string>,
    (params: IRevokeManualApprovalSubscribeAsyncParams): Promise<string>,
    (params: IPauseSubscribeAsyncParams): Promise<string>,
    (params: IUnpauseSubscribeAsyncParams): Promise<string>,
  }
  
  interface IGetManualApprovalTransferManagerLogsAsyncParams extends IGetLogs {
    (params: IGetAddManualApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerAddManualApprovalEventArgs>>>,
    (params: IGetModifyManualApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerModifyManualApprovalEventArgs>>>,
    (params: IGetRevokeManualApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerRevokeManualApprovalEventArgs>>>,
    (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerPauseEventArgs>>>,
    (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerUnpauseEventArgs>>>,
  }

    interface ApprovalsParams {
        index: BigNumber,
    }

    interface VerifyTransferParams extends TxParams {
        from: string,
        to: string,
        amount: BigNumber,
        data: string,
        isTransfer: boolean,
    }

    interface AddManualApprovalParams extends TxParams {
        from: string,
        to: string,
        allowance: BigNumber,
        expiryTime: BigNumber,
        description: string,
    }

    interface AddManualApprovalMultiParams extends TxParams {
        from: string[],
        to: string[],
        allowances: BigNumber[],
        expiryTimes: BigNumber[],
        descriptions: string[],
    }

    interface ModifyManualApprovalParams extends TxParams {
        from: string,
        to: string,
        expiryTime: BigNumber,
        changeInAllowance: BigNumber,
        description: string,
        increase: boolean,
    }

    interface ModifyManualApprovalMultiParams extends TxParams {
        from: string[],
        to: string[],
        expiryTimes: BigNumber[],
        changedAllowances: BigNumber[],
        descriptions: string[],
        increase: boolean[],
    }

    interface RevokeManualApprovalParams extends TxParams {
        from: string,
        to: string,
    }

    interface RevokeManualApprovalMultiParams extends TxParams {
        from: string[],
        to: string[],
    }

    interface GetActiveApprovalsToUserParams {
        user: string,
    }

    interface GetApprovalDetailsParams {
        from: string,
        to: string,
    }

  /**
   * This class includes the functionality related to interacting with the ManualApproval Transfer Manager contract.
   */
  export class ManualApprovalTransferManagerWrapper extends ModuleWrapper {
    public abi: ContractAbi = ManualApprovalTransferManager.abi;
    protected _contract: Promise<ManualApprovalTransferManagerContract>;
  
    /**
     * Instantiate ManualApprovalTransferManagerWrapper
     * @param web3Wrapper Web3Wrapper instance to use
     * @param address The address of the GTM
     */
    constructor(web3Wrapper: Web3Wrapper, address: string) {
      super(web3Wrapper, address);
      this._contract = this._getManualApprovalTransferManagerContract();
    }
  
    public unpause = async (params: TxParams) => {
        return (await this._contract).unpause.sendTransactionAsync(
            params.txData,
            params.safetyFactor
        );
    }

    public paused = async (): Promise<boolean> => {
        return await (await this._contract).paused.callAsync();
    }

    public approvals = async (params: ApprovalsParams): Promise<[string, string, BigNumber, BigNumber, string]> => {
        return await (await this._contract).approvals.callAsync(
            params.index,
        );
    }

    public pause = async (params: TxParams) => {
        return (await this._contract).pause.sendTransactionAsync(
            params.txData,
            params.safetyFactor
        );
    } 

    public getInitFunction = async (): Promise<string> => {
        return await (await this._contract).getInitFunction.callAsync();
    }

    public verifyTransfer = async (params: VerifyTransferParams) => {
        return (await this._contract).verifyTransfer.sendTransactionAsync(
            params.from,
            params.to,
            params.amount,
            params.data,
            params.isTransfer,
            params.txData,
            params.safetyFactor
        );
    }

    public addManualApproval = async (params: AddManualApprovalParams) => {
        return (await this._contract).addManualApproval.sendTransactionAsync(
            params.from,
            params.to,
            params.allowance,
            params.expiryTime,
            params.description,
            params.txData,
            params.safetyFactor
        );
    }

    public addManualApprovalMulti = async (params: AddManualApprovalMultiParams) => {
        return (await this._contract).addManualApprovalMulti.sendTransactionAsync(
            params.from,
            params.to,
            params.allowances,
            params.expiryTimes,
            params.descriptions,
            params.txData,
            params.safetyFactor
        );
    }

    public modifyManualApproval = async (params: ModifyManualApprovalParams) => {
        return (await this._contract).modifyManualApproval.sendTransactionAsync(
            params.from,
            params.to,
            params.expiryTime,
            params.changeInAllowance,
            params.description,
            params.increase,
            params.txData,
            params.safetyFactor
        );
    }

    public modifyManualApprovalMulti = async (params: ModifyManualApprovalMultiParams) => {
        return (await this._contract).modifyManualApprovalMulti.sendTransactionAsync(
            params.from,
            params.to,
            params.expiryTimes,
            params.changedAllowances,
            params.descriptions,
            params.increase,
            params.txData,
            params.safetyFactor
        );
    }

    public revokeManualApproval = async (params: RevokeManualApprovalParams) => {
        return (await this._contract).revokeManualApproval.sendTransactionAsync(
            params.from,
            params.to,
            params.txData,
            params.safetyFactor
        );
    }

    public revokeManualApprovalMulti = async (params: RevokeManualApprovalMultiParams) => {
        return (await this._contract).revokeManualApprovalMulti.sendTransactionAsync(
            params.from,
            params.to,
            params.txData,
            params.safetyFactor
        );
    }

    public getActiveApprovalsToUser = async (params: GetActiveApprovalsToUserParams): Promise<[string[], string[], BigNumber[], BigNumber[], string[]]> => {
        return await (await this._contract).getActiveApprovalsToUser.callAsync(
            params.user,
        );
    }

    public getApprovalDetails = async (params: GetApprovalDetailsParams): Promise<[BigNumber, BigNumber, string]> => {
        return await (await this._contract).getApprovalDetails.callAsync(
            params.from,
            params.to,
        );
    }

    public getTotalApprovalsLength = async (): Promise<BigNumber> => {
        return await (await this._contract).getTotalApprovalsLength.callAsync();
    }

    public getAllApprovals = async (): Promise<[string[], string[], BigNumber[], BigNumber[], string[]]> => {
        return await (await this._contract).getAllApprovals.callAsync();
    }
  
    /**
     * Subscribe to an event type emitted by the contract.
     * @return Subscription token used later to unsubscribe
     */
    public subscribeAsync: IManualApprovalTransferManagerSubscribeAsyncParams = async <ArgsType extends ManualApprovalTransferManagerEventArgs>(
      params: ISubscribeAsyncParams
    ): Promise<string> => {
      assert.doesBelongToStringEnum('eventName', params.eventName, ManualApprovalTransferManagerEvents);
      assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
      assert.isFunction('callback', params.callback);
      const normalizedContractAddress = (await this._contract).address.toLowerCase();
      const subscriptionToken = this._subscribe<ArgsType>(
          normalizedContractAddress,
          params.eventName,
          params.indexFilterValues,
          ManualApprovalTransferManager.abi,
          params.callback,
          !_.isUndefined(params.isVerbose),
      );
      return subscriptionToken;
    }
  
    /**
     * Gets historical logs without creating a subscription
     * @return Array of logs that match the parameters
     */
    public getLogsAsync: IGetManualApprovalTransferManagerLogsAsyncParams = async <ArgsType extends ManualApprovalTransferManagerEventArgs>(
      params: IGetLogsAsyncParams
    ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
      assert.doesBelongToStringEnum('eventName', params.eventName, ManualApprovalTransferManagerEvents);
      assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
      assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
      const normalizedContractAddress = (await this._contract).address.toLowerCase();
      const logs = await this._getLogsAsync<ArgsType>(
          normalizedContractAddress,
          params.eventName,
          params.blockRange,
          params.indexFilterValues,
          ManualApprovalTransferManager.abi,
      );
      return logs;
    }
  
    private async _getManualApprovalTransferManagerContract(): Promise<ManualApprovalTransferManagerContract> {
      return new ManualApprovalTransferManagerContract(
        this.abi,
        this._address,
        this._web3Wrapper.getProvider(),
        this._web3Wrapper.getContractDefaults(),
      );
    }
  }
  