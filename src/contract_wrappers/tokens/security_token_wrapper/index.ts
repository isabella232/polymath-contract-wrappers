/* istanbul ignore file */
import { ISecurityTokenEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { SecurityToken_3_0_0, isSecurityToken_3_0_0 } from './3.0.0';

import Common, { isSecurityToken } from './common';
import { ContractVersion } from '../../../types';

export type SecurityTokenEventArgs = ISecurityTokenEventArgs_3_0_0;

export {
  ISecurityTokenEvents_3_0_0 as SecurityTokenEvents,
  ISecurityTokenApprovalEventArgs_3_0_0 as SecurityTokenApprovalEventArgs,
  ISecurityTokenAuthorizedOperatorByPartitionEventArgs_3_0_0 as SecurityTokenAuthorizedOperatorByPartitionEventArgs,
  ISecurityTokenAuthorizedOperatorEventArgs_3_0_0 as SecurityTokenAuthorizedOperatorEventArgs,
  ISecurityTokenCheckpointCreatedEventArgs_3_0_0 as SecurityTokenCheckpointCreatedEventArgs,
  ISecurityTokenControllerRedemptionEventArgs_3_0_0 as SecurityTokenControllerRedemptionEventArgs,
  ISecurityTokenControllerTransferEventArgs_3_0_0 as SecurityTokenControllerTransferEventArgs,
  ISecurityTokenDisableControllerEventArgs_3_0_0 as SecurityTokenDisableControllerEventArgs,
  ISecurityTokenDocumentRemovedEventArgs_3_0_0 as SecurityTokenDocumentRemovedEventArgs,
  ISecurityTokenDocumentUpdatedEventArgs_3_0_0 as SecurityTokenDocumentUpdatedEventArgs,
  ISecurityTokenFreezeIssuanceEventArgs_3_0_0 as SecurityTokenFreezeIssuanceEventArgs,
  ISecurityTokenFreezeTransfersEventArgs_3_0_0 as SecurityTokenFreezeTransfersEventArgs,
  ISecurityTokenGranularityChangedEventArgs_3_0_0 as SecurityTokenGranularityChangedEventArgs,
  ISecurityTokenIssuedByPartitionEventArgs_3_0_0 as SecurityTokenIssuedByPartitionEventArgs,
  ISecurityTokenIssuedEventArgs_3_0_0 as SecurityTokenIssuedEventArgs,
  ISecurityTokenModuleAddedEventArgs_3_0_0 as SecurityTokenModuleAddedEventArgs,
  ISecurityTokenModuleArchivedEventArgs_3_0_0 as SecurityTokenModuleArchivedEventArgs,
  ISecurityTokenModuleBudgetChangedEventArgs_3_0_0 as SecurityTokenModuleBudgetChangedEventArgs,
  ISecurityTokenModuleRemovedEventArgs_3_0_0 as SecurityTokenModuleRemovedEventArgs,
  ISecurityTokenModuleUnarchivedEventArgs_3_0_0 as SecurityTokenModuleUnarchivedEventArgs,
  ISecurityTokenOwnershipTransferredEventArgs_3_0_0 as SecurityTokenOwnershipTransferredEventArgs,
  ISecurityTokenRedeemedByPartitionEventArgs_3_0_0 as SecurityTokenRedeemedByPartitionEventArgs,
  ISecurityTokenRedeemedEventArgs_3_0_0 as SecurityTokenRedeemedEventArgs,
  ISecurityTokenRevokedOperatorByPartitionEventArgs_3_0_0 as SecurityTokenRevokedOperatorByPartitionEventArgs,
  ISecurityTokenRevokedOperatorEventArgs_3_0_0 as SecurityTokenRevokedOperatorEventArgs,
  ISecurityTokenSetControllerEventArgs_3_0_0 as SecurityTokenSetControllerEventArgs,
  ISecurityTokenTokenUpgradedEventArgs_3_0_0 as SecurityTokenTokenUpgradedEventArgs,
  ISecurityTokenTransferByPartitionEventArgs_3_0_0 as SecurityTokenTransferByPartitionEventArgs,
  ISecurityTokenTransferEventArgs_3_0_0 as SecurityTokenTransferEventArgs,
  ISecurityTokenTreasuryWalletChangedEventArgs_3_0_0 as SecurityTokenTreasuryWalletChangedEventArgs,
  ISecurityTokenUpdateTokenDetailsEventArgs_3_0_0 as SecurityTokenUpdateTokenDetailsEventArgs,
  ISecurityTokenUpdateTokenNameEventArgs_3_0_0 as SecurityTokenUpdateTokenNameEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type SecurityToken = SecurityToken_3_0_0;

export { isSecurityToken, SecurityToken_3_0_0, isSecurityToken_3_0_0 };

// for internal use
export class SecurityTokenCommon extends Common {
  public contractVersion!: ContractVersion;
}
