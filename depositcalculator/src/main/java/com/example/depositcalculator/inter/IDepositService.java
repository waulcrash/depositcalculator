package com.example.depositcalculator.inter;

import com.example.depositcalculator.dto.DepositRequest;
import com.example.depositcalculator.dto.DepositResponse;

public interface IDepositService {
    DepositResponse calculate(DepositRequest request);
}