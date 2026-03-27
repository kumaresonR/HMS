package com.hms.services.adminmanagement.service;

import com.hms.services.adminmanagement.entity.HMS_TM_Product;
import com.hms.services.adminmanagement.entity.HMS_TW_Product;
import com.hms.services.adminmanagement.repository.HMS_TM_ProductRepository;
import com.hms.services.adminmanagement.repository.HMS_TW_ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private HMS_TM_ProductRepository tmProductRepository;

    @Autowired
    private HMS_TW_ProductRepository twProductRepository;

    public HMS_TW_Product createProduct(HMS_TW_Product product) {
        return twProductRepository.save(product);
    }

    public HMS_TW_Product getProductById(String id) {
        return twProductRepository.findByIdAndDeletedFalse(id)
                .orElse(null);
    }

    public List<HMS_TW_Product> getAllProductsTW() {
        return twProductRepository.findByDeletedFalse();
    }

    public HMS_TW_Product updateProduct(String id, HMS_TW_Product updatedProduct) {
        HMS_TW_Product existingProduct = getProductById(id);
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setType(updatedProduct.getType());
        existingProduct.setModNo(updatedProduct.getModNo());
        return twProductRepository.save(existingProduct);
    }

    public HMS_TM_Product approveProduct(String id) {

        HMS_TW_Product product = getProductById(id);

        if ("UNAUTHORIZED".equalsIgnoreCase(product.getAuthStat())) {
            HMS_TM_Product tmProduct = new HMS_TM_Product();
            tmProduct.setName(product.getName());
            tmProduct.setType(product.getType());
            tmProduct.setAuthStat("AUTHORIZED");
            tmProduct.setId(product.getId());
            tmProduct.setModNo(product.getModNo());

            tmProductRepository.save(tmProduct);

            product.setAuthStat("AUTHORIZED");
            product.setRecordStat("OPENED");
            twProductRepository.save(product);

            return tmProduct;
        } else {
            throw new RuntimeException("Product is already approved or rejected");
        }
    }

    public void deleteProduct(String id, String authStat) {
        HMS_TM_Product tmProduct = tmProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found in TM with id: " + id));

        if ("UNAUTHORIZED".equalsIgnoreCase(authStat)) {
            tmProductRepository.delete(tmProduct);

            Optional<HMS_TW_Product> twProductOptional = twProductRepository.findById(id);

            if (twProductOptional.isPresent()) {
                HMS_TW_Product twProduct = twProductOptional.get();
                twProduct.setAuthStat("UNAUTHORIZED");
                twProduct.setRecordStat("CLOSED");
                twProductRepository.save(twProduct);
            }
        } else {
            throw new RuntimeException("Invalid authorization status. Only UNAUTHORIZED status is allowed for deletion.");
        }
    }

    public HMS_TM_Product getProductByIds(String id) {
        return tmProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    public List<HMS_TM_Product> getAllProductsTM() {
        return tmProductRepository.findAll();
    }

    public HMS_TM_Product updateProduct(String id, HMS_TM_Product updatedProduct) {
        HMS_TM_Product existingProduct = getProductByIds(id);
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setType(updatedProduct.getType());
        return tmProductRepository.save(existingProduct);
    }

    public void deleteTwProduct(String id) {
        HMS_TW_Product product = twProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
        product.setDeleted(true);
        twProductRepository.save(product);
    }
}




