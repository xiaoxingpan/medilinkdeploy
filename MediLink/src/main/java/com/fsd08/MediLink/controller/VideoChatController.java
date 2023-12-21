package com.fsd08.MediLink.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("videochat")
public class VideoChatController {
    @CrossOrigin
    @GetMapping("/auth")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestParam("appointmentId") int appointmentId) {

        Map<String, String> returnData = new HashMap<>();
        // todo: validate user from token and appointment record

        // return ResponseEntity.status(400).body(returnData);
        returnData.put("Role", "DOCTOR");
        return ResponseEntity.ok(returnData);

    }
}
