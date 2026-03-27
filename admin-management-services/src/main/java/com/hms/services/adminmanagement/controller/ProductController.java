package com.hms.services.adminmanagement.controller;

import com.hms.services.adminmanagement.entity.HMS_TM_Product;
import com.hms.services.adminmanagement.entity.HMS_TW_PathologyUnit;
import com.hms.services.adminmanagement.entity.HMS_TW_Product;
import com.hms.services.adminmanagement.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/create")
    public ResponseEntity<HMS_TW_Product> createProduct(@Valid @RequestBody HMS_TW_Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @GetMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Product> getProductById(@PathVariable String id) {
        try {
            HMS_TW_Product parameter = productService.getProductById(id);
            return new ResponseEntity<>(parameter, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/tw/all")
    public ResponseEntity<List<HMS_TW_Product>> getAllProductsTW() {
        List<HMS_TW_Product> products = productService.getAllProductsTW();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PutMapping("/tw/{id}")
    public ResponseEntity<HMS_TW_Product> updateProduct(
            @PathVariable String id, @Valid @RequestBody HMS_TW_Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<HMS_TM_Product> approveProduct(
            @PathVariable String id) {
        return ResponseEntity.ok(productService.approveProduct(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable String id,
            @RequestParam String authStat) {
        try {
            productService.deleteProduct(id, authStat);
            return ResponseEntity.ok("Product deleted from TM and status updated in TW.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product not found or cannot be deleted.");
        }
    }

    @GetMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Product> getProductByIds(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductByIds(id));
    }

    @GetMapping("/tm/all")
    public ResponseEntity<List<HMS_TM_Product>> getAllProductsTM() {
        List<HMS_TM_Product> products = productService.getAllProductsTM();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PutMapping("/tm/{id}")
    public ResponseEntity<HMS_TM_Product> updateProduct(
            @PathVariable String id, @Valid @RequestBody HMS_TM_Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/tw/{id}")
    public ResponseEntity<String> deleteTwProduct(@PathVariable String id) {
        productService.deleteTwProduct(id);
        return new ResponseEntity<>("Product marked as deleted.", HttpStatus.OK);
    }
}



