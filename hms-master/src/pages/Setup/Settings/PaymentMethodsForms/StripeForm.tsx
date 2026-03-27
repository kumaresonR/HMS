import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    stripeApiSecretKey: string;
    stripePublishableKey: string;
}

interface FormErrors {
    stripeApiSecretKey?: string;
    stripePublishableKey?: string;
}

const StripeForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        stripeApiSecretKey: '',
        stripePublishableKey: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.stripeApiSecretKey) newErrors.stripeApiSecretKey = 'Stripe API Secret Key is required';
        if (!data.stripePublishableKey) newErrors.stripePublishableKey = 'Stripe Publishable Key is required';
        return newErrors;
    };

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const updatedData = { ...formData, [id]: value };
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
                const response = await fetch("http://localhost:8087/employees/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const responseText = await response.text();
                console.log("Response from server:", responseText);

                if (response.ok) {
                    alert("Form submitted successfully!");
                    // Optionally, navigate to another page or reset the form
                    setFormData({
                        stripeApiSecretKey: '',
                        stripePublishableKey: '',
                    });
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
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="stripeApiSecretKey">Stripe API Secret Key</Label>
                <Input
                    type="text"
                    id="stripeApiSecretKey"
                    value={formData.stripeApiSecretKey}
                    onChange={handleChange}
                    invalid={!!errors.stripeApiSecretKey}
                />
                {errors.stripeApiSecretKey && <div className="invalid-feedback">{errors.stripeApiSecretKey}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="stripePublishableKey">Stripe Publishable Key</Label>
                <Input
                    type="text"
                    id="stripePublishableKey"
                    value={formData.stripePublishableKey}
                    onChange={handleChange}
                    invalid={!!errors.stripePublishableKey}
                />
                {errors.stripePublishableKey && <div className="invalid-feedback">{errors.stripePublishableKey}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default StripeForm;
