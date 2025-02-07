package com.comrepublic.shopx.auth.repositories;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import com.comrepublic.shopx.auth.entities.User;

public interface UserRepository extends JpaRepository<User, UUID> {
}