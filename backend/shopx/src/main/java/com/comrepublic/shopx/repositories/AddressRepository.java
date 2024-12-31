package com.comrepublic.shopx.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.comrepublic.shopx.entities.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {
    
}
