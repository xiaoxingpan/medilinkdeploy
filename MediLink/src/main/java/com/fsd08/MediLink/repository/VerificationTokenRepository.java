package com.fsd08.MediLink.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fsd08.MediLink.entity.VerificationToken;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    VerificationToken findByToken(String token);
}