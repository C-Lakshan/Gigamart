package com.comrepublic.shopx.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.comrepublic.shopx.dto.DashboardStats;
import com.comrepublic.shopx.dto.PaymentDTO;
import com.comrepublic.shopx.entities.Payment;
import com.comrepublic.shopx.services.TransactionService;

import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {
    
    private final TransactionService transactionService;

    public PaymentController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        List<Payment> payments = transactionService.getAllPayments();
        List<PaymentDTO> paymentDTOs = payments.stream()
            .map(Payment::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(paymentDTOs);
    }

    // @GetMapping("/{paymentId}")
    // public ResponseEntity<Payment> getPaymentById(@PathVariable UUID paymentId) {
    //     Optional<Payment> payment = paymentService.getPaymentById(paymentId);
    //     return payment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    // }

    // @DeleteMapping("/{paymentId}")
    // public ResponseEntity<Void> deletePayment(@PathVariable UUID paymentId) {
    //     paymentService.deletePayment(paymentId);
    //     return ResponseEntity.noContent().build();
    // }

    @GetMapping("/transactionsBetweenDays")
    public ResponseEntity<List<PaymentDTO>> getTransactionsBetweenDates(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        
        // Convert String to java.sql.Date
        Date sqlStartDate = Date.valueOf(startDate);
        Date sqlEndDate = Date.valueOf(endDate);
        
        List<Payment> payments = transactionService.getPaymentsBetweenDates(sqlStartDate, sqlEndDate);
        List<PaymentDTO> paymentDTOs = payments.stream()
            .map(Payment::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(paymentDTOs);
    }

    
}