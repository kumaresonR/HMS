import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    authKey: string;
    senderId: string;
    routeId: string;
    statusVal: string;
}

interface FormErrors {
    authKey?: string;
    senderId?: string;
    routeId?: string;
    statusVal?: string;
}

const MobireachForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        authKey: '',
        senderId: '',
        routeId: '',
        statusVal: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.authKey) newErrors.authKey = 'Auth Key is required';
        if (!data.senderId) newErrors.senderId = 'Sender ID is required';
        if (!data.routeId) newErrors.routeId = 'Route ID is required';
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
                    // Reset form data
                    setFormData({
                        authKey: '',
                        senderId: '',
                        routeId: '',
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
                <Label for="authKey">Auth Key</Label>
                <Input
                    type="text"
                    id="authKey"
                    value={formData.authKey}
                    onChange={handleChange}
                    invalid={!!errors.authKey}
                />
                {errors.authKey && <div className="invalid-feedback">{errors.authKey}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="senderId">Sender ID</Label>
                <Input
                    type="text"
                    id="senderId"
                    value={formData.senderId}
                    onChange={handleChange}
                    invalid={!!errors.senderId}
                />
                {errors.senderId && <div className="invalid-feedback">{errors.senderId}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="routeId">Route ID</Label>
                <Input
                    type="text"
                    id="routeId"
                    value={formData.routeId}
                    onChange={handleChange}
                    invalid={!!errors.routeId}
                />
                {errors.routeId && <div className="invalid-feedback">{errors.routeId}</div>}
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
                    {/* Add more options as needed */}
                </Input>
                {errors.statusVal && <div className="invalid-feedback">{errors.statusVal}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default MobireachForm;
