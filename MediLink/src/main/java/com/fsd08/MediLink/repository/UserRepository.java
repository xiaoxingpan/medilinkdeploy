package com.fsd08.MediLink.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fsd08.MediLink.entity.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    User findByEmail(String email);

    User findById(int id);

    User findByUsernameOrEmail(String username, String email);
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

}
