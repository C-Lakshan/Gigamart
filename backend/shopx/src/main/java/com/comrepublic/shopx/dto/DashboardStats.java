package com.comrepublic.shopx.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardStats {
    private long totalUsers;
    private double totalSales;
    private long totalCustomers;
    private long totalOrders;
    private long totalTransactions;
    private double[] monthlySales;
}

