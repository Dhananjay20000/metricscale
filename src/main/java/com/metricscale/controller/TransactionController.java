package com.metricscale.controller;

import com.metricscale.entity.Transaction;
import com.metricscale.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    // 1. Get all transactions for the tenant specified in the header
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionRepository.findAll());
    }

    // 2. Create a quick sample transaction for testing
    @PostMapping("/sample")
    public ResponseEntity<Transaction> createSampleTransaction(@RequestParam String customerName, @RequestParam BigDecimal amount) {
        Transaction tx = Transaction.builder()
                .customerName(customerName)
                .amount(amount)
                .status("SUCCESS")
                .build();
        
        return ResponseEntity.ok(transactionRepository.save(tx));
    }
}