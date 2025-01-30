package com.comrepublic.shopx.dto;

import com.comrepublic.shopx.entities.PaymentStatus;
import lombok.Data;
import java.util.Date;
import java.util.UUID;

@Data
public class PaymentDTO {
    private UUID id;
    private UUID orderId;
    private Date paymentDate;
    private Double amount;
    private String paymentMethod;
    private PaymentStatus paymentStatus;
}