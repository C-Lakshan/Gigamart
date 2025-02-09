package com.comrepublic.shopx.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.comrepublic.shopx.dto.DashboardStats;
import com.comrepublic.shopx.entities.Payment;
import com.comrepublic.shopx.repositories.PaymentRepository;

import java.sql.Date;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;

@Service
public class TransactionService {
    private final PaymentRepository paymentRepository;

    public TransactionService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // public Payment createPayment(Payment payment) {
    // return paymentRepository.save(payment);
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
    // Payment existingPayment =
    // paymentRepository.findById(paymentId).orElseThrow(() -> new
    // IllegalArgumentException("Payment not found"));

    // existingPayment.setPaymentDate(paymentDetails.getPaymentDate());
    // existingPayment.setAmount(paymentDetails.getAmount());
    // existingPayment.setPaymentMethod(paymentDetails.getPaymentMethod());
    // existingPayment.setPaymentStatus(paymentDetails.getPaymentStatus());

    // return paymentRepository.save(existingPayment);
    // }

    public void deletePayment(UUID paymentId) {
        paymentRepository.deleteById(paymentId);
    }

    public List<Payment> getPaymentsBetweenDates(Date startDate, Date endDate) {
        // Convert sql.Date to util.Date 
        Calendar cal = Calendar.getInstance();
        
        // Convert and set start time to beginning of day
        java.util.Date utilStartDate = new java.util.Date(startDate.getTime());
        cal.setTime(utilStartDate);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        java.util.Date start = cal.getTime();
        
        // Convert and set end time to end of day
        java.util.Date utilEndDate = new java.util.Date(endDate.getTime());
        cal.setTime(utilEndDate);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        java.util.Date end = cal.getTime();
        
        return paymentRepository.findPaymentsBetweenDates(start, end);
    }

    public DashboardStats getDashboardStats() {
        List<Payment> allPayments = getAllPayments();

        DashboardStats stats = new DashboardStats();
        stats.setTotalTransactions(allPayments.size());
        stats.setTotalSales(allPayments.stream()
                .mapToDouble(Payment::getAmount)
                .sum());
        stats.setTotalOrders((long) allPayments.stream()
                .map(payment -> payment.getOrder().getId())
                .distinct()
                .count());

        return stats;
    }
}
