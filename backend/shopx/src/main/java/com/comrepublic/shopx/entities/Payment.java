package com.comrepublic.shopx.entities;

import com.comrepublic.shopx.dto.PaymentDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name="payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id",nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Order order;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date paymentDate;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    public PaymentDTO toDTO() {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(this.getId());
        dto.setOrderId(this.getOrder() != null ? this.getOrder().getId() : null);
        dto.setPaymentDate(this.getPaymentDate());
        dto.setAmount(this.getAmount());
        dto.setPaymentMethod(this.getPaymentMethod());
        dto.setPaymentStatus(this.getPaymentStatus());
        return dto;
    }
}
