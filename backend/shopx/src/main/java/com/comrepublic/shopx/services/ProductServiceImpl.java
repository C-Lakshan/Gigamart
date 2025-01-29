package com.comrepublic.shopx.services;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.comrepublic.shopx.exceptions.ResourceNotFoundEx;
import com.comrepublic.shopx.mapper.ProductMapper;
import com.comrepublic.shopx.specification.ProductSpecification;

import com.comrepublic.shopx.dto.ProductDto;
import com.comrepublic.shopx.entities.Product;
import com.comrepublic.shopx.entities.ProductVariant;
import com.comrepublic.shopx.entities.Resources;
import com.comrepublic.shopx.repositories.ProductRepository;

import com.comrepublic.shopx.repositories.ProductVariantRepository;
import com.comrepublic.shopx.repositories.ResourcesRepository;

import java.util.UUID;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService{
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

        Specification<Product> productSpecification= Specification.where(null);

        if(null != categoryId){
            productSpecification = productSpecification.and(ProductSpecification.hasCategoryId(categoryId));
        }
        if(null != typeId){
            productSpecification = productSpecification.and(ProductSpecification.hasCategoryTypeId(typeId));
        }

        List<Product> products = productRepository.findAll(productSpecification);
        return productMapper.getProductDtos(products);
    }

    @Override
    public ProductDto getProductBySlug(String slug) {
        Product product= productRepository.findBySlug(slug);
        if(null == product){
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
        Product product= productRepository.findById(id).orElseThrow(()-> new ResourceNotFoundEx("Product Not Found!"));
        ProductDto productDto = productMapper.mapProductToDto(product);
        productDto.setCategoryId(product.getCategory().getId());
        productDto.setCategoryTypeId(product.getCategoryType().getId());
        productDto.setVariants(productMapper.mapProductVariantListToDto(product.getProductVariants()));
        productDto.setProductResources(productMapper.mapProductResourcesListDto(product.getResources()));
        return productDto;
    }

    @Override
    public Product updateProduct(ProductDto productDto, UUID id) {
        Product product= productRepository.findById(id).orElseThrow(()-> new ResourceNotFoundEx("Product Not Found!"));
        productDto.setId(product.getId());
        return productRepository.save(productMapper.mapToProductEntity(productDto));
    }

    @Override
    public Product fetchProductById(UUID id) throws Exception {
        return productRepository.findById(id).orElseThrow(BadRequestException::new);
    }

    @Override
    public boolean deleteProductById(UUID id) {
        // Find the product by ID
        Product product = productRepository.findById(id).orElse(null);

        if (product != null) {
            // Delete associated ProductVariants
            List<ProductVariant> productVariants = product.getProductVariants();
            if (productVariants != null) {
                productVariantRepository.deleteAll(productVariants);  // Delete all related product variants
            }

            // Delete associated Resources
            List<Resources> resources = product.getResources();
            if (resources != null) {
                resourcesRepository.deleteAll(resources);  // Delete all related resources
            }

            // Now, delete the product itself
            productRepository.delete(product);

            return true;  // Return true if the product was successfully deleted
        }

        return false;  // Return false if the product was not found
    }
    
}
