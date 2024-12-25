package com.comrepublic.shopx.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Entity
@Table(name = "product_variant")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue
    private UUID id;

    // @Column(nullable = false)
    @Column
    private String color;

    // @Column(nullable = false)
    @Column
    private String size;

    // @Column(nullable = false)
    @Column
    private Integer stockQuantity;

    @ManyToOne
    @JoinColumn(name = "product_id"/*,nullable = false*/)
    @JsonIgnore
    private Product product;
}
