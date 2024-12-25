package com.comrepublic.shopx.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
    @Id
    @GeneratedValue
    private UUID id;

    // @Column(nullable = false)
    @Column
    private String name;

    // @Column(nullable = false)
    @Column
    private String code;

    // @Column(nullable = false)
    @Column
    private String description;

    @OneToMany(mappedBy = "category",cascade = CascadeType.ALL)
    private List<CategoryType> categoryTypes;
}
