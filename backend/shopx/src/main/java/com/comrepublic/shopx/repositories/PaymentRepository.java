package com.comrepublic.shopx.repositories;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.comrepublic.shopx.entities.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
    List<Payment> findPaymentsBetweenDates(@Param("startDate") java.util.Date startDate,
            @Param("endDate") java.util.Date endDate);

    Payment findByOrderId(UUID orderId);
    void deleteByOrderId(UUID orderId);
}
