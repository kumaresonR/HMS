import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Button, Card, CardBody, Col, Container, Input, Row, Spinner } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
 

const AddPatient: React.FC = () => {
    interface ApiResponse {
        message: string;
    }

    interface ErrorResponse {
        message?: string;
    }

    const [formData, setFormData] = useState({
        name: '',
        guardianName: '',
        gender: '',
        dateOfBirth: '',
        age: '',
        bloodGroup: '',
        maritalStatus: '',
        patientPhoto: null as File | null,
        phone: '',
        email: '',
        amount: '',
        address: '',
        remarks: '',
        allergies: '',
        tpa: '',
        tpaId: '',
        tpaValidity: '',
        nationalId: '',
        alternateNumber: ''
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
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.guardianName) newErrors.guardianName = 'Guardian Name is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
        if (!formData.age) newErrors.age = 'Age is required';
        if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood Group is required';
        if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital Status is required';
        if (!formData.patientPhoto) newErrors.patientPhoto = 'Patient Photo is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.amount) newErrors.amount = 'Amount is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.remarks) newErrors.remarks = 'Remarks are required';
        if (!formData.allergies) newErrors.allergies = 'Allergies are required';
        if (!formData.tpa) newErrors.tpa = 'TPA is required';
        if (!formData.tpaId) newErrors.tpaId = 'TPA ID is required';
        if (!formData.tpaValidity) newErrors.tpaValidity = 'TPA Validity is required';
        if (!formData.nationalId) newErrors.nationalId = 'National Identification Number is required';
        if (!formData.alternateNumber) newErrors.alternateNumber = 'Alternate Number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
       
    };

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Patient" pageTitle="Human Resource" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <div className="row">
                                        <div className="col-12">
                                            <h4 className="pagetitleh2 mb-4">Patient Details</h4>
                                            <form onSubmit={handleSubmit}>
                                                <div className="around10">
                                                    <input type="hidden" name="ci_csrf_token" defaultValue="" />
                                                    <div className="row">

                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="name">Name</label>
                                                                <small className="req"> *</small>
                                                                <input
                                                                    id="name"
                                                                    name="name"
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formData.name}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.name && <span className="text-danger">{errors.name}</span>}
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="guardianName">Guardian Name</label>
                                                                <small className="req"> *</small>
                                                                <input
                                                                    id="guardianName"
                                                                    name="guardianName"
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formData.guardianName}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.guardianName && <span className="text-danger">{errors.guardianName}</span>}
                                                            </div>
                                                        </div>
                                                 
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="gender">Gender</label>
                                                                <small className="req"> *</small>
                                                                <select
                                                                    id="gender"
                                                                    name="gender"
                                                                    className="form-control"
                                                                    value={formData.gender}
                                                                    onChange={handleChange}
                                                                >
                                                                    <option value="">Select</option>
                                                                    <option value="male">Male</option>
                                                                    <option value="female">Female</option>
                                                                    <option value="other">Other</option>
                                                                </select>
                                                                {errors.gender && <span className="text-danger">{errors.gender}</span>}
                                                            </div>
                                                        </div>
                                              
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="dateOfBirth">Date of Birth</label>
                                                                <small className="req"> *</small>
                                                                <input
                                                                    id="dateOfBirth"
                                                                    name="dateOfBirth"
                                                                    type="date"
                                                                    className="form-control"
                                                                    value={formData.dateOfBirth}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth}</span>}
                                                            </div>
                                                        </div>
                                       
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="age">Age</label>
                                                                <small className="req"> *</small>
                                                                <input
                                                                    id="age"
                                                                    name="age"
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formData.age}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.age && <span className="text-danger">{errors.age}</span>}
                                                            </div>
                                                        </div>
                                                  
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="bloodGroup">Blood Group</label>
                                                                <small className="req"> *</small>
                                                                <select
                                                                    id="bloodGroup"
                                                                    name="bloodGroup"
                                                                    className="form-control"
                                                                    value={formData.bloodGroup}
                                                                    onChange={handleChange}
                                                                >
                                                                    <option value="">Select</option>
                                                                    <option value="A+">A+</option>
                                                                    <option value="A-">A-</option>
                                                                    <option value="B+">B+</option>
                                                                    <option value="B-">B-</option>
                                                                    <option value="O+">O+</option>
                                                                    <option value="O-">O-</option>
                                                                    <option value="AB+">AB+</option>
                                                                    <option value="AB-">AB-</option>
                                                                </select>
                                                                {errors.bloodGroup && <span className="text-danger">{errors.bloodGroup}</span>}
                                                            </div>
                                                        </div>
                                            
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="maritalStatus">Marital Status</label>
                                                                <small className="req"> *</small>
                                                                <select
                                                                    id="maritalStatus"
                                                                    name="maritalStatus"
                                                                    className="form-control"
                                                                    value={formData.maritalStatus}
                                                                    onChange={handleChange}
                                                                >
                                                                    <option value="">Select</option>
                                                                    <option value="single">Single</option>
                                                                    <option value="married">Married</option>
                                                                    <option value="divorced">Divorced</option>
                                                                    <option value="widowed">Widowed</option>
                                                                </select>
                                                                {errors.maritalStatus && <span className="text-danger">{errors.maritalStatus}</span>}
                                                            </div>
                                                        </div>
                               
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="patientPhoto">Patient Photo</label>
                                                                <small className="req"> *</small>
                                                                <input
                                                                    id="patientPhoto"
                                                                    name="patientPhoto"
                                                                    type="file"
                                                                    className="form-control"
                                                                    accept="image/*"
                                                                    onChange={handleFileChange}
                                                                />
                                                                {errors.patientPhoto && <span className="text-danger">{errors.patientPhoto}</span>}
                                                            </div>
                                                        </div>
                      
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="phone">Phone</label>
                                                                <small className="req"> *</small>
                                                                <input
                                                                    id="phone"
                                                                    name="phone"
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formData.phone}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.phone && <span className="text-danger">{errors.phone}</span>}
                                                            </div>
                                                        </div>
                                       
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="email">Email</label>
                                                                <small className="req"> *</small>
                                                                <input
                                                                    id="email"
                                                                    name="email"
                                                                    type="email"
                                                                    className="form-control"
                                                                    value={formData.email}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.email && <span className="text-danger">{errors.email}</span>}
                                                            </div>
                                                        </div>
                                            
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="amount">Amount</label>
                                                                <small className="req"> *</small>
                                                                <input
                                                                    id="amount"
                                                                    name="amount"
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formData.amount}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.amount && <span className="text-danger">{errors.amount}</span>}
                                                            </div>
                                                        </div>
                                         
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="address">Address</label>
                                                                <small className="req"> *</small>
                                                                <textarea
                                                                    id="address"
                                                                    name="address"
                                                                    className="form-control"
                                                                    value={formData.address}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.address && <span className="text-danger">{errors.address}</span>}
                                                            </div>
                                                        </div>
                               
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="remarks">Remarks</label>
                                                                <small className="req"> *</small>
                                                                <textarea
                                                                    id="remarks"
                                                                    name="remarks"
                                                                    className="form-control"
                                                                    value={formData.remarks}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.remarks && <span className="text-danger">{errors.remarks}</span>}
                                                            </div>
                                                        </div>
                                          
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="allergies">Allergies</label>
                                                                <small className="req"> *</small>
                                                                <textarea
                                                                    id="allergies"
                                                                    name="allergies"
                                                                    className="form-control"
                                                                    value={formData.allergies}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.allergies && <span className="text-danger">{errors.allergies}</span>}
                                                            </div>
                                                        </div>
                          
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="tpa">TPA</label>
                                                                <small className="req"> *</small>
                                                                <input
                                                                    id="tpa"
                                                                    name="tpa"
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formData.tpa}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.tpa && <span className="text-danger">{errors.tpa}</span>}
                                                            </div>
                                                        </div>
                                  
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="tpaId">TPA ID</label>
                                                                <small className="req"> *</small>
                                                                <input
                                                                    id="tpaId"
                                                                    name="tpaId"
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formData.tpaId}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.tpaId && <span className="text-danger">{errors.tpaId}</span>}
                                                            </div>
                                                        </div>
                                
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="tpaValidity">TPA Validity</label>
                                                                <small className="req"> *</small>
                                                                <input
                                                                    id="tpaValidity"
                                                                    name="tpaValidity"
                                                                    type="date"
                                                                    className="form-control"
                                                                    value={formData.tpaValidity}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.tpaValidity && <span className="text-danger">{errors.tpaValidity}</span>}
                                                            </div>
                                                        </div>
                                   
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="nationalId">National Identification Number</label>
                                                                <small className="req"> *</small>
                                                                <input
                                                                    id="nationalId"
                                                                    name="nationalId"
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formData.nationalId}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.nationalId && <span className="text-danger">{errors.nationalId}</span>}
                                                            </div>
                                                        </div>
                          
                                                        <div className="col-md-6 mb-2">
                                                            <div className="form-group mb-2">
                                                                <label htmlFor="alternateNumber">Alternate Number</label>
                                                                <small className="req"> *</small>
                                                                <input
                                                                    id="alternateNumber"
                                                                    name="alternateNumber"
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formData.alternateNumber}
                                                                    onChange={handleChange}
                                                                />
                                                                {errors.alternateNumber && <span className="text-danger">{errors.alternateNumber}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
               
                                                    <Button type="submit" color="primary" className="mt-3">
                                                        {loading ? <Spinner size="sm" /> : 'Add Patient'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default AddPatient
