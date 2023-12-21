package com.fsd08.MediLink.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fsd08.MediLink.entity.Message;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

}
