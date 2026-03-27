import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    username: string;
    hashKey: string;
    senderId: string;
    statusVal: string;
}

interface FormErrors {
    username?: string;
    hashKey?: string;
    senderId?: string;
    statusVal?: string;
}

const TextLocalForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        hashKey: '',
        senderId: '',
        statusVal: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.username) newErrors.username = 'Username is required';
        if (!data.hashKey) newErrors.hashKey = 'Hash Key is required';
        if (!data.senderId) newErrors.senderId = 'Sender ID is required';
        if (!data.statusVal) newErrors.statusVal = 'status is required';
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
                        hashKey: '',
                        senderId: '',
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
                <Label for="hashKey">Hash Key</Label>
                <Input
                    type="text"
                    id="hashKey"
                    value={formData.hashKey}
                    onChange={handleChange}
                    invalid={!!errors.hashKey}
                />
                {errors.hashKey && <div className="invalid-feedback">{errors.hashKey}</div>}
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
                <Label for="statusVal">status</Label>
                <Input
                    type="select"
                    id="statusVal"
                    value={formData.statusVal}
                    onChange={handleChange}
                    invalid={!!errors.statusVal}
                >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </Input>
                {errors.statusVal && <div className="invalid-feedback">{errors.statusVal}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default TextLocalForm;
