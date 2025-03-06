package com.comrepublic.shopx.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import com.comrepublic.shopx.dto.ProductDto;
import com.comrepublic.shopx.dto.ProductResourceDto;
import com.comrepublic.shopx.dto.ProductVariantDto;
import com.comrepublic.shopx.entities.*;
import com.comrepublic.shopx.services.CategoryService;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    @Autowired
    private CategoryService categoryService;

    public Product mapToProductEntity(ProductDto productDto){
        Product product = new Product();
        if(null != productDto.getId()){
            product.setId(productDto.getId());
        }
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setBrand(productDto.getBrand());
        product.setNewArrival(productDto.getNewArrival());
        product.setPrice(productDto.getPrice());
        product.setRating(productDto.getRating());
        product.setSlug(productDto.getSlug());

        Category category = categoryService.getCategory(productDto.getCategoryId());
        if(null != category){
            product.setCategory(category);
            UUID categoryTypeId = productDto.getCategoryTypeId();

            CategoryType categoryType = category.getCategoryTypes().stream().filter(categoryType1 -> categoryType1.getId().equals(categoryTypeId)).findFirst().orElse(null);
            product.setCategoryType(categoryType);
        }

        if(null != productDto.getVariants()){
            product.setProductVariants(mapToProductVariant(productDto.getVariants(),product));
        }

        if(null != productDto.getProductResources()){
            product.setResources(mapToProductResources(productDto.getProductResources(),product));
        }

        return product;
    }

    private List<Resources> mapToProductResources(List<ProductResourceDto> productResources, Product product) {
        return productResources.stream().map(productResourceDto -> {
            Resources resources= new Resources();
            if(null != productResourceDto.getId()){
                resources.setId(productResourceDto.getId());
            }
            resources.setName(productResourceDto.getName());
            resources.setType(productResourceDto.getType());
            resources.setUrl(productResourceDto.getUrl());
            resources.setIsPrimary(productResourceDto.getIsPrimary());
            resources.setProduct(product);
            return resources;
        }).collect(Collectors.toList());
    }

    private List<ProductVariant> mapToProductVariant(List<ProductVariantDto> productVariantDtos, Product product){
        return productVariantDtos.stream().map(productVariantDto -> {
            ProductVariant productVariant = new ProductVariant();
            if(null != productVariantDto.getId()){
                productVariant.setId(productVariantDto.getId());
            }
            productVariant.setColor(productVariantDto.getColor());
            productVariant.setSize(productVariantDto.getSize());
            productVariant.setStockQuantity(productVariantDto.getStockQuantity());
            productVariant.setProduct(product);
            return productVariant;
        }).collect(Collectors.toList());
    }

    public List<ProductDto> getProductDtos(List<Product> products) {
        if (products == null) {
            return Collections.emptyList();
        }
        return products.stream()
                .filter(Objects::nonNull)
                .map(this::mapProductToDto)
                .collect(Collectors.toList());
    }

    public ProductDto mapProductToDto(Product product) {
        if (product == null) {
            return null;
        }

        String thumbnail = null;
        if (product.getResources() != null && !product.getResources().isEmpty()) {
            thumbnail = getProductThumbnail(product.getResources());
        }

        ProductDto productDto = ProductDto.builder()
                .id(product.getId())
                .brand(product.getBrand())
                .name(product.getName())
                .price(product.getPrice())
                .newArrival(product.getNewArrival())
                .rating(product.getRating())
                .description(product.getDescription())
                .slug(product.getSlug())
                .thumbnail(thumbnail)
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .categoryTypeId(product.getCategoryType() != null ? product.getCategoryType().getId() : null)
                .categoryTypeName(product.getCategoryType() != null ? product.getCategoryType().getName() : null)
                .build();

        if (product.getProductVariants() != null && !product.getProductVariants().isEmpty()) {
            productDto.setVariants(mapProductVariantListToDto(product.getProductVariants()));
        }

        if (product.getResources() != null && !product.getResources().isEmpty()) {
            productDto.setProductResources(mapProductResourcesListDto(product.getResources()));
        }

        return productDto;
    }

    private String getProductThumbnail(List<Resources> resources) {
        if (resources == null || resources.isEmpty()) {
            return null;
        }
        return resources.stream()
                .filter(r -> r != null && Boolean.TRUE.equals(r.getIsPrimary()))
                .map(Resources::getUrl)
                .findFirst()
                .orElse(null);
    }

    public List<ProductVariantDto> mapProductVariantListToDto(List<ProductVariant> productVariants) {
        if (productVariants == null) {
            return Collections.emptyList();
        }
        return productVariants.stream()
                .filter(Objects::nonNull)
                .map(this::mapProductVariantDto)
                .collect(Collectors.toList());
    }

    private ProductVariantDto mapProductVariantDto(ProductVariant productVariant) {
        if (productVariant == null) {
            return null;
        }
        return ProductVariantDto.builder()
                .color(productVariant.getColor())
                .id(productVariant.getId())
                .size(productVariant.getSize())
                .stockQuantity(productVariant.getStockQuantity())
                .build();
    }

    public List<ProductResourceDto> mapProductResourcesListDto(List<Resources> resources) {
        if (resources == null) {
            return Collections.emptyList();
        }
        return resources.stream()
                .filter(Objects::nonNull)
                .map(this::mapResourceToDto)
                .collect(Collectors.toList());
    }

    private ProductResourceDto mapResourceToDto(Resources resources) {
        if (resources == null) {
            return null;
        }
        return ProductResourceDto.builder()
                .id(resources.getId())
                .url(resources.getUrl())
                .name(resources.getName())
                .isPrimary(resources.getIsPrimary())
                .type(resources.getType())
                .build();
    }

}