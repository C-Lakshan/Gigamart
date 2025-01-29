package com.comrepublic.shopx.entities;

public class DashboardData {
    private int users;
    private int sales;
    private int totalCustomers;
    private int totalOrders;
    private int totalTransactions;
    private int[] transactionsPerMonth;

    // Constructors
    public DashboardData(int users, int sales, int totalCustomers, int totalOrders, int totalTransactions, int[] transactionsPerMonth) {
        this.users = users;
        this.sales = sales;
        this.totalCustomers = totalCustomers;
        this.totalOrders = totalOrders;
        this.totalTransactions = totalTransactions;
        this.transactionsPerMonth = transactionsPerMonth;
    }

    // Getters and setters
    public int getUsers() {
        return users;
    }

    public void setUsers(int users) {
        this.users = users;
    }

    public int getSales() {
        return sales;
    }

    public void setSales(int sales) {
        this.sales = sales;
    }

    public int getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(int totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public int getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(int totalOrders) {
        this.totalOrders = totalOrders;
    }

    public int getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(int totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public int[] getTransactionsPerMonth() {
        return transactionsPerMonth;
    }

    public void setTransactionsPerMonth(int[] transactionsPerMonth) {
        this.transactionsPerMonth = transactionsPerMonth;
    }
}
