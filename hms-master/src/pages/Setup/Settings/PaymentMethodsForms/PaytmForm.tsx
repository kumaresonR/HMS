import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    merchantId: string;
    merchantKey: string;
    website: string;
    industryType: string;
}

interface FormErrors {
    merchantId?: string;
    merchantKey?: string;
    website?: string;
    industryType?: string;
}

const PaytmForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        merchantId: '',
        merchantKey: '',
        website: '',
        industryType: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.merchantId) newErrors.merchantId = 'Merchant Id is required';
        if (!data.merchantKey) newErrors.merchantKey = 'Merchant Key is required';
        if (!data.website) newErrors.website = 'Website is required';
        if (!data.industryType) newErrors.industryType = 'Industry Type is required';
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
                const response = await fetch("http://localhost:8087/paytm/create", {
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
                        merchantKey: '',
                        website: '',
                        industryType: '',
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
                <Label for="merchantKey">Merchant Key</Label>
                <Input
                    type="text"
                    id="merchantKey"
                    value={formData.merchantKey}
                    onChange={handleChange}
                    invalid={!!errors.merchantKey}
                />
                {errors.merchantKey && <div className="invalid-feedback">{errors.merchantKey}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="website">Website</Label>
                <Input
                    type="text"
                    id="website"
                    value={formData.website}
                    onChange={handleChange}
                    invalid={!!errors.website}
                />
                {errors.website && <div className="invalid-feedback">{errors.website}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="industryType">Industry Type</Label>
                <Input
                    type="text"
                    id="industryType"
                    value={formData.industryType}
                    onChange={handleChange}
                    invalid={!!errors.industryType}
                />
                {errors.industryType && <div className="invalid-feedback">{errors.industryType}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default PaytmForm;
