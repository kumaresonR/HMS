import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Button, Card, CardBody, Col, Container, Input, Row, Spinner } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
 

const AddMedicineDetails: React.FC = () => {
    interface ApiResponse {
        message: string; // Define the expected structure of the success response
    }

    interface ErrorResponse {
        message?: string; // Define the expected structure of the error response
    }

    const [formData, setFormData] = useState({
        medicine_name: '',
        medicine_category: '',
        medicine_company: '',
        medicine_composition: '',
        medicine_group: '',
        unit: '',
        min_level: '',
        reorder_level: '',
        tax: '',
        box_packing: '',
        vat_ac: '',
        rack_number: '',
        note: '',
        medicine_photo: null as File | null,
    });

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        const file = e.target.files?.[0] || null;

        if (file) {
            if (file.size > 1024 * 1024) {
                setErrors((prevErrors: any) => ({
                    ...prevErrors,
                    [name]: 'File size should not exceed 1 MB',
                }));
                setFormData((prev) => ({ ...prev, [name]: null }));
            } else {
                setErrors((prevErrors: any) => ({ ...prevErrors, [name]: null }));
                setFormData((prev) => ({ ...prev, [name]: file }));
            }
        }
    };

    const validateForm = () => {
        const newErrors: any = {};
        if (!formData.medicine_name) newErrors.medicine_name = 'Medicine Name is required';
        if (!formData.medicine_category) newErrors.medicine_category = 'Medicine Category is required';
        if (!formData.medicine_company) newErrors.medicine_company = 'Medicine Company is required';
        if (!formData.medicine_composition) newErrors.medicine_composition = 'Medicine Composition is required';
        if (!formData.medicine_group) newErrors.medicine_group = 'Medicine Group is required';
        if (!formData.unit) newErrors.unit = 'Unit is required';
        if (!formData.min_level) newErrors.min_level = 'Min Level is required';
        if (!formData.reorder_level) newErrors.reorder_level = 'Re-Order Level is required';
        if (!formData.tax) newErrors.tax = 'Tax is required';
        if (!formData.box_packing) newErrors.box_packing = 'Box/Packing is required';
        if (!formData.vat_ac) newErrors.vat_ac = 'VAT A/C is required';
        if (!formData.rack_number) newErrors.rack_number = 'Rack Number is required';
        if (!formData.medicine_photo) newErrors.medicine_photo = 'Medicine Photo is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const formDataObj = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataObj.append(key, value as string | Blob);
            });

            try {
                const response = await axios.post<ApiResponse>('http://localhost/HMS_Backend/addMedicine.php', formDataObj);
                const message = response.data.message;
                alert(message);
            } catch (error) {
                const axiosError = error as AxiosError;
                let errorMessage = 'An unexpected error occurred';
                if (axiosError.response) {
                    const errorData: ErrorResponse = axiosError.response.data || {};
                    errorMessage = errorData.message || 'An unknown error occurred';
                } else if (axiosError.request) {
                    errorMessage = 'No response received from the server.';
                } else {
                    errorMessage = axiosError.message;
                }
                alert('Error submitting form: ' + errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Medicine Details" pageTitle="Pharmacy" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <h4 className="pagetitleh2 mb-4">Medicine Details</h4>
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="medicine_name">Medicine Name</label>
                                                <small className="req"> *</small>
                                                <Input
                                                    id="medicine_name"
                                                    name="medicine_name"
                                                    type="text"
                                                    value={formData.medicine_name}
                                                    onChange={handleChange}
                                                />
                                                {errors.medicine_name && <span className="text-danger">{errors.medicine_name}</span>}
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="medicine_category">Medicine Category</label>
                                                <small className="req"> *</small>
                                                <select
                                                    id="medicine_category"
                                                    name="medicine_category"
                                                    className="form-control"
                                                    value={formData.medicine_category}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="1">Antibiotics</option>
                                                    <option value="2">Painkillers</option>
                                                    {/* Add more categories here */}
                                                </select>
                                                {errors.medicine_category && <span className="text-danger">{errors.medicine_category}</span>}
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="medicine_company">Medicine Company</label>
                                                <small className="req"> *</small>
                                                <select
                                                    id="medicine_company"
                                                    name="medicine_company"
                                                    className="form-control"
                                                    value={formData.medicine_company}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="1">Pfizer</option>
                                                    <option value="2">AstraZeneca</option>
                                                    {/* Add more companies here */}
                                                </select>
                                                {errors.medicine_company && <span className="text-danger">{errors.medicine_company}</span>}
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="medicine_composition">Medicine Composition</label>
                                                <small className="req"> *</small>
                                                <Input
                                                    id="medicine_composition"
                                                    name="medicine_composition"
                                                    type="text"
                                                    value={formData.medicine_composition}
                                                    onChange={handleChange}
                                                />
                                                {errors.medicine_composition && <span className="text-danger">{errors.medicine_composition}</span>}
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="medicine_group">Medicine Group</label>
                                                <small className="req"> *</small>
                                                <select
                                                    id="medicine_group"
                                                    name="medicine_group"
                                                    className="form-control"
                                                    value={formData.medicine_group}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="1">Group A</option>
                                                    <option value="2">Group B</option>
                                                    {/* Add more groups here */}
                                                </select>
                                                {errors.medicine_group && <span className="text-danger">{errors.medicine_group}</span>}
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="unit">Unit</label>
                                                <small className="req"> *</small>
                                                <select
                                                    id="unit"
                                                    name="unit"
                                                    className="form-control"
                                                    value={formData.unit}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="mg">mg</option>
                                                    <option value="ml">ml</option>
                                                    {/* Add more units here */}
                                                </select>
                                                {errors.unit && <span className="text-danger">{errors.unit}</span>}
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="min_level">Min Level</label>
                                                <small className="req"> *</small>
                                                <Input
                                                    id="min_level"
                                                    name="min_level"
                                                    type="text"
                                                    value={formData.min_level}
                                                    onChange={handleChange}
                                                />
                                                {errors.min_level && <span className="text-danger">{errors.min_level}</span>}
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="reorder_level">Re-Order Level</label>
                                                <small className="req"> *</small>
                                                <Input
                                                    id="reorder_level"
                                                    name="reorder_level"
                                                    type="text"
                                                    value={formData.reorder_level}
                                                    onChange={handleChange}
                                                />
                                                {errors.reorder_level && <span className="text-danger">{errors.reorder_level}</span>}
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="tax">Tax</label>
                                                <small className="req"> *</small>
                                                <Input
                                                    id="tax"
                                                    name="tax"
                                                    type="text"
                                                    value={formData.tax}
                                                    onChange={handleChange}
                                                />
                                                {errors.tax && <span className="text-danger">{errors.tax}</span>}
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="box_packing">Box/Packing</label>
                                                <small className="req"> *</small>
                                                <Input
                                                    id="box_packing"
                                                    name="box_packing"
                                                    type="text"
                                                    value={formData.box_packing}
                                                    onChange={handleChange}
                                                />
                                                {errors.box_packing && <span className="text-danger">{errors.box_packing}</span>}
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="vat_ac">VAT A/C</label>
                                                <small className="req"> *</small>
                                                <Input
                                                    id="vat_ac"
                                                    name="vat_ac"
                                                    type="text"
                                                    value={formData.vat_ac}
                                                    onChange={handleChange}
                                                />
                                                {errors.vat_ac && <span className="text-danger">{errors.vat_ac}</span>}
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="rack_number">Rack Number</label>
                                                <small className="req"> *</small>
                                                <Input
                                                    id="rack_number"
                                                    name="rack_number"
                                                    type="text"
                                                    value={formData.rack_number}
                                                    onChange={handleChange}
                                                />
                                                {errors.rack_number && <span className="text-danger">{errors.rack_number}</span>}
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="note">Note</label>
                                                <Input
                                                    id="note"
                                                    name="note"
                                                    type="textarea"
                                                    value={formData.note}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="medicine_photo">Medicine Photo</label>
                                                <small className="req"> *</small>
                                                <Input
                                                    id="medicine_photo"
                                                    name="medicine_photo"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                {errors.medicine_photo && <span className="text-danger">{errors.medicine_photo}</span>}
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12 text-center">
                                                <Button type="submit" color="primary" disabled={loading}>
                                                    {loading ? <Spinner size="sm" /> : 'Submit'}
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default AddMedicineDetails;
