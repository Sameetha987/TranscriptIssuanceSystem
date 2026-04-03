package com.academic.TranscriptSystem.blockchain.service.impl;

import com.academic.TranscriptSystem.blockchain.dto.BlockchainResponse;
import com.academic.TranscriptSystem.blockchain.service.BlockchainService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.tx.FastRawTransactionManager;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.response.PollingTransactionReceiptProcessor;
import org.web3j.tx.response.TransactionReceiptProcessor;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;

@Service
public class BlockchainServiceImpl implements BlockchainService {

    private final Web3j web3j;
    private final Credentials credentials;
    private final ContractGasProvider gasProvider;

    private final String CONTRACT_ADDRESS = "0xfDA34B6E5eb594730d2d3C3E7a83fb4d27c5B369";
    private static final Logger log = LoggerFactory.getLogger(BlockchainServiceImpl.class);

    public BlockchainServiceImpl(Web3j web3j,
                                 Credentials credentials,
                                 ContractGasProvider gasProvider) {
        this.web3j = web3j;
        this.credentials = credentials;
        this.gasProvider = gasProvider;
    }

    @Override
    public BlockchainResponse storeHash(String hash) {

        try {

            Function function = new Function(
                    "storeHash",
                    Arrays.asList(new Utf8String(hash)),
                    Arrays.asList(new TypeReference<Uint256>() {})
            );

            String encodedFunction = FunctionEncoder.encode(function);

            RawTransactionManager txManager =
                    new RawTransactionManager(web3j, credentials);

            BigInteger gasPrice = web3j.ethGasPrice().send().getGasPrice();
            BigInteger gasLimit = BigInteger.valueOf(300000);

            EthSendTransaction response =
                    txManager.sendTransaction(
                            gasPrice,
                            gasLimit,
                            CONTRACT_ADDRESS,
                            encodedFunction,
                            BigInteger.ZERO
                    );

            if (response.hasError()) {
                throw new RuntimeException(response.getError().getMessage());
            }

            String txHash = response.getTransactionHash();

            //  WAIT UNTIL MINED
            TransactionReceiptProcessor receiptProcessor =
                    new PollingTransactionReceiptProcessor(web3j, 15000, 40);

            TransactionReceipt receipt =
                    receiptProcessor.waitForTransactionReceipt(txHash);

            log.info("Transaction mined: {}", receipt.getTransactionHash());

            //RECORD ID AFTER MINING
            Long recordId = getLatestRecordId();

            return new BlockchainResponse(txHash, recordId);

        } catch (Exception e) {
            throw new RuntimeException("Blockchain transaction failed", e);
        }
    }

    @Override
    public String getHashFromBlockchain(Long recordId) {
        try {
            Function function = new Function(
                    "getHash",
                    Arrays.asList(new org.web3j.abi.datatypes.generated.Uint256(
                            java.math.BigInteger.valueOf(recordId))),
                    Arrays.asList(new TypeReference<Utf8String>() {})
            );

            String encodedFunction = FunctionEncoder.encode(function);

            EthCall response = web3j.ethCall(
                    Transaction.createEthCallTransaction(
                            credentials.getAddress(),
                            CONTRACT_ADDRESS,
                            encodedFunction
                    ),
                    org.web3j.protocol.core.DefaultBlockParameterName.LATEST
            ).send();

            List<Type> output =
                    FunctionReturnDecoder.decode(
                            response.getValue(),
                            function.getOutputParameters()
                    );

            return output.isEmpty()
                    ? null
                    : output.get(0).getValue().toString();

        } catch (Exception e) {
            throw new RuntimeException("Blockchain fetch failed", e);
        }
    }
    @Override
    public Long getLatestRecordId() {

        try {

            Function function = new Function(
                    "recordCount",
                    Arrays.asList(),
                    Arrays.asList(new TypeReference<org.web3j.abi.datatypes.generated.Uint256>() {})
            );

            String encodedFunction = FunctionEncoder.encode(function);

            EthCall response = web3j.ethCall(
                    Transaction.createEthCallTransaction(
                            credentials.getAddress(),
                            CONTRACT_ADDRESS,
                            encodedFunction
                    ),
                    org.web3j.protocol.core.DefaultBlockParameterName.LATEST
            ).send();

            List<Type> output =
                    FunctionReturnDecoder.decode(
                            response.getValue(),
                            function.getOutputParameters()
                    );

            return output.isEmpty()
                    ? null
                    : ((java.math.BigInteger) output.get(0).getValue()).longValue();

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch record count", e);
        }
    }

}
