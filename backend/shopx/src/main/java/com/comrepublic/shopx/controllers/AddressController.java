package com.comrepublic.shopx.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comrepublic.shopx.dto.AddressRequest;
import com.comrepublic.shopx.entities.Address;
import com.comrepublic.shopx.services.AddressService;

@RestController
@RequestMapping("/api/address")
public class AddressController {
    
    @Autowired
    private AddressService addressService;

    @PostMapping
    public ResponseEntity<Address> createAddress(@RequestBody AddressRequest addressRequest, Principal principal){
        Address address = addressService.createAddress(addressRequest,principal);
        return new ResponseEntity<>(address, HttpStatus.OK);
    }
}
