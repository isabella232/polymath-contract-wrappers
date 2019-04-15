import {
  SecurityTokenContract,
  SecurityTokenEventArgs,
  SecurityTokenEvents,
  SecurityTokenApprovalEventArgs,
  SecurityTokenTransferEventArgs,
  SecurityTokenModuleAddedEventArgs,
  SecurityTokenUpdateTokenDetailsEventArgs,
  SecurityTokenGranularityChangedEventArgs,
  SecurityTokenModuleArchivedEventArgs,
  SecurityTokenModuleUnarchivedEventArgs,
  SecurityTokenModuleRemovedEventArgs,
  SecurityTokenModuleBudgetChangedEventArgs,
  SecurityTokenFreezeTransfersEventArgs,
  SecurityTokenCheckpointCreatedEventArgs,
  SecurityTokenFreezeMintingEventArgs,
  SecurityTokenMintedEventArgs,
  SecurityTokenBurntEventArgs,
  SecurityTokenSetControllerEventArgs,
  SecurityTokenForceTransferEventArgs,
  SecurityTokenForceBurnEventArgs,
  SecurityTokenDisableControllerEventArgs,
  SecurityTokenOwnershipRenouncedEventArgs,
  SecurityTokenOwnershipTransferredEventArgs,
} from '@polymathnetwork/abi-wrappers';
import {
  SecurityToken,
  CountTransferManager,
  ERC20DividendCheckpoint,
  CappedSTO,
  USDTieredSTO,
  PercentageTransferManager,
  EtherDividendCheckpoint,
} from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { ethers } from 'ethers';
import * as _ from 'lodash';
import { schemas } from '@0x/json-schemas';
import { TxParams, GetLogsAsyncParams, SubscribeAsyncParams, EventCallback, GetLogs, Subscribe } from '../../types';
import assert from '../../utils/assert';
import ERC20TokenWrapper from './erc20_wrapper';
import { stringToBytes32 } from '../../utils/convert';

const NO_MODULE_DATA = '0x0000000000000000';

interface ApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.Approval;
  callback: EventCallback<SecurityTokenApprovalEventArgs>;
}

interface GetApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.Approval;
}

interface TransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.Transfer;
  callback: EventCallback<SecurityTokenTransferEventArgs>;
}

interface GetTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.Transfer;
}

interface ModuleAddedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleAdded;
  callback: EventCallback<SecurityTokenModuleAddedEventArgs>;
}

interface GetModuleAddedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleAdded;
}

interface UpdateTokenDetailsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.UpdateTokenDetails;
  callback: EventCallback<SecurityTokenUpdateTokenDetailsEventArgs>;
}

interface GetUpdateTokenDetailsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.UpdateTokenDetails;
}

interface GranularityChangedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.GranularityChanged;
  callback: EventCallback<SecurityTokenGranularityChangedEventArgs>;
}

interface GetGranularityChangedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.GranularityChanged;
}

interface ModuleArchivedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleArchived;
  callback: EventCallback<SecurityTokenModuleArchivedEventArgs>;
}

interface GetModuleArchivedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleArchived;
}

interface ModuleUnarchivedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleUnarchived;
  callback: EventCallback<SecurityTokenModuleUnarchivedEventArgs>;
}

interface GetModuleUnarchivedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleUnarchived;
}

interface ModuleRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleRemoved;
  callback: EventCallback<SecurityTokenModuleRemovedEventArgs>;
}

interface GetModuleRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleRemoved;
}

interface ModuleBudgetChangedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleBudgetChanged;
  callback: EventCallback<SecurityTokenModuleBudgetChangedEventArgs>;
}

interface GetModuleBudgetChangedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleBudgetChanged;
}

interface FreezeTransfersSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.FreezeTransfers;
  callback: EventCallback<SecurityTokenFreezeTransfersEventArgs>;
}

interface GetFreezeTransfersLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.FreezeTransfers;
}

interface CheckpointCreatedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.CheckpointCreated;
  callback: EventCallback<SecurityTokenCheckpointCreatedEventArgs>;
}

interface GetCheckpointCreatedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.CheckpointCreated;
}

