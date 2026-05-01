package com.ecommerce.orderservice.controller;

import com.ecommerce.orderservice.dto.OrderRequest;
import com.ecommerce.orderservice.dto.ProductResponse;
import com.ecommerce.orderservice.model.Order;
import com.ecommerce.orderservice.model.OrderItem;
import com.ecommerce.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    @Value("${product.service.url}")
    private String productServiceUrl;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String placeOrder(@RequestBody OrderRequest orderRequest) {
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setUserId(orderRequest.getUserId());

        List<OrderItem> orderItems = orderRequest.getOrderItems().stream()
                .map(itemDto -> {
                    // Call Product Service to get price (simulation of inter-service comm)
                    ProductResponse product = restTemplate.getForObject(
                            productServiceUrl + "/api/products/" + itemDto.getProductId(),
                            ProductResponse.class
                    );
                    
                    OrderItem item = new OrderItem();
                    item.setProductId(itemDto.getProductId());
                    item.setQuantity(itemDto.getQuantity());
                    if (product != null) {
                        item.setPrice(product.getPrice());
                    }
                    return item;
                }).collect(Collectors.toList());

        order.setOrderItems(orderItems);
        orderRepository.save(order);
        return "Order Placed Successfully";
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @GetMapping("/info")
    public java.util.Map<String, String> getInfo() throws java.net.UnknownHostException {
        java.net.InetAddress ip = java.net.InetAddress.getLocalHost();
        return java.util.Map.of(
            "service", "Order Service",
            "hostname", ip.getHostName(),
            "ip", ip.getHostAddress()
        );
    }

    @GetMapping("/health")
    public String health() {
        return "Order Service is healthy";
    }

    @GetMapping("/health/db")
    public java.util.Map<String, String> healthDb() {
        try {
            orderRepository.count();
            return java.util.Map.of("database", "online");
        } catch (Exception e) {
            return java.util.Map.of("database", "offline", "error", e.getMessage());
        }
    }
}
