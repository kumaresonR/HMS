import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    publicKey: string;
    secretKey: string;
}

interface FormErrors {
    publicKey?: string;
    secretKey?: string;
}

const FlutterWaveForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        publicKey: '',
        secretKey: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.publicKey) newErrors.publicKey = 'Public Key is required';
        if (!data.secretKey) newErrors.secretKey = 'Secret Key is required';
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
                        publicKey: '',
                        secretKey: '',
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
                <Label for="publicKey">Public Key</Label>
                <Input
                    type="text"
                    id="publicKey"
                    value={formData.publicKey}
                    onChange={handleChange}
                    invalid={!!errors.publicKey}
                />
                {errors.publicKey && <div className="invalid-feedback">{errors.publicKey}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="secretKey">Secret Key</Label>
                <Input
                    type="text"
                    id="secretKey"
                    value={formData.secretKey}
                    onChange={handleChange}
                    invalid={!!errors.secretKey}
                />
                {errors.secretKey && <div className="invalid-feedback">{errors.secretKey}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default FlutterWaveForm;
