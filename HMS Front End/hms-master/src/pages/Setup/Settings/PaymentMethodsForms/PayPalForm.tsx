import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    paypalUsername: string;
    paypalPassword: string;
    paypalSignature: string;
}

interface FormErrors {
    paypalUsername?: string;
    paypalPassword?: string;
    paypalSignature?: string;
}

const PayPalForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        paypalUsername: '',
        paypalPassword: '',
        paypalSignature: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.paypalUsername) newErrors.paypalUsername = 'PayPal Username is required';
        if (!data.paypalPassword) newErrors.paypalPassword = 'PayPal Password is required';
        if (!data.paypalSignature) newErrors.paypalSignature = 'PayPal Signature is required';
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
                const response = await fetch("http://localhost:8087/paypal/create", {
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
                        paypalUsername: '',
                        paypalPassword: '',
                        paypalSignature: '',
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
                <Label for="paypalUsername">PayPal Username</Label>
                <Input
                    type="text"
                    id="paypalUsername"
                    value={formData.paypalUsername}
                    onChange={handleChange}
                    invalid={!!errors.paypalUsername}
                />
                {errors.paypalUsername && <div className="invalid-feedback">{errors.paypalUsername}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="paypalPassword">PayPal Password</Label>
                <Input
                    type="text"
                    id="paypalPassword"
                    value={formData.paypalPassword}
                    onChange={handleChange}
                    invalid={!!errors.paypalPassword}
                />
                {errors.paypalPassword && <div className="invalid-feedback">{errors.paypalPassword}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="paypalSignature">PayPal Signature</Label>
                <Input
                    type="text"
                    id="paypalSignature"
                    value={formData.paypalSignature}
                    onChange={handleChange}
                    invalid={!!errors.paypalSignature}
                />
                {errors.paypalSignature && <div className="invalid-feedback">{errors.paypalSignature}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default PayPalForm;
