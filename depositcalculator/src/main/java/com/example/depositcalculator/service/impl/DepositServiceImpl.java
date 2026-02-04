package com.example.depositcalculator.service.impl;

import com.example.depositcalculator.dto.DepositRequest;
import com.example.depositcalculator.dto.DepositResponse;
import com.example.depositcalculator.inter.IDepositService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

@Service
public class DepositServiceImpl implements IDepositService {
    
    @Override
    public DepositResponse calculate(DepositRequest request) {
        if (request.getAmount() == null || request.getMonths() == null || request.getRate() == null) {
            throw new IllegalArgumentException("Все поля должны быть заполнены");
        }
        
        BigDecimal monthlyRate = request.getRate()
            .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
            .divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP);
        
        BigDecimal base = BigDecimal.ONE.add(monthlyRate);
        BigDecimal multiplier = base.pow(request.getMonths(), MathContext.DECIMAL64);
        BigDecimal total = request.getAmount().multiply(multiplier);
        
        BigDecimal profit = total.subtract(request.getAmount());
        
        // Округление до 2 знаков
        total = total.setScale(2, RoundingMode.HALF_UP);
        profit = profit.setScale(2, RoundingMode.HALF_UP);
        
        return new DepositResponse(total, profit);
    }
}