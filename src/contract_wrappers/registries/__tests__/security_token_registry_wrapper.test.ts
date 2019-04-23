// PolymathRegistryWrapper test
import { instance, mock, reset, verify, when } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import { SecurityTokenRegistryContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import ContractWrapper from '../../contract_wrapper';
import { stringToBytes32 } from '../../../utils/convert';
import SecurityTokenRegistryWrapper from '../security_token_registry_wrapper';

describe('SecurityTokenRegistryWrapper', () => {
  // Declare PolyMathRegistryWrapper object
  let target: SecurityTokenRegistryWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: SecurityTokenRegistryContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(SecurityTokenRegistryContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new SecurityTokenRegistryWrapper(instance(mockedWrapper), myContractPromise);
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
  });

  describe('Types', () => {
    test('should extend ContractWrapper', async () => {
      expect(target instanceof ContractWrapper).toBe(true);
    });
  });

  describe('Pause Unpause', () => {
    test('should call to pause', async () => {
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.pause).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.pause(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.pause).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
    });

    test('should call to unpause', async () => {
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.unpause).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.unpause(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.unpause).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
    });

    test('should call to isPaused', async () => {
      // Address expected
      const expectedResult = false;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isPaused).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.isPaused();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.isPaused).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Ownership', () => {
    test('should call to transfer ownership', async () => {
      const newOwner = '0x0123456789012345678901234567890123456789';
      const mockedParams = {
        newOwner,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.transferOwnership).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(newOwner, mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.transferOwnership(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.transferOwnership).once();
      verify(mockedMethod.sendTransactionAsync(newOwner, mockedParams.txData, mockedParams.safetyFactor)).once();
    });

    test('should call owner', async () => {
      // Address expected
      const expectedResult = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.owner();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('ReclaimERC20', () => {
    test('should call to reclaim ERC20 tokens', async () => {
      const tokenContract = '0x0123456789012345678901234567890123456789';
      const mockedParams = {
        tokenContract,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.reclaimERC20).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.tokenContract, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.reclaimERC20(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.reclaimERC20).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.tokenContract, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
    });
  });

  describe('GetTickersByOwner', () => {
    test('should call getTickersByOwner', async () => {
      // Address expected
      const expectedResult = [stringToBytes32('123')];
      const ownerAddress = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickersByOwner).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ownerAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.getTickersByOwner({ owner: ownerAddress });
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getTickersByOwner).once();
      verify(mockedMethod.callAsync(ownerAddress)).once();
    });
  });

  describe('GetSecurityTokenData', () => {
    test('should call getSecurityTokenData', async () => {
      const expectedResult = {
        ticker: 'TICK',
        owner: '0x0123456789012345678901234567890123456789',
        tokenDetails: 'Details',
        deployedAt: new Date(0),
      };

      const expectedSCResult = ['TICK', '0x0123456789012345678901234567890123456789', 'Details', new BigNumber(0)];

      const securityTokenAddress = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSecurityTokenData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(securityTokenAddress)).thenResolve(expectedSCResult);

      // Real call
      const result = await target.getSecurityTokenData({ securityTokenAddress });
      // Result expectation
      expect(result).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.getSecurityTokenData).once();
      verify(mockedMethod.callAsync(securityTokenAddress)).once();
    });
  });

  describe('GetTokensByOwner', () => {
    test('should call getTokensByOwner', async () => {
      // Address expected
      const expectedResult = ['0x0123456789012345678901234567890123456789'];
      const ownerAddress = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTokensByOwner).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ownerAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.getTokensByOwner({ owner: ownerAddress });
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getTokensByOwner).once();
      verify(mockedMethod.callAsync(ownerAddress)).once();
    });
  });

  describe('GetTickerDetails', () => {
    test('should call getTickerDetails', async () => {
      const expectedResult = {
        owner: '0x0123456789012345678901234567890123456789',
        registrationDate: new Date(0),
        expiryDate: new Date(0),
        tokenName: 'tokenName',
        status: true,
      };

      const expectedSCResult = [
        '0x0123456789012345678901234567890123456789',
        new BigNumber(0),
        new BigNumber(0),
        'tokenName',
        true,
      ];

      const ticker = 'TICK';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickerDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ticker)).thenResolve(expectedSCResult);

      // Real call
      const result = await target.getTickerDetails({ tokenName: ticker });
      // Result expectation
      expect(result).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.getTickerDetails).once();
      verify(mockedMethod.callAsync(ticker)).once();
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
          `Expected eventName to be one of: 'Pause', 'Unpause', 'TickerRemoved', 'ChangeExpiryLimit', 'ChangeSecurityLaunchFee', 'ChangeTickerRegistrationFee', 'OwnershipTransferred', 'ChangeTickerOwnership', 'NewSecurityToken', 'RegisterTicker', encountered: Transfer`,
        ),
      );
    });
  });
});
