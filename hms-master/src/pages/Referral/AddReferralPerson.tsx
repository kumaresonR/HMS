import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Button, Card, CardBody, Col, Container, Input, Label, Row, Spinner } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import ReferralApiService from '../../helpers/services/referral/referral-api-service';
import { minimizePage } from '../../slices/pageResizer/uiSlice';
import { useDispatch } from 'react-redux';


const AddRefferalPerson = () => {
    const referralApiService: ReferralApiService = new ReferralApiService();
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [referrerName, setReferrerName] = useState("");
    const [referrerNameValidationError, setReferrerNameValidationError] = useState(false);
    const [referrerContactNo, setReferrerContactNo] = useState<any>('');
    const [referrerContactNoValidationError, setReferrerContactNoValidationError] = useState("");
    const [contactPersonName, setContactPersonName] = useState("");
    const [contactPersonPhone, setContactPersonPhone] = useState("");
    const [contactPersonPhoneValidationError, setContactPersonPhoneValidationError] = useState("");
    const [categoryData, setCategoryData] = useState([]);
    const [commissionData, setCommissionData] = useState([]);
    const [category, setCategory] = useState('');
    const [categoryValidationError, setCategoryValidationError] = useState(false);
    const [standardCommission, setStandardCommission] = useState<any>();
    const [address, setAddress] = useState<any>();
    const [applyTPA, setApplyTPA] = useState(false);
    const [opdCommission, setOpdCommission] = useState<any>();
    const [ipdCommission, setIpdCommission] = useState<any>();
    const [pharmacyCommission, setPharmacyCommission] = useState<any>();
    const [pathologyCommission, setPathologyCommission] = useState<any>();
    const [radiologyCommission, setRadiologyCommission] = useState<any>();
    const [bloodBankCommission, setBloodBankCommission] = useState<any>();
    const [ambulanceCommission, setAmbulanceCommission] = useState<any>();
    const [selectedCommissionData, setSelectedCommissionData] = useState<any>();
    const data = {
        referrerName, referrerContactNo, category, address, contactPersonName,contactPersonPhone,
        standardCommission,opdCommission,ipdCommission,pharmacyCommission,
        pathologyCommission,radiologyCommission,bloodBankCommission,ambulanceCommission
    }

    const handleReferrerNameChange = (value: any) => {
        setReferrerName(value);
        setReferrerNameValidationError(false);
    };

    const handleReferanceContactNo = (value: any) => {
        const phoneValue = value.replace(/[^0-9]/g, "");
        setReferrerContactNo(phoneValue);
        if (phoneValue.length !== 10) {
            setReferrerContactNoValidationError("Referrer Contact must be exactly 10 digits.");
        } else {
            setReferrerContactNoValidationError("");
        }
    }

    const handleContactPersonNo = (value: any) => {
        const phoneValue = value.replace(/[^0-9]/g, "");
        setContactPersonPhone(phoneValue);
        if (phoneValue.length !== 10) {
            setContactPersonPhoneValidationError("Contact Person Number must be exactly 10 digits.");
        } else {
            setContactPersonPhoneValidationError("");
        }
    }

    const handleCategoryChange = (value: any) => {
        setCategory(value);
        setCategoryValidationError(false);
        if (value) {
            const selectedCommissionData: any = commissionData.find(
                (item: any) => item.categoryId === value
            );

            if (selectedCommissionData) {
                setSelectedCommissionData(selectedCommissionData);
                setIpdCommission(selectedCommissionData.ipdCommission);
                setOpdCommission(selectedCommissionData.opdCommission);
                setPathologyCommission(selectedCommissionData.pathologyCommission);
                setPharmacyCommission(selectedCommissionData.pharmacyCommission);
                setRadiologyCommission(selectedCommissionData.radiologyCommission);
                setAmbulanceCommission(selectedCommissionData.ambulanceCommission);
                setBloodBankCommission(selectedCommissionData.bloodBankCommission);
            } else {
                console.log("No commission data found for the selected category");
            }
        } else {
            setSelectedCommissionData('');
            resetCommission();
        }
    };

    const resetCommission = () => {
        setIpdCommission(0);
        setOpdCommission(0);
        setPathologyCommission(0);
        setPharmacyCommission(0);
        setRadiologyCommission(0);
        setAmbulanceCommission(0);
        setBloodBankCommission(0);
    }

    const applyToAll = () => {
        if (standardCommission) {
            setIpdCommission(standardCommission);
            setOpdCommission(standardCommission);
            setPathologyCommission(standardCommission);
            setPharmacyCommission(standardCommission);
            setRadiologyCommission(standardCommission);
            setAmbulanceCommission(standardCommission);
            setBloodBankCommission(standardCommission);
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!referrerName) {
            setReferrerNameValidationError(true);
            isFormValid = false;
        }

        if (!category) {
            setCategoryValidationError(true);
            isFormValid = false;
        }

        if (referrerContactNo && !/^[0-9]{10}$/.test(referrerContactNo)) {
            setReferrerContactNoValidationError("Referrer Contact must be exactly 10 digits.");
            isFormValid = false;
        } else {
            setReferrerContactNoValidationError("");
        }

        if (contactPersonPhone && !/^[0-9]{10}$/.test(contactPersonPhone)) {
            setContactPersonPhoneValidationError("Contact Persone Phone must be exactly 10 digits.");
            isFormValid = false;
        } else {
            setContactPersonPhoneValidationError("");
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            addReferralPerson();
        }
    };

    const addReferralPerson = async () => {
        try {
            const payload = {
                referrerName: referrerName,
                referrerContact: referrerContactNo,
                category: category,
                address: address,
                contactPersonName: contactPersonName,
                contactPersonPhone: contactPersonPhone,
                standardCommission: standardCommission,
                opdCommission: opdCommission,
                ipdCommission: ipdCommission,
                pharmacyCommission: pharmacyCommission,
                pathologyCommission: pathologyCommission,
                radiologyCommission: radiologyCommission,
                bloodBankCommission: bloodBankCommission,
                ambulanceCommission: ambulanceCommission
            };
            await referralApiService.createReferralPerson(payload);
            toast.success("Referral Person Added Successfully", { containerId: "TR" });
            navigate("/main/referralPersonList");
        } catch (error: any) {
            return ErrorHandler(error);
        }
    };

    const getAllReferralCategory = async () => {
        try {
            let result = await referralApiService.getAllReferralCategory();
            setCategoryData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllCommission = async () => {
        try {
            let result = await referralApiService.getAllCommission();
            setCommissionData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllReferralCategory();
        getAllCommission();
    }, []);

    useEffect(() => {
        if (location?.state) {
            setReferrerName(location?.state?.referrerName);
            setReferrerContactNo(location?.state?.referrerContactNo);
            setCategory(location?.state?.category);
            setAddress(location?.state?.address);
            setContactPersonName(location?.state?.contactPersonName);
            setContactPersonPhone(location?.state?.contactPersonPhone);
            setStandardCommission(location?.state?.standardCommission);
            setOpdCommission(location?.state?.opdCommission);
            setIpdCommission(location?.state?.ipdCommission);
            setPharmacyCommission(location?.state?.pharmacyCommission);
            setPathologyCommission(location?.state?.pathologyCommission);
            setRadiologyCommission(location?.state?.radiologyCommission);
            setBloodBankCommission(location?.state?.bloodBankCommission);
            setAmbulanceCommission(location?.state?.ambulanceCommission);
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader
                        title="Add Referral Person"
                        pageTitle="Referral Management"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Add Referral Person",
                            data
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <div className="row">
                                        <div className="col-12">

                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="mb-0">Add Refferal Person Details</h5>

                                                <Link to="/main/referralPersonList" className="text-end">
                                                    <Button
                                                        color="primary"
                                                        className="btn btn-primary add-btn"
                                                    >
                                                        <IoArrowBack /> Back
                                                    </Button>
                                                </Link>
                                            </div>

                                            <form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-lg-8">
                                                        <div className="row">
                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="referrer_name">Referrer Name</label>
                                                                    <small className="req"> *</small>
                                                                    <Input
                                                                        id="referrer_name"
                                                                        name="referrer_name"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={referrerName}
                                                                        onChange={e => handleReferrerNameChange(e.target.value)}
                                                                        invalid={!!referrerNameValidationError}
                                                                    />
                                                                    {referrerNameValidationError && <span className="text-danger">Referrer Name Required</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="referrer_contact">Referrer Contact</label>
                                                                    <Input
                                                                        id="referrer_contact"
                                                                        name="referrer_contact"
                                                                        type="text"
                                                                        className="form-control"
                                                                        maxLength={10}
                                                                        value={referrerContactNo}
                                                                        onChange={e => handleReferanceContactNo(e.target.value)}
                                                                        invalid={!!referrerContactNoValidationError}
                                                                    />
                                                                    {referrerContactNoValidationError && <div className="invalid-feedback">{referrerContactNoValidationError}</div>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="contact_person_name">Contact Person Name</label>
                                                                    <input
                                                                        id="contact_person_name"
                                                                        name="contact_person_name"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={contactPersonName}
                                                                        onChange={e => setContactPersonName(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="contact_person_phone">Contact Person Phone</label>
                                                                    <Input
                                                                        id="contact_person_phone"
                                                                        name="contact_person_phone"
                                                                        type="text"
                                                                        maxLength={10}
                                                                        className="form-control"
                                                                        value={contactPersonPhone}
                                                                        onChange={e => handleContactPersonNo(e.target.value)}
                                                                        invalid={!!contactPersonPhoneValidationError}
                                                                    />
                                                                    {contactPersonPhoneValidationError && <div className="invalid-feedback">{contactPersonPhoneValidationError}</div>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="category">Category</label>
                                                                    <small className="req"> *</small>
                                                                    <select
                                                                        id="category"
                                                                        name="category"
                                                                        className={`form-control  ${categoryValidationError ? 'is-invalid' : ''}`}
                                                                        value={category}
                                                                        onChange={e => handleCategoryChange(e.target.value)}
                                                                    >
                                                                        <option value="">Select</option>
                                                                        {categoryData.map((item: any, idx: any) => (
                                                                            <option key={idx} value={item.categoryId} >{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                    {categoryValidationError && <span className="text-danger">Category Required</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="commission">Standard Commission (%)</label>
                                                                    <input
                                                                        id="commission"
                                                                        name="commission"
                                                                        type="number"
                                                                        className="form-control"
                                                                        value={standardCommission}
                                                                        onChange={e => {
                                                                            setStandardCommission(e.target.value);
                                                                        }}
                                                                        onWheel={(e: any) => e.target.blur()}
                                                                        step="any"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-12 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="address">Address</label>
                                                                    <textarea
                                                                        id="address"
                                                                        name="address"
                                                                        className="form-control"
                                                                        value={address}
                                                                        onChange={e => setAddress(e.target.value)}
                                                                    ></textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col'>
                                                        <div className="row">
                                                            <div className="col d-flex justify-content-between">
                                                                <Label>Commission for Modules (%) *</Label>
                                                                <Button onClick={applyToAll} color="primary">
                                                                    Apply To All
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="row my-2">
                                                            <div className="col">
                                                                <Label>OPD</Label>
                                                            </div>
                                                            <div className="col">
                                                                <input
                                                                    id="OPD"
                                                                    name="OPD"
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={opdCommission}
                                                                    onChange={e => {
                                                                        setOpdCommission(e.target.value);
                                                                    }}
                                                                    onWheel={(e: any) => e.target.blur()}
                                                                    step="any"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row my-2">
                                                            <div className="col">
                                                                <Label>IPD</Label>
                                                            </div>
                                                            <div className="col">
                                                                <input
                                                                    id="IPD"
                                                                    name="IPD"
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={ipdCommission}
                                                                    onChange={e => {
                                                                        setIpdCommission(e.target.value);
                                                                    }}
                                                                    onWheel={(e: any) => e.target.blur()}
                                                                    step="any"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row my-2">
                                                            <div className="col">
                                                                <Label>Pharmacy</Label>
                                                            </div>
                                                            <div className="col">
                                                                <input
                                                                    id="Pharmacy"
                                                                    name="Pharmacy"
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={pharmacyCommission}
                                                                    onChange={e => {
                                                                        setPharmacyCommission(e.target.value);
                                                                    }}
                                                                    onWheel={(e: any) => e.target.blur()}
                                                                    step="any"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row my-2">
                                                            <div className="col">
                                                                <Label>Pathology</Label>
                                                            </div>
                                                            <div className="col">
                                                                <input
                                                                    id="Pathology"
                                                                    name="Pathology"
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={pathologyCommission}
                                                                    onChange={e => {
                                                                        setPathologyCommission(e.target.value);
                                                                    }}
                                                                    onWheel={(e: any) => e.target.blur()}
                                                                    step="any"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row my-2">
                                                            <div className="col">
                                                                <Label>Radiology</Label>
                                                            </div>
                                                            <div className="col">
                                                                <input
                                                                    id="Radiology"
                                                                    name="Radiology"
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={radiologyCommission}
                                                                    onChange={e => {
                                                                        setRadiologyCommission(e.target.value);
                                                                    }}
                                                                    onWheel={(e: any) => e.target.blur()}
                                                                    step="any"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="row my-2">
                                                            <div className="col">
                                                                <Label>Blood Bank</Label>
                                                            </div>
                                                            <div className="col">
                                                                <input
                                                                    id="bloodBankCommission"
                                                                    name="bloodBankCommission"
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={bloodBankCommission}
                                                                    onChange={e => {
                                                                        setBloodBankCommission(e.target.value);
                                                                    }}
                                                                    onWheel={(e: any) => e.target.blur()}
                                                                    step="any"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row my-2">
                                                            <div className="col">
                                                                <Label>Ambulance</Label>
                                                            </div>
                                                            <div className="col">
                                                                <input
                                                                    id="Ambulance"
                                                                    name="Ambulance"
                                                                    type="number"
                                                                    className="form-control"
                                                                    value={ambulanceCommission}
                                                                    onChange={e => {
                                                                        setAmbulanceCommission(e.target.value);
                                                                    }}
                                                                    onWheel={(e: any) => e.target.blur()}
                                                                    step="any"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 text-right">
                                                        <Button type="submit" color="primary">
                                                            Add Referral Person
                                                        </Button>
                                                    </div>
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

export default AddRefferalPerson;
