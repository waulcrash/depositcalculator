package com.example.depositcalculator.impl;

import com.example.depositcalculator.dto.DepositRequest;
import com.example.depositcalculator.dto.DepositResponse;
import com.example.depositcalculator.service.impl.DepositServiceImpl;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class DepositServiceImplTest {
    
    private DepositServiceImpl depositService = new DepositServiceImpl();
    
   
    @Test
    void testCalculateBasicExample() {
        
        DepositRequest request = new DepositRequest();
        request.setAmount(new BigDecimal("100000"));
        request.setMonths(12);
        request.setRate(new BigDecimal("8.5"));
       
        DepositResponse result = depositService.calculate(request);
        
        assertNotNull(result);
        assertEquals(new BigDecimal("108839.09"), result.getTotal());
        assertEquals(new BigDecimal("8839.09"), result.getProfit());
    }
    
    @Test
    void testCalculateMinimumValues() {
        
        DepositRequest request = new DepositRequest();
        request.setAmount(new BigDecimal("1000"));
        request.setMonths(1);
        request.setRate(new BigDecimal("1.0"));
      
        DepositResponse result = depositService.calculate(request);
       
        assertEquals(new BigDecimal("1000.83"), result.getTotal());
        assertEquals(new BigDecimal("0.83"), result.getProfit());
    }
    
    @Test
    void testCalculateOneMonth() {
       
        DepositRequest request = new DepositRequest();
        request.setAmount(new BigDecimal("1000"));
        request.setMonths(1);
        request.setRate(new BigDecimal("12.0"));
       
        DepositResponse result = depositService.calculate(request);
        
        // (1000 * (1 + 0.12/12) = 1010)
        assertEquals(new BigDecimal("1010.00"), result.getTotal());
        assertEquals(new BigDecimal("10.00"), result.getProfit());
    }
}