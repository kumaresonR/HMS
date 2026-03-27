import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    paymentGateway: string; // This will hold the selected payment gateway
}

interface FormErrors {
    paymentGateway?: string; // This will hold any validation errors related to the payment gateway
}

const PaymentMethod: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        paymentGateway: '', // Initialize with an empty string
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.paymentGateway) newErrors.paymentGateway = 'Please select a payment gateway';
        return newErrors;
    };

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const updatedData = { ...formData, paymentGateway: value };
        setFormData(updatedData);

        // Validate on change
        const newErrors = validateForm(updatedData);
        setErrors(newErrors);
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent form from refreshing the page

        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch("http://localhost:8087/payments/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const responseText = await response.text();
                console.log("Response from server:", responseText);

                if (response.ok) {
                    alert("Payment gateway selected successfully!");
                    // Reset the form after successful submission
                    setFormData({ paymentGateway: '' });
                    setErrors({});
                } else {
                    alert("Error submitting form: " + responseText);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred. Please try again later.");
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit} className='mt-4'>
            <FormGroup>
                <Label>Select Payment Gateway</Label>
                {[
                    'Paypal', 'Stripe', 'PayU', 'CCAvenue', 'InstaMojo', 'Paystack',
                    'Razorpay', 'Paytm', 'Midtrans', 'Pesapal', 'Flutter Wave',
                    'iPay Africa', 'JazzCash', 'Billplz', 'SSLCommerz', 'Walkingm',
                    'PayHere', 'OnePay', 'Mollie', 'Cashfree', 'PayFast',
                    'ToyyibPay', '2checkout', 'Skrill', 'None'
                ].map((gateway) => (
                    <div key={gateway}>
                        <Label check>
                            <Input
                                type="radio"
                                name="paymentGateway"
                                value={gateway}
                                checked={formData.paymentGateway === gateway}
                                onChange={handleChange} className='ms-2'
                            />
                            <span className='ms-2'>{gateway}</span>
                        </Label>
                    </div>
                ))}
                {errors.paymentGateway && <div className="invalid-feedback">{errors.paymentGateway}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default PaymentMethod;
