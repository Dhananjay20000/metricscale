package com.metricscale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.metricscale.entity.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    // Spring Data JPA methods like findAll() or save() will automatically 
    // be intercepted by our TenantFilterAspect aspect!
}