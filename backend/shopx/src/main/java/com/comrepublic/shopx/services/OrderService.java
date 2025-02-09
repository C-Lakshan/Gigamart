package com.comrepublic.shopx.services;

import com.stripe.model.PaymentIntent;
import com.comrepublic.shopx.auth.dto.OrderResponse;
import com.comrepublic.shopx.auth.entities.User;
import com.comrepublic.shopx.dto.OrderDetails;
import com.comrepublic.shopx.dto.OrderItemDetail;
import com.comrepublic.shopx.dto.OrderRequest;
import com.comrepublic.shopx.entities.*;
import com.comrepublic.shopx.repositories.OrderRepository;
import com.comrepublic.shopx.repositories.ProductVariantRepository;

import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.security.Principal;
import java.util.*;

@Service
public class OrderService {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    ProductService productService;

    @Autowired
    PaymentIntentService paymentIntentService;

    @Autowired
    private JavaMailSender mailSender; // JavaMailSender

    @Value("${spring.mail.username}")
    private String sender;

    @Transactional
    public OrderResponse createOrder(OrderRequest orderRequest, Principal principal) throws Exception {
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());
        Address address = user.getAddressList().stream()
                .filter(address1 -> orderRequest.getAddressId().equals(address1.getId())).findFirst()
                .orElseThrow(BadRequestException::new);

