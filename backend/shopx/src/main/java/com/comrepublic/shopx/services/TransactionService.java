package com.comrepublic.shopx.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.comrepublic.shopx.auth.entities.User;
import com.comrepublic.shopx.auth.repositories.UserRepository;
import com.comrepublic.shopx.dto.DashboardStats;
import com.comrepublic.shopx.entities.Payment;
import com.comrepublic.shopx.repositories.PaymentRepository;

import java.sql.Date;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.format.annotation.DateTimeFormat;

@Service
public class TransactionService {
    private final PaymentRepository paymentRepository;
    @Autowired
    private UserRepository userRepository;

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

    // public DashboardStats getDashboardStats() {
    //     Calendar cal = Calendar.getInstance();
    //     java.util.Date end = cal.getTime();
    
    //     // Get sales for the last 12 months
    //     double[] monthlySales = new double[12];
    
    //     for (int i = 0; i < 12; i++) {
    //         // If it's the first iteration, set the start and end date for the current month
    //         if (i == 0) {
    //             cal.set(Calendar.DAY_OF_MONTH, 1); // Set the start date to the beginning of the current month
    //             cal.set(Calendar.HOUR_OF_DAY, 0);
    //             cal.set(Calendar.MINUTE, 0);
    //             cal.set(Calendar.SECOND, 0);
    //             java.util.Date start = cal.getTime();
    
    //             // Set the end date to the current date (could be today or the end of the day)
    //             cal.set(Calendar.HOUR_OF_DAY, 23);
    //             cal.set(Calendar.MINUTE, 59);
    //             cal.set(Calendar.SECOND, 59);
    //             end = cal.getTime();
    
    //             // Log the calculated start and end dates
    //             System.out.println("Fetching payments for the current month: " + start + " to " + end);
    //             List<Payment> monthlyPayments = paymentRepository.findPaymentsBetweenDates(start, end);
    //             System.out.println("Payments for this month: " + monthlyPayments.size());
                
    //             // Calculate total sales for this month
    //             double monthSales = monthlyPayments.stream()
    //                     .mapToDouble(Payment::getAmount)
    //                     .sum();
    //             BigDecimal roundedSales = new BigDecimal(monthSales).setScale(2, RoundingMode.HALF_UP);
    //             monthlySales[11] = roundedSales.doubleValue(); // Store the current month's sales in the last position (index 11)
    //         } else {
    //             // For previous months, adjust the calendar to get data from the past months
    //             cal.set(Calendar.MONTH, cal.get(Calendar.MONTH) - 1); // Move to the previous month
    //             cal.set(Calendar.DAY_OF_MONTH, 1); // Set the start date to the beginning of the month
    //             cal.set(Calendar.HOUR_OF_DAY, 0);
    //             cal.set(Calendar.MINUTE, 0);
    //             cal.set(Calendar.SECOND, 0);
    //             java.util.Date start = cal.getTime();
    
    //             cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH)); // Set the end date to the last day of the month
    //             cal.set(Calendar.HOUR_OF_DAY, 23);
    //             cal.set(Calendar.MINUTE, 59);
    //             cal.set(Calendar.SECOND, 59);
    //             end = cal.getTime();
    
    //             // Log the calculated start and end dates
    //             System.out.println("Fetching payments for: " + start + " to " + end);
    //             List<Payment> monthlyPayments = paymentRepository.findPaymentsBetweenDates(start, end);
    //             System.out.println("Payments for this month: " + monthlyPayments.size());
    
    //             // Calculate total sales for this month
    //             double monthSales = monthlyPayments.stream()
    //                     .mapToDouble(Payment::getAmount)
    //                     .sum();
    //             BigDecimal roundedSales = new BigDecimal(monthSales).setScale(2, RoundingMode.HALF_UP);
    //             monthlySales[11 - i] = roundedSales.doubleValue(); // Store the sales for previous months (reverse order)
    //         }
    //     }
    
