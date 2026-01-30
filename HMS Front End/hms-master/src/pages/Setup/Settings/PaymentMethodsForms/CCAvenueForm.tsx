import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    merchantId: string;
    workingKey: string;
    accessCode: string;
}

interface FormErrors {
    merchantId?: string;
    workingKey?: string;
    accessCode?: string;
}

const CCAvenueForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        merchantId: '',
        workingKey: '',
        accessCode: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.merchantId) newErrors.merchantId = 'Merchant Id is required';
        if (!data.workingKey) newErrors.workingKey = 'Working Key is required';
        if (!data.accessCode) newErrors.accessCode = 'Access Code is required';
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
                        merchantId: '',
                        workingKey: '',
                        accessCode: '',
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
                <Label for="merchantId">Merchant Id</Label>
                <Input
                    type="text"
                    id="merchantId"
                    value={formData.merchantId}
                    onChange={handleChange}
                    invalid={!!errors.merchantId}
                />
                {errors.merchantId && <div className="invalid-feedback">{errors.merchantId}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="workingKey">Working Key</Label>
                <Input
                    type="text"
                    id="workingKey"
                    value={formData.workingKey}
                    onChange={handleChange}
                    invalid={!!errors.workingKey}
                />
                {errors.workingKey && <div className="invalid-feedback">{errors.workingKey}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="accessCode">Access Code</Label>
                <Input
                    type="text"
                    id="accessCode"
                    value={formData.accessCode}
                    onChange={handleChange}
                    invalid={!!errors.accessCode}
                />
                {errors.accessCode && <div className="invalid-feedback">{errors.accessCode}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default CCAvenueForm;
