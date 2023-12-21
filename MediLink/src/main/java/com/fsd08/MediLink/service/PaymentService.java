package com.fsd08.MediLink.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentIntentListParams;
import com.stripe.param.PaymentIntentSearchParams;

import java.util.List;

@Service
public class PaymentService {
    @Value("${STRIPE_API_KEY}")
    public String stripeApiKey;

    public PaymentService() {

    }

    public PaymentIntent createPaymentIntent(long amount, String currency, String description, int appointmentId)
            throws StripeException {
        Stripe.apiKey = stripeApiKey;
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency(currency)
                .putMetadata("appointmentId", Integer.toString(appointmentId))
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build())
                .build();

        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            return paymentIntent;
        } catch (StripeException e) {
            e.printStackTrace();
            return null;
        }

    }

    public List<PaymentIntent> getPaymentIntents(int appointmentId) throws StripeException {
        Stripe.apiKey = stripeApiKey;
        String query = String.format("metadata['appointmentId']:'%s'", appointmentId);
        PaymentIntentSearchParams params = PaymentIntentSearchParams.builder().setQuery(query).build();
        List<PaymentIntent> paymentIntents = PaymentIntent.search(params).getData();
        return paymentIntents;
    }

    public int getPaymentIntentsSucceededCount(int appointmentId) {
        try {
            List<PaymentIntent> paymentIntents = getPaymentIntents(appointmentId);
            return (int) paymentIntents.stream().filter(p -> p.getStatus().equals("succeeded")).count();
        } catch (StripeException e) {
            return 0;
        }
    }

}
