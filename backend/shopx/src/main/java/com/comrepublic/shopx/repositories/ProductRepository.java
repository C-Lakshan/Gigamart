package com.comrepublic.shopx.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.comrepublic.shopx.entities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

        Product findBySlug(String slug);

        @Query("SELECT p FROM Product p WHERE LOWER(p.slug) LIKE LOWER(CONCAT('%', :slugPart, '%'))")
        List<Product> searchBySlugPart(@Param("slugPart") String slugPart);

}
