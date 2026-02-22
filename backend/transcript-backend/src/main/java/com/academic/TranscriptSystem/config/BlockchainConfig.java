package com.academic.TranscriptSystem.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.crypto.Credentials;
import org.web3j.tx.gas.DefaultGasProvider;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class BlockchainConfig {

    @Value("${blockchain.private-key}")
    private String privateKey;

    @Value("${blockchain.rpc-url}")
    private String rpcUrl;

    @Bean
    public Web3j web3j() {
        return Web3j.build(new HttpService(rpcUrl));
    }

    @Bean
    public Credentials credentials() {
        return Credentials.create(privateKey);
    }

    @Bean
    public DefaultGasProvider gasProvider() {
        return new DefaultGasProvider();
    }
}
