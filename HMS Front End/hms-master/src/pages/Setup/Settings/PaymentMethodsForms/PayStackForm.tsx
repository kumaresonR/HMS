import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    paystackSecretKey: string; // Updated field
}

interface FormErrors {
    paystackSecretKey?: string; // Updated error
}

const PayStackForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        paystackSecretKey: '', // Initialize with empty string
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.paystackSecretKey) newErrors.paystackSecretKey = 'Paystack Secret Key is required'; // Updated validation
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
                const response = await fetch("http://localhost:8087/paystack/create", {
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
                        paystackSecretKey: '', // Reset the form
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
                <Label for="paystackSecretKey">Paystack Secret Key</Label>
                <Input
                    type="text"
                    id="paystackSecretKey" // Updated ID
                    value={formData.paystackSecretKey} // Updated value
                    onChange={handleChange}
                    invalid={!!errors.paystackSecretKey} // Updated error check
                />
                {errors.paystackSecretKey && <div className="invalid-feedback">{errors.paystackSecretKey}</div>} </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default PayStackForm;
