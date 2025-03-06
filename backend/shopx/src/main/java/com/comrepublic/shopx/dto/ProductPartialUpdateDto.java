package com.comrepublic.shopx.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductPartialUpdateDto {
    private String description;
    private BigDecimal price;
    private String thumbnail;
    private Integer variantQuantity;
}