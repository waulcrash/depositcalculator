package com.example.depositcalculator.controller;

import com.example.depositcalculator.dto.DepositRequest;
import com.example.depositcalculator.dto.DepositResponse;
import com.example.depositcalculator.service.DepositService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class DepositController {
    
    @Autowired
    private DepositService depositService;
    
    @PostMapping("/calculate")
    public ResponseEntity<DepositResponse> calculate(
            @Valid @RequestBody DepositRequest request) {
        DepositResponse response = depositService.calculate(request);
        return ResponseEntity.ok(response);
    }
}
