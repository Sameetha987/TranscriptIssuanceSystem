package com.academic.TranscriptSystem.blockchain.service.impl;

import com.academic.TranscriptSystem.blockchain.service.BlockchainService;
import com.academic.TranscriptSystem.service.impl.VerificationServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

import java.util.Arrays;
import java.util.List;

@Service
public class BlockchainServiceImpl implements BlockchainService {

    private final Web3j web3j;
    private final Credentials credentials;
    private final ContractGasProvider gasProvider;

    private final String CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    private static final Logger log = LoggerFactory.getLogger(BlockchainServiceImpl.class);

    public BlockchainServiceImpl(Web3j web3j,
                                 Credentials credentials,
                                 ContractGasProvider gasProvider) {
        this.web3j = web3j;
        this.credentials = credentials;
        this.gasProvider = gasProvider;
    }

    @Override
    public String storeHash(String hash) {
        try {

            Function function = new Function(
                    "storeHash",
                    Arrays.asList(new Utf8String(hash)),
                    Arrays.asList(new TypeReference<org.web3j.abi.datatypes.generated.Uint256>() {})
            );

            String encodedFunction = FunctionEncoder.encode(function);

            RawTransactionManager txManager =
                    new RawTransactionManager(web3j, credentials);

            EthSendTransaction receipt =
                    txManager.sendTransaction(
                            gasProvider.getGasPrice(),
                            gasProvider.getGasLimit(),
                            CONTRACT_ADDRESS,
                            encodedFunction,
                            null
                    );
            return receipt.getTransactionHash();

        } catch (Exception e) {
            log.error("Blockchain transaction failed", e);
            throw new RuntimeException("Blockchain transaction failed", e);
        }
    }

    @Override
    public String getHashFromBlockchain(String txId) {
        try {

            Function function = new Function(
                    "getHash",
                    Arrays.asList(new org.web3j.abi.datatypes.generated.Uint256(java.math.BigInteger.ONE)),
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

            return output.isEmpty() ? null : output.get(0).getValue().toString();

        } catch (Exception e) {
            throw new RuntimeException("Blockchain fetch failed", e);
        }
    }

}
