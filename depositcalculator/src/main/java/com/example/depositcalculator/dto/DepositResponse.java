package com.example.depositcalculator.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class DepositResponse {
    private BigDecimal total;
    private BigDecimal profit;

    public DepositResponse(BigDecimal total, BigDecimal profit){
        this.total = total.setScale(2, BigDecimal.ROUND_HALF_UP);
        this.profit = profit.setScale(2, BigDecimal.ROUND_HALF_UP);
    }
}
