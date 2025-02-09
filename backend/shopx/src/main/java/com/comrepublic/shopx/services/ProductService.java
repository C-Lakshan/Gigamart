package com.comrepublic.shopx.services;

import java.util.List;
import java.util.UUID;

import com.comrepublic.shopx.dto.ProductDto;
import com.comrepublic.shopx.entities.Product;
import com.comrepublic.shopx.entities.ProductVariant;

public interface ProductService {
    public Product addProduct(ProductDto product);

    public List<ProductDto> getAllProducts(UUID categoryId, UUID typeId);

    List<ProductDto> searchProductsBySlugPart(String slugPart);

    ProductDto getProductBySlug(String slug);

    ProductDto getProductById(UUID id);

    Product updateProduct(ProductDto productDto, UUID id);

    Product fetchProductById(UUID uuid) throws Exception;

    boolean deleteProductById(UUID id);

    List<ProductVariant> updateVariantsQuantity(UUID productId, Integer quantity);
}