interface FreezeMintingSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.FreezeMinting;
  callback: EventCallback<SecurityTokenFreezeMintingEventArgs>;
}

interface GetFreezeMintingLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.FreezeMinting;
}

interface MintedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.Minted;
  callback: EventCallback<SecurityTokenMintedEventArgs>;
}

interface GetMintedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.Minted;
}

interface BurntSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.Burnt;
  callback: EventCallback<SecurityTokenBurntEventArgs>;
}

interface GetBurntLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.Burnt;
}

interface SetControllerSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.SetController;
  callback: EventCallback<SecurityTokenSetControllerEventArgs>;
}

interface GetSetControllerLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.SetController;
}

interface ForceTransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ForceTransfer;
  callback: EventCallback<SecurityTokenForceTransferEventArgs>;
}

interface GetForceTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ForceTransfer;
}

interface ForceBurnSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ForceBurn;
  callback: EventCallback<SecurityTokenForceBurnEventArgs>;
}

interface GetForceBurnLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ForceBurn;
}

interface DisableControllerSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.DisableController;
  callback: EventCallback<SecurityTokenDisableControllerEventArgs>;
}

interface GetDisableControllerLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.DisableController;
}

interface OwnershipRenouncedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.OwnershipRenounced;
  callback: EventCallback<SecurityTokenOwnershipRenouncedEventArgs>;
}

interface GetOwnershipRenouncedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.OwnershipRenounced;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.OwnershipTransferred;
  callback: EventCallback<SecurityTokenOwnershipTransferredEventArgs>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.OwnershipTransferred;
}

