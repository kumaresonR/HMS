import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    username: string;
    password: string;
    apiKey: string;
    statusVal: string;
}

interface FormErrors {
    username?: string;
    password?: string;
    apiKey?: string;
    statusVal?: string;
}

const ClickatellForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        apiKey: '',
        statusVal: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.username) newErrors.username = 'Username is required';
        if (!data.password) newErrors.password = 'Password is required';
        if (!data.apiKey) newErrors.apiKey = 'API Key is required';
        if (!data.statusVal) newErrors.statusVal = 'Status Value is required';
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
                        username: '',
                        password: '',
                        apiKey: '',
                        statusVal: '',
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
                <Label for="username">Username</Label>
                <Input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    invalid={!!errors.username}
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="password">Password</Label>
                <Input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    invalid={!!errors.password}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="apiKey">API Key</Label>
                <Input
                    type="text"
                    id="apiKey"
                    value={formData.apiKey}
                    onChange={handleChange}
                    invalid={!!errors.apiKey}
                />
                {errors.apiKey && <div className="invalid-feedback">{errors.apiKey}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="statusVal">Status Value</Label>
                <Input
                    type="text"
                    id="statusVal"
                    value={formData.statusVal}
                    onChange={handleChange}
                    invalid={!!errors.statusVal}
                />
                {errors.statusVal && <div className="invalid-feedback">{errors.statusVal}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default ClickatellForm;
