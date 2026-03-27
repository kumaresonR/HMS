import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    razorpayKeyId: string;
    razorpayKeySecret: string;
}

interface FormErrors {
    razorpayKeyId?: string;
    razorpayKeySecret?: string;
}

const RazorpayForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        razorpayKeyId: '',
        razorpayKeySecret: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.razorpayKeyId) newErrors.razorpayKeyId = 'Razorpay Key Id is required';
        if (!data.razorpayKeySecret) newErrors.razorpayKeySecret = 'Razorpay Key Secret is required';
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
                        razorpayKeyId: '',
                        razorpayKeySecret: '',
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
                <Label for="razorpayKeyId">Razorpay Key Id</Label>
                <Input
                    type="text"
                    id="razorpayKeyId"
                    value={formData.razorpayKeyId}
                    onChange={handleChange}
                    invalid={!!errors.razorpayKeyId}
                />
                {errors.razorpayKeyId && <div className="invalid-feedback">{errors.razorpayKeyId}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="razorpayKeySecret">Razorpay Key Secret</Label>
                <Input
                    type="text"
                    id="razorpayKeySecret"
                    value={formData.razorpayKeySecret}
                    onChange={handleChange}
                    invalid={!!errors.razorpayKeySecret}
                />
                {errors.razorpayKeySecret && <div className="invalid-feedback">{errors.razorpayKeySecret}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default RazorpayForm;
