import { TxData, TxDataPayable } from '@0x/web3-wrapper';
import {
    ContractEventArg,
    DecodedLogArgs,
    LogWithDecodedArgs,
    BlockParam,
} from 'ethereum-types';
import {
    PolyTokenEventArgs,
    PolyTokenEvents,
    CappedSTOFactoryEventArgs,
    CappedSTOEventArgs,
    DetailedERC20EventArgs,
    DetailedERC20Events,
    ERC20DividendCheckpointEventArgs,
    EtherDividendCheckpointEventArgs,
    FeatureRegistryEventArgs,
    GeneralTransferManagerEventArgs,
    ManualApprovalTransferManagerEventArgs,
    ModuleFactoryEventArgs,
    ModuleRegistryEventArgs,
    PolyTokenFaucetEventArgs,
    PolymathRegistryEventArgs,
    SecurityTokenRegistryEventArgs,
    SecurityTokenEventArgs,
    USDTieredSTOFactoryEventArgs,
    USDTieredSTOEventArgs,
    CappedSTOFactoryEvents,
    CappedSTOEvents,
    ERC20DividendCheckpointEvents,
    EtherDividendCheckpointEvents,
    FeatureRegistryEvents,
    GeneralTransferManagerEvents,
    ManualApprovalTransferManagerEvents,
    ModuleFactoryEvents,
    ModuleRegistryEvents,
    PolyTokenFaucetEvents,
    PolymathRegistryEvents,
    SecurityTokenRegistryEvents,
    SecurityTokenEvents,
    USDTieredSTOFactoryEvents,
    USDTieredSTOEvents,
    GeneralPermissionManagerEventArgs,
    GeneralPermissionManagerEvents,
    ModuleContract,
    GeneralPermissionManagerContract,
    GeneralTransferManagerContract,
    CappedSTOContract,
    USDTieredSTOContract,
    ERC20DividendCheckpointContract,
    STOContract,
    STOEvents,
    STOEventArgs,
    DetailedERC20Contract,
    PolyTokenContract,
    SecurityTokenContract,
    EtherDividendCheckpointContract,
    ManualApprovalTransferManagerContract,
} from '@polymathnetwork/abi-wrappers';

/**
 * @param txData Data to override default values on tx, i.e. 'from', 'gasPrice'
 * @param safetyFactor Factor to use for gas limit estimation
 */
export interface TxParams {
    txData?: Partial<TxData>;
    safetyFactor?: number;
}

export interface TxPayableParams {
    txData?: Partial<TxDataPayable>;
    safetyFactor?: number;
}

export enum NetworkId {
    Mainnet = 1,
    Kovan = 42,
    Local = 15,
}

export enum Features {
    CustomModulesAllowed = "CustomModulesAllowed",
    FreezeMintingAllowed = "FreezeMintingAllowed",
}

export enum Contracts {
    PolyToken = "PolyToken",
    ModuleRegistry = "ModuleRegistry",
    FeatureRegistry = "FeatureRegistry",
    SecurityTokenRegistry = "SecurityTokenRegistry",
    PolyUsdOracle = "PolyUsdOracle",
    EthUsdOracle = "EthUsdOracle"
}

export interface DecodedLogEvent<ArgsType extends DecodedLogArgs> {
    isRemoved: boolean;
    log: LogWithDecodedArgs<ArgsType>;
}

export type EventCallback<ArgsType extends DecodedLogArgs> = (
    err: null | Error,
    log?: DecodedLogEvent<ArgsType>,
) => void;

export interface IndexedFilterValues {
    [index: string]: ContractEventArg;
}

export interface BlockRange {
    fromBlock: BlockParam;
    toBlock: BlockParam;
}

export type ContractEventArgs = PolyTokenEventArgs |
    CappedSTOFactoryEventArgs |
    CappedSTOEventArgs |
    DetailedERC20EventArgs |
    ERC20DividendCheckpointEventArgs |
    EtherDividendCheckpointEventArgs |
    FeatureRegistryEventArgs |
    GeneralPermissionManagerEventArgs |
    GeneralTransferManagerEventArgs |
    ManualApprovalTransferManagerEventArgs |
    ModuleFactoryEventArgs |
    ModuleRegistryEventArgs |
    PolyTokenFaucetEventArgs |
    PolymathRegistryEventArgs |
    SecurityTokenRegistryEventArgs |
    SecurityTokenEventArgs |
    USDTieredSTOFactoryEventArgs |
    USDTieredSTOEventArgs |
    STOEventArgs;

export type ContractEvents = PolyTokenEvents |
    CappedSTOFactoryEvents |
    CappedSTOEvents |
    DetailedERC20Events |
    ERC20DividendCheckpointEvents |
    EtherDividendCheckpointEvents |
    FeatureRegistryEvents |
    GeneralPermissionManagerEvents |
    GeneralTransferManagerEvents |
    ManualApprovalTransferManagerEvents |
    ModuleFactoryEvents |
    ModuleRegistryEvents |
    PolyTokenFaucetEvents |
    PolymathRegistryEvents |
    SecurityTokenRegistryEvents |
    SecurityTokenEvents |
    USDTieredSTOFactoryEvents |
    USDTieredSTOEvents |
    STOEvents;

/**
 * @param eventName           The contract event you would like to subscribe to.
 * @param blockRange          Block range to get logs from.
 * @param indexFilterValues   An object where the keys are indexed args returned by the event and
 *                            the value is the value you are interested in.
 */
export interface IGetLogsAsyncParams {
    eventName: ContractEvents,
    blockRange: BlockRange,
    indexFilterValues: IndexedFilterValues
}

/**
 * @param contractAddress     The hex encoded address where the contract is deployed.
 * @param eventName           The contract event you would like to subscribe to.
 * @param indexFilterValues   An object where the keys are indexed args returned by the event and
 *                            the value is the value you are interested in.
 * @param callback            Callback that gets called when a log is added/removed
 * @param isVerbose           Enable verbose subscription warnings (e.g recoverable network issues encountered)
 */
export interface ISubscribeAsyncParams {
    eventName: ContractEvents,
    indexFilterValues: IndexedFilterValues,
    callback: EventCallback<ContractEventArg>,
    isVerbose?: boolean,
}

export interface IGetLogs {
    (params: IGetLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ContractEventArgs>>>
}

export interface ISubscribe {
    (params: ISubscribeAsyncParams): Promise<string>
}

export type ERC20Contract = 
  DetailedERC20Contract | 
  SecurityTokenContract | 
  PolyTokenContract;

export type GenericModuleContract = 
  ModuleContract |
  GeneralPermissionManagerContract |
  GeneralTransferManagerContract |
  STOBaseContract |
  DividendCheckpointBaseContract |
  ManualApprovalTransferManagerContract;

export type STOBaseContract = 
  STOContract |
  CappedSTOContract |
  USDTieredSTOContract;

export type DividendCheckpointBaseContract =
  ERC20DividendCheckpointContract |
  EtherDividendCheckpointContract;