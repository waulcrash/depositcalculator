package com.example.depositcalculator.dto;


import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;


@Data
public class DepositRequest {
    @NotNull(message = "Сумма не может быть пустой")
    @DecimalMin(value = "1000.00", message = "Минимальная сумма: 1000")
    @DecimalMax(value = "10000000.00", message = "Максимальная сумма: 10 000 000")
    private BigDecimal amount;
    
    @NotNull(message = "Срок не может быть пустым")
    @Min(value = 1, message = "Минимальный срок: 1 месяц")
    @Max(value = 60, message = "Максимальный срок: 60 месяцев")
    private Integer months;
    
    @NotNull(message = "Ставка не может быть пустой")
    @DecimalMin(value = "1.00", message = "Минимальная ставка: 1%")
    @DecimalMax(value = "20.00", message = "Максимальная ставка: 20%")
    private BigDecimal rate;
}
