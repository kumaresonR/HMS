import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    gatewayName: string;
    statusVal: string;
}

interface FormErrors {
    gatewayName?: string;
    statusVal?: string;
}

const CustomSmsForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        gatewayName: '',
        statusVal: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.gatewayName) newErrors.gatewayName = 'Gateway Name is required';
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
                const response = await fetch("http://localhost:8087/sms-gateway/create", {
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
                        gatewayName: '',
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
                <Label for="gatewayName">Gateway Name</Label>
                <Input
                    type="text"
                    id="gatewayName"
                    value={formData.gatewayName}
                    onChange={handleChange}
                    invalid={!!errors.gatewayName}
                />
                {errors.gatewayName && <div className="invalid-feedback">{errors.gatewayName}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="statusVal">Status Value</Label>
                <Input
                    type="select"
                    id="statusVal"
                    value={formData.statusVal}
                    onChange={handleChange}
                    invalid={!!errors.statusVal}
                >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </Input>
                {errors.statusVal && <div className="invalid-feedback">{errors.statusVal}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default CustomSmsForm;
