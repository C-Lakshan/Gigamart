package com.comrepublic.shopx.repositories;


import com.comrepublic.shopx.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    void deleteByOrderId(UUID orderId);
    List<OrderItem> findByOrderId(UUID orderId);
}