interface SecurityTokenSubscribeAsyncParams extends Subscribe {
  (params: ApprovalSubscribeAsyncParams): Promise<string>;
  (params: TransferSubscribeAsyncParams): Promise<string>;
  (params: ModuleAddedSubscribeAsyncParams): Promise<string>;
  (params: UpdateTokenDetailsSubscribeAsyncParams): Promise<string>;
  (params: GranularityChangedSubscribeAsyncParams): Promise<string>;
  (params: ModuleArchivedSubscribeAsyncParams): Promise<string>;
  (params: ModuleUnarchivedSubscribeAsyncParams): Promise<string>;
  (params: ModuleRemovedSubscribeAsyncParams): Promise<string>;
  (params: ModuleBudgetChangedSubscribeAsyncParams): Promise<string>;
  (params: FreezeTransfersSubscribeAsyncParams): Promise<string>;
  (params: CheckpointCreatedSubscribeAsyncParams): Promise<string>;
  (params: FreezeMintingSubscribeAsyncParams): Promise<string>;
  (params: MintedSubscribeAsyncParams): Promise<string>;
  (params: BurntSubscribeAsyncParams): Promise<string>;
  (params: SetControllerSubscribeAsyncParams): Promise<string>;
  (params: ForceTransferSubscribeAsyncParams): Promise<string>;
  (params: ForceBurnSubscribeAsyncParams): Promise<string>;
  (params: DisableControllerSubscribeAsyncParams): Promise<string>;
  (params: OwnershipRenouncedSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
}

interface GetSecurityTokenLogsAsyncParams extends GetLogs {
  (params: GetApprovalLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenApprovalEventArgs>[]>;
  (params: GetTransferLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenTransferEventArgs>[]>;
  (params: GetModuleAddedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleAddedEventArgs>[]>;
  (params: GetUpdateTokenDetailsLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenUpdateTokenDetailsEventArgs>[]
  >;
  (params: GetGranularityChangedLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenGranularityChangedEventArgs>[]
  >;
  (params: GetModuleArchivedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleArchivedEventArgs>[]>;
  (params: GetModuleUnarchivedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleUnarchivedEventArgs>[]>;
  (params: GetModuleRemovedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleRemovedEventArgs>[]>;
  (params: GetModuleBudgetChangedLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenModuleBudgetChangedEventArgs>[]
  >;
  (params: GetFreezeTransfersLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>[]>;
  (params: GetCheckpointCreatedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenCheckpointCreatedEventArgs>[]>;
  (params: GetFreezeMintingLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenFreezeMintingEventArgs>[]>;
  (params: GetMintedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenMintedEventArgs>[]>;
  (params: GetBurntLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenBurntEventArgs>[]>;
  (params: GetSetControllerLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenSetControllerEventArgs>[]>;
  (params: GetForceTransferLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenForceTransferEventArgs>[]>;
  (params: GetForceBurnLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenForceBurnEventArgs>[]>;
  (params: GetDisableControllerLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenDisableControllerEventArgs>[]>;
  (params: GetOwnershipRenouncedLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenOwnershipRenouncedEventArgs>[]
  >;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenOwnershipTransferredEventArgs>[]
  >;
}

/**
 * @param type type of the module
 */
interface ModuleTypeParams {
  type: number;
}

interface ModuleAddressParams {
  moduleAddress: string;
}

/**
 * @param module address of the module
 */
interface ModuleAddressTxParams extends TxParams {
  moduleAddress: string;
}

/**
 * @param from sender of transfer
 * @param to receiver of transfer
 * @param value value of transfer
 * @param data data to indicate validation
 */
interface VerifyTransferParams {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
}

interface ChangeApprovalParams extends TxParams {
  spender: string;
  value: BigNumber;
}

interface TransferOwnershipParams extends TxParams {
  newOwner: string;
}

interface ModuleNameParams {
  moduleName: string;
}

interface WithdrawERC20Params extends TxParams {
  tokenContract: string;
  value: BigNumber;
}

interface ChangeModuleBudgetParams extends TxParams {
  module: string;
  change: BigNumber;
  increase: boolean;
}

interface UpdateTokenDetailsParams extends TxParams {
  newTokenDetails: string;
}

interface ChangeGranularityParams extends TxParams {
  granularity: BigNumber;
}

interface CheckpointIdParams {
  checkpointId: BigNumber;
}

interface IterateInvestorsParams {
  start: BigNumber;
  end: BigNumber;
}

interface TransferWithDataParams extends TxParams {
  to: string;
  value: BigNumber;
  data: string;
}

interface TransferFromWithDataParams extends TxParams {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
}

interface MintParams extends TxParams {
  investor: string;
  value: BigNumber;
}

interface MintWithDataParams extends MintParams {
  data: string;
}

interface MintMultiParams extends TxParams {
  investors: string[];
  values: BigNumber[];
}

interface CheckPermissionParams {
  delegateAddress: string;
  moduleAddress: string;
  permission: string;
}

interface BurnWithDataParams extends TxParams {
  value: BigNumber;
  data: string;
}

interface BurnFromWithDataParams extends TxParams {
  from: string;
  value: BigNumber;
  data: string;
}

interface BalanceOfAtParams {
  investor: string;
  checkpointId: BigNumber;
}

interface SetControllerParams extends TxParams {
  controller: string;
}

interface ForceTransferParams extends TxParams {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
  log: string;
}

interface ForceBurnParams extends TxParams {
  from: string;
  value: BigNumber;
  data: string;
  log: string;
}

interface AddModuleParams extends TxParams {
  address: string;
  maxCost: BigNumber;
  budget: BigNumber;
}

interface AddCountTransferManagerParams extends AddModuleParams {
  maxHolderCount: number;
}

interface AddPercentageTransferManagerParams extends AddModuleParams {
  maxHolderPercentage: number;
  allowPrimaryIssuance: boolean;
}

interface AddErc20DividendCheckpointParams extends AddModuleParams {
  wallet: string;
}

interface AddCappedSTOParams extends AddModuleParams {
  startTime: number;
  endTime: number;
  cap: BigNumber;
  rate: BigNumber;
  fundRaiseTypes: BigNumber[];
  fundsReceiver: string;
}

interface AddUSDTieredSTOParams extends AddModuleParams {
  startTime: number;
  endTime: number;
  ratePerTier: number[];
  ratePerTierDiscountPoly: number[];
  tokensPerTierTotal: number[];
  tokensPerTierDiscountPoly: number[];
  nonAccreditedLimitUSD: number;
  minimumInvestmentUSD: number;
  fundRaiseTypes: number[];
  wallet: string;
  reserveWallet: string;
  usdTokens: string[];
}

interface AddEtherDividendCheckpointParams extends AddModuleParams {
  wallet: string;
}

// // Return types ////
interface ModuleData {
  /** Module name */
  name: string;
  /** Module address */
  address: string;
  /** Module factory address */
  factoryAddress: string;
  /** Whether module is archived */
  archived: boolean;
  /** Modules types */
  types: number[];
}
// // End of return types ////

/**
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export default class SecurityTokenWrapper extends ERC20TokenWrapper {
  public abi: ContractAbi = SecurityToken.abi;

  protected contract: Promise<SecurityTokenContract>;

  /**
   * Instantiate SecurityTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<SecurityTokenContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Value of current checkpoint
   */
  public currentCheckpointId = async () => {
    return (await this.contract).currentCheckpointId.callAsync();
  };

  /**
   * Granular level of the token
   */
  public granularity = async () => {
    return (await this.contract).granularity.callAsync();
  };

  public decreaseApproval = async (params: ChangeApprovalParams) => {
    return (await this.contract).decreaseApproval.sendTransactionAsync(
      params.spender,
      params.value,
      params.txData,
      params.safetyFactor,
    );
  };

  public polyToken = async () => {
    return (await this.contract).polyToken.callAsync();
  };

  public renounceOwnership = async (params: TxParams) => {
    return (await this.contract).renounceOwnership.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public polymathRegistry = async () => {
    return (await this.contract).polymathRegistry.callAsync();
  };

  public controllerDisabled = async () => {
    return (await this.contract).controllerDisabled.callAsync();
  };

  public owner = async () => {
    return (await this.contract).owner.callAsync();
  };

  public mintingFrozen = async () => {
    return (await this.contract).mintingFrozen.callAsync();
  };

  public moduleRegistry = async () => {
    return (await this.contract).moduleRegistry.callAsync();
  };

  public featureRegistry = async () => {
    return (await this.contract).featureRegistry.callAsync();
  };

  public securityTokenRegistry = async () => {
    return (await this.contract).securityTokenRegistry.callAsync();
  };

  public tokenDetails = async () => {
    return (await this.contract).tokenDetails.callAsync();
  };

  public increaseApproval = async (params: ChangeApprovalParams) => {
    return (await this.contract).increaseApproval.sendTransactionAsync(
      params.spender,
      params.value,
      params.txData,
      params.safetyFactor,
    );
  };

  public transfersFrozen = async () => {
    return (await this.contract).transfersFrozen.callAsync();
  };

  public transferOwnership = async (params: TransferOwnershipParams) => {
    return (await this.contract).transferOwnership.sendTransactionAsync(
      params.newOwner,
      params.txData,
      params.safetyFactor,
    );
  };

  public updateFromRegistry = async (params: TxParams) => {
    return (await this.contract).updateFromRegistry.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public archiveModule = async (params: ModuleAddressTxParams) => {
    return (await this.contract).archiveModule.sendTransactionAsync(
      params.moduleAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  public unarchiveModule = async (params: ModuleAddressTxParams) => {
    return (await this.contract).unarchiveModule.sendTransactionAsync(
      params.moduleAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeModule = async (params: ModuleAddressTxParams) => {
    return (await this.contract).removeModule.sendTransactionAsync(
      params.moduleAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  public getModulesByName = async (params: ModuleNameParams) => {
    const moduleNameHex = stringToBytes32(params.moduleName);
    return (await this.contract).getModulesByName.callAsync(moduleNameHex);
  };

  public withdrawERC20 = async (params: WithdrawERC20Params) => {
    return (await this.contract).withdrawERC20.sendTransactionAsync(
      params.tokenContract,
      params.value,
      params.txData,
      params.safetyFactor,
    );
  };

  public changeModuleBudget = async (params: ChangeModuleBudgetParams) => {
    return (await this.contract).changeModuleBudget.sendTransactionAsync(
      params.module,
      params.change,
      params.increase,
      params.txData,
      params.safetyFactor,
    );
  };

  public updateTokenDetails = async (params: UpdateTokenDetailsParams) => {
    return (await this.contract).updateTokenDetails.sendTransactionAsync(
      params.newTokenDetails,
      params.txData,
      params.safetyFactor,
    );
  };

  public changeGranularity = async (params: ChangeGranularityParams) => {
    return (await this.contract).changeGranularity.sendTransactionAsync(
      params.granularity,
      params.txData,
      params.safetyFactor,
    );
  };

  public getInvestors = async () => {
    return (await this.contract).getInvestors.callAsync();
  };

  public getInvestorsAt = async (params: CheckpointIdParams) => {
    return (await this.contract).getInvestorsAt.callAsync(params.checkpointId);
  };

  public iterateInvestors = async (params: IterateInvestorsParams) => {
    return (await this.contract).iterateInvestors.callAsync(params.start, params.end);
  };

  public getInvestorCount = async () => {
    return (await this.contract).getInvestorCount.callAsync();
  };

  public freezeTransfers = async (params: TxParams) => {
    return (await this.contract).freezeTransfers.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public unfreezeTransfers = async (params: TxParams) => {
    return (await this.contract).unfreezeTransfers.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public transferWithData = async (params: TransferWithDataParams) => {
    return (await this.contract).transferWithData.sendTransactionAsync(
      params.to,
      params.value,
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  public transferFromWithData = async (params: TransferFromWithDataParams) => {
    return (await this.contract).transferFromWithData.sendTransactionAsync(
      params.from,
      params.to,
      params.value,
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  public freezeMinting = async (params: TxParams) => {
    return (await this.contract).freezeMinting.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public mint = async (params: MintParams) => {
    return (await this.contract).mint.sendTransactionAsync(
      params.investor,
      params.value,
      params.txData,
      params.safetyFactor,
    );
  };

  public mintWithData = async (params: MintWithDataParams) => {
    return (await this.contract).mintWithData.sendTransactionAsync(
      params.investor,
      params.value,
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  public mintMulti = async (params: MintMultiParams) => {
    return (await this.contract).mintMulti.sendTransactionAsync(
      params.investors,
      params.values,
      params.txData,
      params.safetyFactor,
    );
  };

  public checkPermission = async (params: CheckPermissionParams): Promise<boolean> => {
    return (await this.contract).checkPermission.callAsync(
      params.delegateAddress,
      params.moduleAddress,
      params.permission,
    );
  };

  public burnWithData = async (params: BurnWithDataParams) => {
    return (await this.contract).burnWithData.sendTransactionAsync(
      params.value,
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  public burnFromWithData = async (params: BurnFromWithDataParams) => {
    return (await this.contract).burnFromWithData.sendTransactionAsync(
      params.from,
      params.value,
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  public createCheckpoint = async (params: TxParams) => {
    return (await this.contract).createCheckpoint.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public getCheckpointTimes = async () => {
    return (await this.contract).getCheckpointTimes.callAsync();
  };

  public totalSupplyAt = async (params: CheckpointIdParams) => {
    return (await this.contract).totalSupplyAt.callAsync(params.checkpointId);
  };

  public balanceOfAt = async (params: BalanceOfAtParams) => {
    return (await this.contract).balanceOfAt.callAsync(params.investor, params.checkpointId);
  };

  public setController = async (params: SetControllerParams) => {
    return (await this.contract).setController.sendTransactionAsync(
      params.controller,
      params.txData,
      params.safetyFactor,
    );
  };

  public disableController = async (params: TxParams) => {
    return (await this.contract).disableController.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public forceTransfer = async (params: ForceTransferParams) => {
    return (await this.contract).forceTransfer.sendTransactionAsync(
      params.from,
      params.to,
      params.value,
      params.data,
      params.log,
      params.txData,
      params.safetyFactor,
    );
  };

  public forceBurn = async (params: ForceBurnParams) => {
    return (await this.contract).forceBurn.sendTransactionAsync(
      params.from,
      params.value,
      params.data,
      params.log,
      params.txData,
      params.safetyFactor,
    );
  };

  public getVersion = async (): Promise<BigNumber> => {
    return (await this.contract).totalSupply.callAsync();
  };

  /**
   * Returns a list of modules that match the provided module type
   * @return address[] list of modules with this type
   */
  public getModulesByType = async (params: ModuleTypeParams) => {
    return (await this.contract).getModulesByType.callAsync(params.type);
  };

  public addCountTransferManager = async (params: AddCountTransferManagerParams) => {
    const iface = new ethers.utils.Interface(CountTransferManager.abi);
    const data = iface.functions.configure.encode([params.maxHolderCount]);
    return (await this.contract).addModule.sendTransactionAsync(
      params.address,
      data,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor,
    );
  };

  public addPercentageTransferManager = async (params: AddPercentageTransferManagerParams) => {
    const iface = new ethers.utils.Interface(PercentageTransferManager.abi);
    const data = iface.functions.configure.encode([params.maxHolderPercentage, params.allowPrimaryIssuance]);
    return (await this.contract).addModule.sendTransactionAsync(
      params.address,
      data,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor,
    );
  };

  public addErc20DividendCheckpoint = async (params: AddErc20DividendCheckpointParams) => {
    const iface = new ethers.utils.Interface(ERC20DividendCheckpoint.abi);
    const data = iface.functions.configure.encode([params.wallet]);
    return (await this.contract).addModule.sendTransactionAsync(
      params.address,
      data,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor,
    );
  };

  public addGeneralPermissionManager = async (params: AddModuleParams) => {
    return (await this.contract).addModule.sendTransactionAsync(
      params.address,
      NO_MODULE_DATA,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor,
    );
  };

  public addCappedSTO = async (params: AddCappedSTOParams) => {
    const iface = new ethers.utils.Interface(CappedSTO.abi);
    const data = iface.functions.configure.encode([
      params.startTime,
      params.endTime,
      params.cap,
      params.rate,
      params.fundRaiseTypes,
      params.fundsReceiver,
    ]);
    return (await this.contract).addModule.sendTransactionAsync(
      params.address,
      data,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor,
    );
  };

  public addUSDTieredSTO = async (params: AddUSDTieredSTOParams) => {
    const iface = new ethers.utils.Interface(USDTieredSTO.abi);
    const data = iface.functions.configure.encode([
      params.startTime,
      params.endTime,
      params.ratePerTier,
      params.ratePerTierDiscountPoly,
      params.tokensPerTierTotal,
      params.tokensPerTierDiscountPoly,
      params.nonAccreditedLimitUSD,
      params.minimumInvestmentUSD,
      params.fundRaiseTypes,
      params.wallet,
      params.reserveWallet,
      params.usdTokens,
    ]);
    return (await this.contract).addModule.sendTransactionAsync(
      params.address,
      data,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor,
    );
  };

  public addEtherDividendCheckpoint = async (params: AddEtherDividendCheckpointParams) => {
    const iface = new ethers.utils.Interface(EtherDividendCheckpoint.abi);
    const data = iface.functions.configure.encode([params.wallet]);
    return (await this.contract).addModule.sendTransactionAsync(
      params.address,
      data,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor,
    );
  };

  public addManualApprovalTransferManager = async (params: AddModuleParams) => {
    return (await this.contract).addModule.sendTransactionAsync(
      params.address,
      NO_MODULE_DATA,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor,
    );
  };

  public addGeneralTransferManager = async (params: AddModuleParams) => {
    return (await this.contract).addModule.sendTransactionAsync(
      params.address,
      NO_MODULE_DATA,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * @return Returns the data associated to a module
   */
  public getModule = async (params: ModuleAddressParams) => {
    const result = await (await this.contract).getModule.callAsync(params.moduleAddress);
    const typedResult: ModuleData = {
      name: result[0],
      address: result[1],
      factoryAddress: result[2],
      archived: result[3],
      types: result[4].map(t => t.toNumber()),
    };
    return typedResult;
  };

  /**
   * Validates a transfer with a TransferManager module if it exists
   * @return bool
   */
  public verifyTransfer = async (params: VerifyTransferParams) => {
    return (await this.contract).verifyTransfer.callAsync(params.from, params.to, params.value, params.data);
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: SecurityTokenSubscribeAsyncParams = async <ArgsType extends SecurityTokenEventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      SecurityToken.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetSecurityTokenLogsAsyncParams = async <ArgsType extends SecurityTokenEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      SecurityToken.abi,
    );
    return logs;
  };
}
