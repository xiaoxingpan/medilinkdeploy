package com.fsd08.MediLink.controller;

import com.fsd08.MediLink.entity.Department;
import com.fsd08.MediLink.repository.DepartmentRepository;
import com.fsd08.MediLink.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.DELETE, RequestMethod.GET, RequestMethod.PUT, RequestMethod.POST})
@RequiredArgsConstructor
public class DepartmentController {
    private static final Logger logger = LoggerFactory.getLogger(DepartmentController.class);
    private final DepartmentRepository departmentRepository;


    private final DepartmentService departmentService;

//    public DepartmentController(DepartmentService departmentService, DepartmentRepository departmentRepository) {
//        this.departmentService = departmentService;
//        this.departmentRepository = departmentRepository;
//    }


    @GetMapping("/departments")
    public List<Department> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        logger.info("Retrieved {} departments from the database.", departments.size());
        return departments;
    }
    @GetMapping("/departments/{id}")
    public ResponseEntity<?> getOneDepartment(@PathVariable int id) {
        Optional<Department> department = departmentRepository.findById(id);
        return department.map(response -> ResponseEntity.ok().body(response)).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/departments")
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) throws URISyntaxException {
        Department result =departmentRepository.save(department);
        return ResponseEntity.created(new URI("/api/departments/" + result.getId())).body(result);
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable int id, @RequestBody Department department) {
        if (!departmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        department.setId(id);
        Department result = departmentRepository.save(department);
        return ResponseEntity.ok().body(result);
    }


    @DeleteMapping("/departments/{id}")
    public ResponseEntity<String> deleteDepartment(@PathVariable int id) {
        departmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }



}