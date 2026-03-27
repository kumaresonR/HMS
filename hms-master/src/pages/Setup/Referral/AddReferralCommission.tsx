import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, Col, Container, Input, Label, Row } from 'reactstrap'
import FormHeader from '../../../common/FormHeader/FormHeader'
import { IoArrowBack } from 'react-icons/io5'
import ErrorHandler from '../../../helpers/ErrorHandler'
import { toast } from 'react-toastify'
import SetupApiService from '../../../helpers/services/setup/setup-api-service'

const AddReferralCommission = () => {
    const setupApiService: SetupApiService = new SetupApiService();
    let navigate: any = useNavigate();

    const [categoryData, setCategoryData] = useState([]);
    const [commissionData, setCommissionData] = useState([]);
    const [category, setCategory] = useState('');
    const [categoryValidationError, setCategoryValidationError] = useState(false);
    const [standardCommission, setStandardCommission] = useState<any>();
    const [opdCommission, setOpdCommission] = useState<any>();
    const [ipdCommission, setIpdCommission] = useState<any>();
    const [pharmacyCommission, setPharmacyCommission] = useState<any>();
    const [pathologyCommission, setPathologyCommission] = useState<any>();
    const [radiologyCommission, setRadiologyCommission] = useState<any>();
    const [bloodBankCommission, setBloodBankCommission] = useState<any>();
    const [ambulanceCommission, setAmbulanceCommission] = useState<any>();
    const [modNo, setModNo] = useState('');
    const [modNoValidationError, setModNoValidationError] = useState(false);
    const [selectedCommissionData, setSelectedCommissionData] = useState<any>();

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
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

        if (!category) {
            setCategoryValidationError(true);
            isFormValid = false;
        }

        // if (!modNo) {
        //     setModNoValidationError(true);
        //     isFormValid = false;
        // }

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
                // chargeType: chargeType,
                categoryId: category,
                opdCommission: opdCommission,
                ipdCommission: ipdCommission,
                pharmacyCommission: pharmacyCommission,
                pathologyCommission: pathologyCommission,
                radiologyCommission: radiologyCommission,
                bloodBankCommission: bloodBankCommission,
                ambulanceCommission: ambulanceCommission,
                standardCommission: standardCommission,
                // modNo: modNo
            };
            await setupApiService.createCommission(payload);
            toast.success("Referral Commission Added Successfully", { containerId: "TR" });
            navigate("/main/referralMainSetup");
        } catch (error: any) {
            return ErrorHandler(error);
        }
    };

    const getAllReferralCategory = async () => {
        try {
            let result = await setupApiService.getAllReferralCategoryTm();
            // const filteredData = result.filter((item: any) => item.status === "Approved");
            setCategoryData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllCommission = async () => {
        try {
            let result = await setupApiService.getAllCommission();
            setCommissionData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllReferralCategory();
        getAllCommission();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Referral Commission" pageTitle="Settup" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <div className="row">
                                        <div className="col-12">

                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="mb-0">Add Refferal Commission Details</h5>

                                                <Link to="/main/referralMainSetup" className="text-end">
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
                                                                        onChange={e => setStandardCommission(e.target.value)}
                                                                        onWheel={(e: any) => e.target.blur()}
                                                                        step="any"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* <div className="col-md-6 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="modNo">Mod No <span className='text-danger'> * </span></label>
                                                                    <Input
                                                                        id="modNo"
                                                                        name="modNo"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={modNo}
                                                                        onChange={e => handleModNoChange(e.target.value)}
                                                                        invalid={!!modNoValidationError}
                                                                    />
                                                                    {modNoValidationError && <div className="invalid-feedback">Mod No Required</div>}
                                                                </div>
                                                            </div> */}
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
                                                                    onChange={e => setOpdCommission(e.target.value)}
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
                                                                    onChange={e => setIpdCommission(e.target.value)}
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
                                                                    onChange={e => setPharmacyCommission(e.target.value)}
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
                                                                    onChange={e => setPathologyCommission(e.target.value)}
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
                                                                    onChange={e => setRadiologyCommission(e.target.value)}
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
                                                                    onChange={e => setBloodBankCommission(e.target.value)}
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
                                                                    onChange={e => setAmbulanceCommission(e.target.value)}
                                                                    onWheel={(e: any) => e.target.blur()}
                                                                    step="any"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 text-right">
                                                        <Button type="submit" color="primary">
                                                        Submit
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
    )
}

export default AddReferralCommission