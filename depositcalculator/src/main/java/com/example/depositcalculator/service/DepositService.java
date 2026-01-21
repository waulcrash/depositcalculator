package com.example.depositcalculator.service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;

import com.example.depositcalculator.dto.DepositRequest;
import com.example.depositcalculator.dto.DepositResponse;

@Service
public class DepositService {
    
    public DepositResponse calculate(DepositRequest request) {
        BigDecimal monthlyRate = request.getRate()
            .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
            .divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP);
        
        // total = amount * (1 + monthlyRate)^months
        BigDecimal base = BigDecimal.ONE.add(monthlyRate); // (1 + monthlyRate)
        BigDecimal multiplier = base.pow(request.getMonths(), MathContext.DECIMAL64); // (1 + monthlyRate)^months
        BigDecimal total = request.getAmount().multiply(multiplier); // общая сумма
        
        // total - amount
        BigDecimal profit = total.subtract(request.getAmount()); 
        
        return new DepositResponse(total, profit);
    }
}
