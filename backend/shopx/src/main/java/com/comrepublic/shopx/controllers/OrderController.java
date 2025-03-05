package com.comrepublic.shopx.controllers;

import com.stripe.model.PaymentIntent;
import com.comrepublic.shopx.auth.dto.OrderResponse;
import com.comrepublic.shopx.dto.OrderDetails;
import com.comrepublic.shopx.dto.OrderItemDetail;
import com.comrepublic.shopx.dto.OrderRequest;
import com.comrepublic.shopx.entities.Order;
import com.comrepublic.shopx.services.OrderService;
import com.comrepublic.shopx.services.PaymentIntentService;
import org.apache.coyote.BadRequestException;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/order")
@CrossOrigin
public class OrderController {

    @Autowired
    OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Principal principal) throws Exception {
        OrderResponse orderResponse = orderService.createOrder(orderRequest, principal);
        // return new ResponseEntity<>(order, HttpStatus.CREATED);

        return new ResponseEntity<>(orderResponse, HttpStatus.OK);
    }

    @PostMapping("/update-payment")
    public ResponseEntity<?> updatePaymentStatus(@RequestBody Map<String, String> request) {
        Map<String, String> response = orderService.updateStatus(request.get("paymentIntent"), request.get("status"));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<?> cancelOrder(@PathVariable UUID id, Principal principal) {
        orderService.cancelOrder(id, principal);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderDetails>> getOrderByUser(Principal principal) {
        List<OrderDetails> orders = orderService.getOrdersByUser(principal.getName());
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<OrderDetails>> getAllOrders() {
        List<OrderDetails> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrderById(@PathVariable UUID id) {
        try {
            boolean result = orderService.deleteOrderById(id);
            if (result) {
                return ResponseEntity.ok("Order deleted successfully.");
            } else {
                return ResponseEntity.badRequest().body("Order not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the order.");
        }
    }

}
