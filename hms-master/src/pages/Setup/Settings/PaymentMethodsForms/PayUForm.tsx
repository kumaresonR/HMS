import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    payUMoneyKey: string;
    payUMoneySalt: string;
}

interface FormErrors {
    payUMoneyKey?: string;
    payUMoneySalt?: string;
}

const PayUForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        payUMoneyKey: '',
        payUMoneySalt: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.payUMoneyKey) newErrors.payUMoneyKey = 'PayU Money Key is required';
        if (!data.payUMoneySalt) newErrors.payUMoneySalt = 'PayU Money Salt is required';
        return newErrors;
    };

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                const response = await fetch("http://localhost:8087/payumoney/create", {
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
                        payUMoneyKey: '',
                        payUMoneySalt: '',
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
                <Label for="payUMoneyKey">PayU Money Key</Label>
                <Input
                    type="text"
                    id="payUMoneyKey"
                    value={formData.payUMoneyKey}
                    onChange={handleChange}
                    invalid={!!errors.payUMoneyKey}
                />
                {errors.payUMoneyKey && <div className="invalid-feedback">{errors.payUMoneyKey}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="payUMoneySalt">PayU Money Salt</Label>
                <Input
                    type="text"
                    id="payUMoneySalt"
                    value={formData.payUMoneySalt}
                    onChange={handleChange}
                    invalid={!!errors.payUMoneySalt}
                />
                {errors.payUMoneySalt && <div className="invalid-feedback">{errors.payUMoneySalt}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default PayUForm;
