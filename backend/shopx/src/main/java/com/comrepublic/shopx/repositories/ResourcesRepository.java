package com.comrepublic.shopx.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.comrepublic.shopx.entities.Resources;

@Repository
public interface ResourcesRepository extends JpaRepository<Resources, UUID> {
    
}
