package com.comrepublic.shopx.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "product_resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resources {
    @Id
    @GeneratedValue
    private UUID id;

    // @Column(nullable = false)
    @Column
    private String name;

    // @Column(nullable = false)
    @Column
    private String url;

    // @Column(nullable = false)
    @Column
    private Boolean isPrimary;

    // @Column(nullable = false)
    @Column
    private String type;

    @ManyToOne
    @JoinColumn(name = "product_id"/*,nullable = false*/)
    @JsonIgnore
    private Product product;
}
