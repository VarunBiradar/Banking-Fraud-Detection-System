package com.fraud.repository;

import com.fraud.model.Transaction;
import com.fraud.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserOrderByTimestampDesc(User user);
    List<Transaction> findAllByOrderByTimestampDesc();
}
