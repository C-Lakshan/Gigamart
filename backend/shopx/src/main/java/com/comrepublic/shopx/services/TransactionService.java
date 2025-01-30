package com.comrepublic.shopx.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.comrepublic.shopx.entities.Payment;
import com.comrepublic.shopx.repositories.PaymentRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TransactionService {
    private final PaymentRepository paymentRepository;

    public TransactionService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // public Payment createPayment(Payment payment) {
    //     return paymentRepository.save(payment);
    // }

    // Get a payment by its ID
    public Optional<Payment> getPaymentById(UUID paymentId) {
        return paymentRepository.findById(paymentId);
    }

    // Get all payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // public Payment updatePayment(UUID paymentId, Payment paymentDetails) {
    //     Payment existingPayment = paymentRepository.findById(paymentId).orElseThrow(() -> new IllegalArgumentException("Payment not found"));

    //     existingPayment.setPaymentDate(paymentDetails.getPaymentDate());
    //     existingPayment.setAmount(paymentDetails.getAmount());
    //     existingPayment.setPaymentMethod(paymentDetails.getPaymentMethod());
    //     existingPayment.setPaymentStatus(paymentDetails.getPaymentStatus());

    //     return paymentRepository.save(existingPayment);
    // }

    public void deletePayment(UUID paymentId) {
        paymentRepository.deleteById(paymentId);
    }
}
