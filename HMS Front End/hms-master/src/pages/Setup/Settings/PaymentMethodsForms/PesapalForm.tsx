import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    consumerKey: string;
    consumerSecret: string;
}

interface FormErrors {
    consumerKey?: string;
    consumerSecret?: string;
}

const PesapalForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        consumerKey: '',
        consumerSecret: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.consumerKey) newErrors.consumerKey = 'Consumer Key is required';
        if (!data.consumerSecret) newErrors.consumerSecret = 'Consumer Secret is required';
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
                const response = await fetch("http://localhost:8087/pesapal/create", { // Adjust endpoint as necessary
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
                        consumerKey: '',
                        consumerSecret: '',
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
                <Label for="consumerKey">Consumer Key</Label>
                <Input
                    type="text"
                    id="consumerKey"
                    value={formData.consumerKey}
                    onChange={handleChange}
                    invalid={!!errors.consumerKey}
                />
                {errors.consumerKey && <div className="invalid-feedback">{errors.consumerKey}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="consumerSecret">Consumer Secret</Label>
                <Input
                    type="text"
                    id="consumerSecret"
                    value={formData.consumerSecret}
                    onChange={handleChange}
                    invalid={!!errors.consumerSecret}
                />
                {errors.consumerSecret && <div className="invalid-feedback">{errors.consumerSecret}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default PesapalForm;
