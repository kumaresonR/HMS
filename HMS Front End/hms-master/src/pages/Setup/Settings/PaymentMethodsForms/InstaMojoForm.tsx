import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    privateApiKey: string;
    privateAuthToken: string;
    privateSalt: string;
}

interface FormErrors {
    privateApiKey?: string;
    privateAuthToken?: string;
    privateSalt?: string;
}

const InstaMojoForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        privateApiKey: '',
        privateAuthToken: '',
        privateSalt: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.privateApiKey) newErrors.privateApiKey = 'Private API Key is required';
        if (!data.privateAuthToken) newErrors.privateAuthToken = 'Private Auth Token is required';
        if (!data.privateSalt) newErrors.privateSalt = 'Private Salt is required';
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
                        privateApiKey: '',
                        privateAuthToken: '',
                        privateSalt: '',
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
                <Label for="privateApiKey">Private API Key</Label>
                <Input
                    type="text"
                    id="privateApiKey"
                    value={formData.privateApiKey}
                    onChange={handleChange}
                    invalid={!!errors.privateApiKey}
                />
                {errors.privateApiKey && <div className="invalid-feedback">{errors.privateApiKey}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="privateAuthToken">Private Auth Token</Label>
                <Input
                    type="text"
                    id="privateAuthToken"
                    value={formData.privateAuthToken}
                    onChange={handleChange}
                    invalid={!!errors.privateAuthToken}
                />
                {errors.privateAuthToken && <div className="invalid-feedback">{errors.privateAuthToken}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="privateSalt">Private Salt</Label>
                <Input
                    type="text"
                    id="privateSalt"
                    value={formData.privateSalt}
                    onChange={handleChange}
                    invalid={!!errors.privateSalt}
                />
                {errors.privateSalt && <div className="invalid-feedback">{errors.privateSalt}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default InstaMojoForm;
