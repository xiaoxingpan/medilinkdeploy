package com.fsd08.MediLink.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fsd08.MediLink.entity.Department;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {

}