    //     // Get stats for the last 30 days (as before)
    //     cal.set(Calendar.HOUR_OF_DAY, 23);
    //     cal.set(Calendar.MINUTE, 59);
    //     cal.set(Calendar.SECOND, 59);
    //     end = cal.getTime();
    //     cal.add(Calendar.DAY_OF_MONTH, -30);
    //     cal.set(Calendar.HOUR_OF_DAY, 0);
    //     cal.set(Calendar.MINUTE, 0);
    //     cal.set(Calendar.SECOND, 0);
    //     java.util.Date start = cal.getTime();
    
    //     List<Payment> last30DaysPayments = paymentRepository.findPaymentsBetweenDates(start, end);
    
    //     DashboardStats stats = new DashboardStats();
    //     stats.setTotalTransactions(last30DaysPayments.size());
    //     stats.setTotalSales(last30DaysPayments.stream()
    //             .mapToDouble(Payment::getAmount)
    //             .sum());
    //     stats.setTotalOrders((long) last30DaysPayments.stream()
    //             .map(payment -> payment.getOrder().getId())
    //             .distinct()
    //             .count());
    
    //     long totalCustomers = last30DaysPayments.stream()
    //             .map(payment -> payment.getOrder().getUser().getId())
    //             .distinct()
    //             .count();
    //     stats.setTotalCustomers(totalCustomers);
    //     stats.setTotalUsers(userRepository.count()); // Total users (not filtered by date)
    
    //     // Set the monthly sales array
    //     stats.setMonthlySales(monthlySales);
    
    //     return stats;
    // }


    public DashboardStats getDashboardStats() {
        Calendar cal = Calendar.getInstance();
        java.util.Date end = cal.getTime();
    
        // Get sales for the last 12 months
        double[] monthlySales = new double[12];
    
        for (int i = 0; i < 12; i++) {
            // Set the calendar to the first day of the current month being processed
            cal.set(Calendar.DAY_OF_MONTH, 1);
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            java.util.Date start = cal.getTime();
    
            // Set the end date to the last day of the current month
            cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
            cal.set(Calendar.HOUR_OF_DAY, 23);
            cal.set(Calendar.MINUTE, 59);
            cal.set(Calendar.SECOND, 59);
            end = cal.getTime();
    
            // Log the calculated start and end dates
            System.out.println("Fetching payments for: " + start + " to " + end);
            List<Payment> monthlyPayments = paymentRepository.findPaymentsBetweenDates(start, end);
            System.out.println("Payments for this month: " + monthlyPayments.size());
    
            // Calculate total sales for this month
            double monthSales = monthlyPayments.stream()
                    .mapToDouble(Payment::getAmount)
                    .sum();
            BigDecimal roundedSales = new BigDecimal(monthSales).setScale(2, RoundingMode.HALF_UP);
            monthlySales[11 - i] = roundedSales.doubleValue(); // Store the sales in reverse order
    
            // Move to the previous month for the next iteration
            cal.set(Calendar.DAY_OF_MONTH, 1); // Reset to first day before changing month
            cal.add(Calendar.MONTH, -1);
        }
    
        // Get stats for the last 30 days
        cal = Calendar.getInstance(); // Reset calendar to current date
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        end = cal.getTime();
        cal.add(Calendar.DAY_OF_MONTH, -30);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        java.util.Date start = cal.getTime();
    
        List<Payment> last30DaysPayments = paymentRepository.findPaymentsBetweenDates(start, end);
    
        DashboardStats stats = new DashboardStats();
        stats.setTotalTransactions(last30DaysPayments.size());
        stats.setTotalSales(last30DaysPayments.stream()
                .mapToDouble(Payment::getAmount)
                .sum());
        stats.setTotalOrders((long) last30DaysPayments.stream()
                .map(payment -> payment.getOrder().getId())
                .distinct()
                .count());
    
        long totalCustomers = last30DaysPayments.stream()
                .map(payment -> payment.getOrder().getUser().getId())
                .distinct()
                .count();
        stats.setTotalCustomers(totalCustomers);
        stats.setTotalUsers(userRepository.count());
    
        stats.setMonthlySales(monthlySales);
    
        return stats;
    }
    

}
