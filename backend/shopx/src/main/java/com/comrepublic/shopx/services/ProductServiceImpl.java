package com.comrepublic.shopx.services;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.comrepublic.shopx.exceptions.ResourceNotFoundEx;
import com.comrepublic.shopx.mapper.ProductMapper;
import com.comrepublic.shopx.specification.ProductSpecification;

import jakarta.transaction.Transactional;

import com.comrepublic.shopx.dto.ProductDto;
import com.comrepublic.shopx.dto.ProductPartialUpdateDto;
import com.comrepublic.shopx.entities.Product;
import com.comrepublic.shopx.entities.ProductVariant;
import com.comrepublic.shopx.entities.Resources;
import com.comrepublic.shopx.repositories.ProductRepository;

import com.comrepublic.shopx.repositories.ProductVariantRepository;
import com.comrepublic.shopx.repositories.ResourcesRepository;

import java.util.UUID;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private ResourcesRepository resourcesRepository;

    @Override
    public Product addProduct(ProductDto productDto) {
        Product product = productMapper.mapToProductEntity(productDto);
        return productRepository.save(product);
    }

    @Override
    public List<ProductDto> getAllProducts(UUID categoryId, UUID typeId) {

        Specification<Product> productSpecification = Specification.where(null);

        if (null != categoryId) {
            productSpecification = productSpecification.and(ProductSpecification.hasCategoryId(categoryId));
        }
        if (null != typeId) {
            productSpecification = productSpecification.and(ProductSpecification.hasCategoryTypeId(typeId));
        }

        List<Product> products = productRepository.findAll(productSpecification);
        return productMapper.getProductDtos(products);
    }

    @Override
    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug);
        if (null == product) {
            throw new ResourceNotFoundEx("Product Not Found!");
        }
        ProductDto productDto = productMapper.mapProductToDto(product);
        productDto.setCategoryId(product.getCategory().getId());
        productDto.setCategoryTypeId(product.getCategoryType().getId());
        productDto.setVariants(productMapper.mapProductVariantListToDto(product.getProductVariants()));
        productDto.setProductResources(productMapper.mapProductResourcesListDto(product.getResources()));
        return productDto;
    }

    @Override
    public ProductDto getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundEx("Product Not Found!"));
        ProductDto productDto = productMapper.mapProductToDto(product);
        productDto.setCategoryId(product.getCategory().getId());
        productDto.setCategoryTypeId(product.getCategoryType().getId());
        productDto.setVariants(productMapper.mapProductVariantListToDto(product.getProductVariants()));
        productDto.setProductResources(productMapper.mapProductResourcesListDto(product.getResources()));
        return productDto;
    }

    @Override
    public Product updateProduct(ProductDto productDto, UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundEx("Product Not Found!"));
        productDto.setId(product.getId());
        return productRepository.save(productMapper.mapToProductEntity(productDto));
    }

    @Override
    public Product fetchProductById(UUID id) throws Exception {
        return productRepository.findById(id).orElseThrow(BadRequestException::new);
    }

    @Override
    public boolean deleteProductById(UUID id) {
        Product product = productRepository.findById(id).orElse(null);

        if (product != null) {
            List<ProductVariant> productVariants = product.getProductVariants();
            if (productVariants != null) {
                productVariantRepository.deleteAll(productVariants); 
            }

            List<Resources> resources = product.getResources();
            if (resources != null) {
                resourcesRepository.deleteAll(resources); 
            }

            productRepository.delete(product);

            return true; 
        }

        return false; 
    }

    @Override
    public List<ProductDto> searchProductsBySlugPart(String slugPart) {
        List<Product> products = productRepository.searchBySlugPart(slugPart);
        if (products.isEmpty()) {
            throw new ResourceNotFoundEx("No products found matching: " + slugPart);
        }
        return productMapper.getProductDtos(products);
    }

    @Override
    public List<ProductVariant> updateVariantsQuantity(UUID productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundEx("Product Not Found!"));

        List<ProductVariant> variants = productVariantRepository.findByProductId(productId);

        for (ProductVariant variant : variants) {
            variant.setStockQuantity(quantity); 
            productVariantRepository.save(variant); 
        }

        return variants;
    }

    @Override
    @Transactional
    public Product updateProductPartial(UUID productId, ProductPartialUpdateDto updateDto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundEx("Product Not Found!"));
        
        if (updateDto.getDescription() != null) {
            product.setDescription(updateDto.getDescription());
        }
        
        if (updateDto.getPrice() != null) {
            product.setPrice(updateDto.getPrice());
        }
        
        if (updateDto.getThumbnail() != null) {
            List<Resources> resources = product.getResources();
            boolean thumbnailUpdated = false;
            
            if (resources != null && !resources.isEmpty()) {
                for (Resources resource : resources) {
                    if (resource.getIsPrimary() || "thumbnail".equalsIgnoreCase(resource.getType())) {
                        resource.setUrl(updateDto.getThumbnail());
                        thumbnailUpdated = true;
                        break;
                    }
                }
            }
            
            if (thumbnailUpdated == false) {
                Resources newThumbnail = Resources.builder()
                        .name("thumbnail")
                        .url(updateDto.getThumbnail())
                        .isPrimary(true)
                        .type("thumbnail")
                        .product(product)
                        .build();
                
                if (resources == null) {
                    resources = new java.util.ArrayList<>();
                    product.setResources(resources);
                }
                resources.add(newThumbnail);
            }
        }
        
        if (updateDto.getVariantQuantity() != null) {
            List<ProductVariant> variants = product.getProductVariants();
            if (variants != null && !variants.isEmpty()) {
                for (ProductVariant variant : variants) {
                    variant.setStockQuantity(updateDto.getVariantQuantity());
                }
            }
        }
        
        return productRepository.save(product);
    }

}
