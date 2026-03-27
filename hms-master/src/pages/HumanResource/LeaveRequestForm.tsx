import React, { useState } from 'react';
import axios from 'axios';

const LeaveRequest: React.FC = () => {
    const [formData, setFormData] = useState({
        employee_id: '',
        name: '',
        leave_type: '',
        start_date: '',
        end_date: ''
    });

    const [errors, setErrors] = useState<any>({});

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Validate form
    const validateForm = () => {
        const newErrors: any = {};
        if (!formData.employee_id) newErrors.employee_id = 'Employee ID is required';
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.leave_type) newErrors.leave_type = 'Leave Type is required';
        if (!formData.start_date) newErrors.start_date = 'Start Date is required';
        if (!formData.end_date) newErrors.end_date = 'End Date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            axios.post('leave_request_Post.php)', formData)
                .then(response => {
                    console.log('Leave request submitted:', response.data);
                    // Handle success response
                })
                .catch(error => {
                    console.error('Error submitting leave request:', error);
                    // Handle error response
                });
        }
    };

    return (
        <div>
            <h2>Leave Request Form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Employee ID:</label>
                    <input
                        type="text"
                        name="employee_id"
                        value={formData.employee_id}
                        onChange={handleChange}
                    />
                    {errors.employee_id && <span className="text-danger">{errors.employee_id}</span>}
                </div>

                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <span className="text-danger">{errors.name}</span>}
                </div>

                <div>
                    <label>Leave Type:</label>
                    <select name="leave_type" value={formData.leave_type} onChange={handleChange}>
                        <option value="">Select Leave Type</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Earned Leave">Earned Leave</option>
                    </select>
                    {errors.leave_type && <span className="text-danger">{errors.leave_type}</span>}
                </div>

                <div>
                    <label>Start Date:</label>
                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                    />
                    {errors.start_date && <span className="text-danger">{errors.start_date}</span>}
                </div>

                <div>
                    <label>End Date:</label>
                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                    />
                    {errors.end_date && <span className="text-danger">{errors.end_date}</span>}
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default LeaveRequest;
