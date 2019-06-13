// CappedSTOWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import {
  CappedSTOContract,
  SecurityTokenContract,
  PolyTokenContract,
  PolyTokenEvents,
} from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import CappedSTOWrapper from '../capped_sto_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import STOWrapper from '../sto_wrapper';
import { dateToBigNumber, valueToWei, weiToValue } from '../../../../utils/convert';
import { FULL_DECIMALS, FundRaiseType } from '../../../../types';

describe('CappedSTOWrapper', () => {
  // Capped STO Wrapper is used as contract target here as STOWrapper is abstract
  let target: CappedSTOWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: CappedSTOContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: SecurityTokenContract;
  let mockedPolyTokenContract: PolyTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(CappedSTOContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(SecurityTokenContract);
    mockedPolyTokenContract = mock(PolyTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new CappedSTOWrapper(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);
    reset(mockedSecurityTokenContract);
    reset(mockedPolyTokenContract);
  });

  describe('Types', () => {
    test('should extend STOWrapper', async () => {
      expect(target instanceof STOWrapper).toBe(true);
    });
  });

  describe('Rate', () => {
    test('should get the rate', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.rate).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.rate();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.rate).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Cap', () => {
    test('should get the cap', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);

      // Security Token, its address, and decimals mocked
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.cap).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.cap();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, expectedDecimalsResult));
      // Verifications
      verify(mockedContract.cap).once();
      verify(mockedMethod.callAsync()).once();

      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
    });
  });

  describe('AllowBeneficialInvestments', () => {
    test('should get boolean of allowBeneficialInvestments', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowBeneficialInvestments).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.allowBeneficialInvestments();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.allowBeneficialInvestments).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Investors', () => {
    test('should get bigNumber for given investor', async () => {
      const investorAddress = '0x5555555555555555555555555555555555555555';
      const params = {
        investorAddress,
      };
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.investors).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(params.investorAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.investors(params);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.investors).once();
      verify(mockedMethod.callAsync(params.investorAddress)).once();
    });
  });

  describe('Change AllowBeneficialInvestments', () => {
    test('should change allowBeneficialInvestments', async () => {
      // Address expected
      const expectedAllowBeneficialInvestmentResult = true;
      // Mocked method
      const mockedAllowBeneficialInvestmentMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowBeneficialInvestments).thenReturn(instance(mockedAllowBeneficialInvestmentMethod));
      // Stub the request
      when(mockedAllowBeneficialInvestmentMethod.callAsync()).thenResolve(expectedAllowBeneficialInvestmentResult);

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);

      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        allowBeneficialInvestments: false,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeAllowBeneficialInvestments).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.allowBeneficialInvestments,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeAllowBeneficialInvestments(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeAllowBeneficialInvestments).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.allowBeneficialInvestments,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedAllowBeneficialInvestmentMethod.callAsync()).once();
      verify(mockedContract.allowBeneficialInvestments).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('CapReached', () => {
    test('should get boolean of capReached', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.capReached).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.capReached();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.capReached).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetTokensSold', () => {
    test('should get the tokens sold', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);

      // Security Token, its address, and decimals mocked
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTokensSold).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getTokensSold();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, expectedDecimalsResult));
      // Verifications
      verify(mockedContract.getTokensSold).once();
      verify(mockedMethod.callAsync()).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('GetSTODetails', () => {
    test('should call getSTODetails', async () => {
      const expectedStartTime = new Date(2025, 1);
      const expectedEndTime = new Date(2026, 1);
      const cap = new BigNumber(1);
      const rate = new BigNumber(1);
      const fundsRaised = new BigNumber(1);
      const totalTokensSold = new BigNumber(1);
      const expectedResult = [
        dateToBigNumber(expectedStartTime),
        dateToBigNumber(expectedEndTime),
        cap,
        rate,
        fundsRaised,
        new BigNumber(1),
        totalTokensSold,
        true,
      ];

      // Security Token, its address, and decimals mocked
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSTODetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getSTODetails();
      // Result expectation
      expect(result.startTime).toEqual(expectedStartTime);
      expect(result.endTime).toEqual(expectedEndTime);
      expect(result.cap).toEqual(weiToValue(cap, expectedDecimalsResult));
      expect(result.rate).toEqual(weiToValue(rate, FULL_DECIMALS));
      expect(result.fundsRaised).toEqual(weiToValue(fundsRaised, FULL_DECIMALS));
      expect(result.investorCount).toEqual(1);
      expect(result.totalTokensSold).toEqual(weiToValue(totalTokensSold, expectedDecimalsResult));
      expect(result.isRaisedInPoly).toBe(expectedResult[7]);

      // Verifications
      verify(mockedContract.getSTODetails).once();
      verify(mockedMethod.callAsync()).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
    });
  });

  describe('BuyTokens', () => {
    test('should buy tokens', async () => {
      // Address expected
      const expectedAllowBeneficialInvestmentResult = true;
      // Mocked method
      const mockedAllowBeneficialInvestmentMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.allowBeneficialInvestments).thenReturn(instance(mockedAllowBeneficialInvestmentMethod));
      // Stub the request
      when(mockedAllowBeneficialInvestmentMethod.callAsync()).thenResolve(expectedAllowBeneficialInvestmentResult);

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const expectedETHBalanceResult = valueToWei(new BigNumber(100), FULL_DECIMALS);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      when(mockedWrapper.getBalanceInWeiAsync(expectedOwnerResult)).thenResolve(expectedETHBalanceResult);

      // Pause Address expected
      const expectedPausedResult = false;
      // Mocked method
      const mockedPausedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPausedMethod));
      // Stub the request
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Address expected
      const expectedFundRaiseTypeResult = true;
      // Mocked method
      const mockedFundRaiseMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.fundRaiseTypes).thenReturn(instance(mockedFundRaiseMethod));
      // Stub the request
      when(mockedFundRaiseMethod.callAsync(FundRaiseType.ETH)).thenResolve(expectedFundRaiseTypeResult);

      const expectedStartTimeResult = new BigNumber(100);
      // Mocked method
      const mockedStartTimeMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.startTime).thenReturn(instance(mockedStartTimeMethod));
      // Stub the request
      when(mockedStartTimeMethod.callAsync()).thenResolve(expectedStartTimeResult);

      const expectedEndTimeResult = new BigNumber(1735689600);
      // Mocked method
      const mockedEndTimeMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.endTime).thenReturn(instance(mockedEndTimeMethod));
      // Stub the request
      when(mockedEndTimeMethod.callAsync()).thenResolve(expectedEndTimeResult);

      const mockedParams = {
        beneficiary: expectedOwnerResult,
        from: expectedOwnerResult,
        value: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };
      const txPayableData = {
        ...{},
        value: valueToWei(mockedParams.value, FULL_DECIMALS),
      };

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.buyTokens).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.buyTokens(mockedParams);
      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.buyTokens).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.beneficiary,
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.paused).once();
      verify(mockedPausedMethod.callAsync()).once();
      verify(mockedContract.fundRaiseTypes).once();
      verify(mockedFundRaiseMethod.callAsync(FundRaiseType.ETH));
      verify(mockedContract.allowBeneficialInvestments).once();
      verify(mockedAllowBeneficialInvestmentMethod.callAsync()).once();
      verify(mockedStartTimeMethod.callAsync()).once();
      verify(mockedContract.startTime).once();
      verify(mockedEndTimeMethod.callAsync()).once();
      verify(mockedContract.endTime).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).twice();
      verify(mockedWrapper.getBalanceInWeiAsync(expectedOwnerResult)).once();
    });
  });

  describe('BuyTokensWithPoly', () => {
    test('should buy tokens with poly', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';

      // Pause Address expected
      const expectedPausedResult = false;
      // Mocked method
      const mockedPausedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPausedMethod));
      // Stub the request
      when(mockedPausedMethod.callAsync()).thenResolve(expectedPausedResult);

      // Address expected
      const expectedFundRaiseTypeResult = true;
      // Mocked method
      const mockedFundRaiseMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.fundRaiseTypes).thenReturn(instance(mockedFundRaiseMethod));
      // Stub the request
      when(mockedFundRaiseMethod.callAsync(FundRaiseType.POLY)).thenResolve(expectedFundRaiseTypeResult);

      const expectedStartTimeResult = new BigNumber(100);
      // Mocked method
      const mockedStartTimeMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.startTime).thenReturn(instance(mockedStartTimeMethod));
      // Stub the request
      when(mockedStartTimeMethod.callAsync()).thenResolve(expectedStartTimeResult);

      const expectedEndTimeResult = new BigNumber(1735689600);
      // Mocked method
      const mockedEndTimeMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.endTime).thenReturn(instance(mockedEndTimeMethod));
      // Stub the request
      when(mockedEndTimeMethod.callAsync()).thenResolve(expectedEndTimeResult);

      // Security Token Address expected
      const expectedBalanceOfResult = valueToWei(new BigNumber(100), FULL_DECIMALS);
      // Setup get Security Token Address
      const mockedBalanceOfAddressMethod = mock(MockedCallMethod);
      when(mockedPolyTokenContract.balanceOf).thenReturn(instance(mockedBalanceOfAddressMethod));
      when(mockedBalanceOfAddressMethod.callAsync(expectedOwnerResult)).thenResolve(expectedBalanceOfResult);
      when(mockedContractFactory.getPolyTokenContract()).thenResolve(instance(mockedPolyTokenContract));
      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        from: expectedOwnerResult,
        investedPOLY: new BigNumber(1),
        txData: {},
        safetyFactor: 10,
      };

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.buyTokensWithPoly).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.investedPOLY, FULL_DECIMALS)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.buyTokensWithPoly(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);

      // Verifications
      verify(mockedContract.buyTokensWithPoly).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.investedPOLY, FULL_DECIMALS)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.paused).once();
      verify(mockedPausedMethod.callAsync()).once();
      verify(mockedContract.fundRaiseTypes).once();
      verify(mockedFundRaiseMethod.callAsync(FundRaiseType.POLY)).once();
      verify(mockedStartTimeMethod.callAsync()).once();
      verify(mockedContract.startTime).once();
      verify(mockedEndTimeMethod.callAsync()).once();
      verify(mockedContract.endTime).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to FeatureRegistryEvents', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: PolyTokenEvents.Transfer,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(
          `Expected eventName to be one of: 'TokenPurchase', 'SetAllowBeneficialInvestments', 'SetFundRaiseTypes', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});