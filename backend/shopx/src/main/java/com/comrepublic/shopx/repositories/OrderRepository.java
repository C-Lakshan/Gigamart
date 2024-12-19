package com.comrepublic.shopx.repositories;

import com.comrepublic.shopx.auth.entities.User;
import com.comrepublic.shopx.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findByUser(User user);
}
