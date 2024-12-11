package com.comrepublic.shopx.specification;


import org.springframework.data.jpa.domain.Specification;
import com.comrepublic.shopx.entities.Product;
import java.util.UUID;


public class ProductSpecification {
    public static Specification<Product> hasCategoryId(UUID categorId){
        return  (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("category").get("id"),categorId);
    }

    public static Specification<Product> hasCategoryTypeId(UUID typeId){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("categoryType").get("id"),typeId);
    }
}