        Order order = Order.builder()
                .user(user)
                .address(address)
                .totalAmount(orderRequest.getTotalAmount())
                .orderDate(orderRequest.getOrderDate())
                .discount(orderRequest.getDiscount())
                .expectedDeliveryDate(orderRequest.getExpectedDeliveryDate())
                .paymentMethod(orderRequest.getPaymentMethod())
                .orderStatus(OrderStatus.PENDING)
                .build();
        List<OrderItem> orderItems = orderRequest.getOrderItemRequests().stream().map(orderItemRequest -> {
            try {
                Product product = productService.fetchProductById(orderItemRequest.getProductId());
                ProductVariant productVariant = product.getProductVariants().stream()
                        .filter(variant -> variant.getId().equals(orderItemRequest.getProductVariantId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Product variant not found"));

                // Check if the product variant quantity is sufficient
                if (productVariant.getStockQuantity() == 0) {
                    throw new RuntimeException("Product variant " + productVariant.getColor() + " "
                            + productVariant.getSize() + " is out of stock.");
                }

                // Check if the quantity requested exceeds the stock available
                if (orderItemRequest.getQuantity() > productVariant.getStockQuantity()) {
                    throw new RuntimeException("Not enough stock for product variant " + productVariant.getColor()
                            + " " + productVariant.getSize());
                }
                OrderItem orderItem = OrderItem.builder()
                        .product(product)
                        .productVariantId(orderItemRequest.getProductVariantId())
                        .quantity(orderItemRequest.getQuantity())
                        .order(order)
                        .build();
                // Decrease the stock quantity of the ordered product variant
                productVariant.setStockQuantity(productVariant.getStockQuantity() - orderItemRequest.getQuantity());
                // Save the updated ProductVariant back to the repository
                productVariantRepository.save(productVariant);

                return orderItem;
            } catch (Exception e) {
                throw new RuntimeException("Error processing order item: " + e.getMessage());
            }
        }).toList();

        order.setOrderItemList(orderItems);
        Payment payment = new Payment();
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setPaymentDate(new Date());
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(order.getPaymentMethod());
        order.setPayment(payment);
        Order savedOrder = orderRepository.save(order);
        System.out.println("Saved order");
        sendOrderConfirmationEmail(user, savedOrder);

        OrderResponse orderResponse = OrderResponse.builder()
                .paymentMethod(orderRequest.getPaymentMethod())
                .orderId(savedOrder.getId())
                .build();
        if (Objects.equals(orderRequest.getPaymentMethod(), "CARD")) {
            orderResponse.setCredentials(paymentIntentService.createPaymentIntent(order));
        }

        return orderResponse;

    }

    private void sendOrderConfirmationEmail(User user, Order order) {
        String orderId = order.getId().toString();

        String lastSixDigits = orderId.length() > 8
                ? orderId.substring(orderId.length() - 8)
                : orderId;
        String subject = "Order Confirmation - Order #GM-" + lastSixDigits;

        // HTML email content
        String message = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <style>" +
                "        .email-container {" +
                "            font-family: Arial, sans-serif;" +
                "            max-width: 600px;" +
                "            margin: 0 auto;" +
                "            border: 1px solid #ddd;" +
                "            border-radius: 10px;" +
                "            padding: 20px;" +
                "            background-color: #f9f9f9;" +
                "        }" +
                "        .logo {" +
                "            text-align: left;" +
                "            margin-bottom: 20px;" +
                "        }" +
                "        .logo img {" +
                "            max-width: 100px;" +
                "            height: auto;" +
                "        }" +
                "        .header {" +
                "            text-align: center;" +
                "            color: #333;" +
                "        }" +
                "        .order-details {" +
                "            margin-top: 20px;" +
                "            padding: 10px;" +
                "            background-color: #fff;" +
                "            border: 1px solid #ddd;" +
                "            border-radius: 5px;" +
                "        }" +
                "        .btn {" +
                "            display: inline-block;" +
                "            margin-top: 20px;" +
                "            padding: 10px 20px;" +
                "            color: #000 !important;" +
                "            background-color: #fff;" +
                "            text-decoration: none;" +
                "            border: 2px solid #000;" +
                "            border-radius: 5px;" +
                "            text-align: center;" +
                "        }" +
                "        .footer {" +
                "            margin-top: 30px;" +
                "            text-align: center;" +
                "            font-size: 12px;" +
                "            color: #888;" +
                "        }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='email-container'>" +
                "       <div class='logo'>" +
                "            <img src='https://i.ibb.co/FbBJxxBy/ONLINE-SHOPPING-1.png' alt='ShopX Logo'>" +
                "        </div>" +
                "        <h2 class='header'>Thank you for shopping with us!</h2>" +
                "        <p><strong>Dear " + user.getFirstName() + ",</strong></p>" +
                "        <p>Thank you for your order. Here are the details:</p>" +
                "        <div class='order-details'>" +
                "            <p><strong>Order ID:</strong> " + "GM" + lastSixDigits + "</p>" +
                "            <p><strong>Total Amount:</strong> $" + order.getTotalAmount() + "</p>" +
                "            <p><strong>Payment Method:</strong> " + order.getPaymentMethod() + "</p>" +
                "            <p><strong>Expected Delivery Date:</strong> " + order.getExpectedDeliveryDate() + "</p>" +
                "            <p><strong>Delivery Address:</strong><br>" +
                "                " + order.getAddress().getName() + ",<br>" +
                "                " + order.getAddress().getStreet() + ",<br>" +
                "                " + order.getAddress().getCity() + ", " + order.getAddress().getState() + ",<br>" +
                "                " + order.getAddress().getZipCode() + "<br>" +
                "                Phone: " + order.getAddress().getPhoneNumber() +
                "            </p>" +
                "        </div>" +
                "        <a class='btn' href='http://localhost:3000/'>Continue Shopping</a>" +
                "        <div class='footer'>" +
                "            <p>Best regards,</p>" +
                "            <p>GigaMart Team</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";

        try {
            // MIME message
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom(sender);
            helper.setTo(user.getEmail());
            helper.setSubject(subject);
            helper.setText(message, true); // 'true' to indicate HTML content

            mailSender.send(mimeMessage);
            System.out.println("HTML Email Sent Successfully!");
        } catch (Exception e) {
            System.out.println("Error while Sending HTML Email: " + e.getMessage());
        }
    }

    public Map<String, String> updateStatus(String paymentIntentId, String status) {

        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            if (paymentIntent != null && paymentIntent.getStatus().equals("succeeded")) {
                String orderId = paymentIntent.getMetadata().get("orderId");
                Order order = orderRepository.findById(UUID.fromString(orderId)).orElseThrow(BadRequestException::new);
                Payment payment = order.getPayment();
                payment.setPaymentStatus(PaymentStatus.COMPLETED);
                payment.setPaymentMethod(paymentIntent.getPaymentMethod());
                order.setPaymentMethod(paymentIntent.getPaymentMethod());
                // order.setOrderStatus(OrderStatus.IN_PROGRESS);
                order.setPayment(payment);
                Order savedOrder = orderRepository.save(order);
                Map<String, String> map = new HashMap<>();
                map.put("orderId", String.valueOf(savedOrder.getId()));
                return map;
            } else {
                throw new IllegalArgumentException("PaymentIntent not found or missing metadata");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("PaymentIntent not found or missing metadata");
        }
    }

    public List<OrderDetails> getOrdersByUser(String name) {
        User user = (User) userDetailsService.loadUserByUsername(name);
        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream().map(order -> {
            return OrderDetails.builder()
                    .id(order.getId())
                    .orderDate(order.getOrderDate())
                    .orderStatus(order.getOrderStatus())
                    .shipmentNumber(order.getShipmentTrackingNumber())
                    .address(order.getAddress())
                    .totalAmount(order.getTotalAmount())
                    .orderItemList(getItemDetails(order.getOrderItemList()))
                    .expectedDeliveryDate(order.getExpectedDeliveryDate())
                    .build();
        }).toList();

    }

    private List<OrderItemDetail> getItemDetails(List<OrderItem> orderItemList) {

        return orderItemList.stream().map(orderItem -> {
            return OrderItemDetail.builder()
                    .id(orderItem.getId())
                    .itemPrice(orderItem.getItemPrice())
                    .product(orderItem.getProduct())
                    .productVariantId(orderItem.getProductVariantId())
                    .quantity(orderItem.getQuantity())
                    .build();
        }).toList();
    }

    public void cancelOrder(UUID id, Principal principal) {
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());
        Order order = orderRepository.findById(id).get();
        if (null != order && order.getUser().getId().equals(user.getId())) {
            order.setOrderStatus(OrderStatus.CANCELLED);
            // logic to refund amount
            orderRepository.save(order);
        } else {
            new RuntimeException("Invalid request");
        }
    }

    public List<OrderDetails> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(order -> {
            return OrderDetails.builder()
                    .id(order.getId())
                    .orderDate(order.getOrderDate())
                    .orderStatus(order.getOrderStatus())
                    .shipmentNumber(order.getShipmentTrackingNumber())
                    .address(order.getAddress())
                    .totalAmount(order.getTotalAmount())
                    .orderItemList(getItemDetails(order.getOrderItemList()))
                    .expectedDeliveryDate(order.getExpectedDeliveryDate())
                    .build();
        }).toList();
    }

}
