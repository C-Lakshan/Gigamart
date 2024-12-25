package com.comrepublic.shopx.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "category_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryType {

    @Id
    @GeneratedValue
    private UUID id;

    // @Column(nullable = false)
    @Column
    private String name;

    // @Column(nullable = false)
    @Column
    private String code;
// 
    // @Column(nullable = false)
    @Column
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id"/* ,nullable = false*/)
    @JsonIgnore
    private Category category;
}
