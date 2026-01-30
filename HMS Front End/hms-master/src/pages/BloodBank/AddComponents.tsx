import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormGroup, Input, Row, Table, Spinner } from 'reactstrap'
import BloodBankApiService from '../../helpers/services/bloodBank/BloodBankApiService';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import { bloodGroupDetails } from '../../common/data/FakeData';
import SetupApiService from '../../helpers/services/setup/setup-api-service';

const options = [
    { value: "", label: "Select" },
    { value: "1", label: "(ML)" },
    { value: "2", label: "Litter" },
    { value: "3", label: "(nm)" },
    { value: "4", label: "per day" },
    { value: "5", label: "Hour" },
    { value: "6", label: "Insurance" },
    { value: "7", label: "g/dl" },
    { value: "8", label: "MG" },
    { value: "9", label: "per km" },
    { value: "10", label: "per hour" },
    { value: "11", label: "Digital mammography" },
    { value: "12", label: "PET/CT scan" },
    { value: "13", label: "Bone density scan" },
    { value: "14", label: "10-21 mm Hg" },
];

// const data = [
//     { id: 9, name: 'Platelets' },
//     { id: 10, name: 'Plasma' },
//     { id: 11, name: 'Cryo.' },
//     { id: 12, name: 'White Cells & Granulocytes' },
//     { id: 13, name: 'Red Cells' },
//     { id: 14, name: 'Cryo' },
// ];

const AddComponents = (props: any) => {
    const bloodBankApiService: BloodBankApiService = new BloodBankApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    const [bagDetails, setBagDetails] = useState<any>([]);
    const [bloodGroup, setBloodGroup] = useState('');
    const [bloodGroupValidationError, setBloodGroupValidationError] = useState(false);
    const [bag, setBag] = useState('');
    const [bagValidationError, setBagValidationError] = useState(false);
    const [productData, setProductData] = useState([]);
    const [formData, setFormData] = useState<any>([]);
    const [filteredBagDetails, setFilteredBagDetails] = useState(bagDetails);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any, index: any, field: any) => {
        const updatedFormData: any = [...formData];
        updatedFormData[index][field] = e.target.value;
        setFormData(updatedFormData);
    };

    const handleSelectChange = (e: any, index: any) => {
        const updatedFormData = [...formData];
        updatedFormData[index]["unit"] = e.target.value;
        setFormData(updatedFormData);
    };

    const handleCheckboxChange = (index: any) => {
        const updatedFormData = [...formData];
        updatedFormData[index].isSelected = !updatedFormData[index].isSelected;
        updatedFormData[index].componentName = updatedFormData[index].isSelected ? updatedFormData[index].name : "";
        setFormData(updatedFormData);
    };

    const handleBloodGroupChange = (value: any) => {
        setBloodGroup(value);
        setBloodGroupValidationError(false);

        const filteredData = bagDetails.filter((item: any) => item?.donorDetails?.bloodGroup === value);
        setFilteredBagDetails(filteredData);
    }

    const handleBagChange = (value: any) => {
        setBag(value);
        setBagValidationError(false);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateComponent();
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!bloodGroup) {
            setBloodGroupValidationError(true);
            isFormValid = false;
        }
        if (!bag) {
            setBagValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const doCreateComponent = async () => {
        try {
            const selectedItems = formData.filter((item: any) => item.isSelected);
            const payload = selectedItems.map((item: any) => ({
                bloodGroup: bloodGroup,
                bagStockId: bag,
                componentName: item.componentName,
                componentBag: item.bag,
                volume: item.volume,
                unit: item.unit,
                lot: item.lot,
                institution: item.institution
            }));

            console.log(payload)
            await bloodBankApiService.createComponent(payload);
            toast.success('Component Created Successfully', { containerId: 'TR' });
            props.handleClose();
            if (props.refresh) {
                props.refresh()
            }
        } catch (error: any) {
            console.log("Component Created Failed", error);
            return ErrorHandler(error)
        }
    }

    const getAllBags = async () => {
        try {
            let result = await bloodBankApiService.getAllBags();
            console.log("getAllBags", result);
            setBagDetails(result);
        } catch (error: any) {
            console.log("getAllBags Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const getAllRaiologyParameter = async () => {
        try {
            let result = await setupApiService.getAllMasterProduct();
            const filteredData = result.filter((item: any) => item.type === "Component");
            setProductData(filteredData);
            setFormData(filteredData.map((item: any) => ({
                ...item,
                bag: "",
                volume: "",
                unit: "",
                lot: "",
                institution: "",
                componentName: "",
                isSelected: false,
            })));
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllBags();
        getAllRaiologyParameter();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col>
                        <Form onSubmit={handleSubmit}>
                            <Row className="justify-content-around">
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Blood Group <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-control ${bloodGroupValidationError ? 'is-invalid' : ''}`}
                                            value={bloodGroup}
                                            onChange={(e) => { handleBloodGroupChange(e.target.value) }}
                                        >
                                            <option value="">--Select--</option>
                                            {bloodGroupDetails.map((data, idx) => (
                                                <option key={idx} value={data.type}>{data.type}</option>
                                            ))}
                                        </select>
                                        {bloodGroupValidationError && <div className="invalid-feedback">Blood Group Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Bag <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-control ${bagValidationError ? 'is-invalid' : ''}`}
                                            value={bag}
                                            onChange={(e) => { handleBagChange(e.target.value) }}
                                        >
                                            <option value="">--Select--</option>
                                            {filteredBagDetails.length > 0 ? (
                                                filteredBagDetails.map((data: any, idx: any) => (
                                                    <option key={idx} value={data.bagStockId}>{data.bagNo} ({data.volume} {data.unitType})</option>
                                                ))
                                            ) : (
                                                <option value="" disabled>No bags available for selected blood group</option>
                                            )}
                                        </select>
                                        {bagValidationError && <div className="invalid-feedback">Bag Required.</div>}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="12">
                                    <Table striped bordered hover responsive>
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: "18%" }}>Components Name<small className="text-danger"> *</small></th>
                                                <th>Bag<small className="text-danger"> *</small></th>
                                                <th>Volume</th>
                                                <th>Unit</th>
                                                <th>Lot<small className="text-danger"> *</small></th>
                                                <th>Institution</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.map((item: any, index: any) => (
                                                <tr key={index}>
                                                    <td>
                                                        <FormGroup check>
                                                            <Input
                                                                type="checkbox"
                                                                name="select[]"
                                                                value={item.id}
                                                                checked={item.isSelected}
                                                                onChange={() => handleCheckboxChange(index)}
                                                            />{" "}
                                                            {item.name}
                                                        </FormGroup>
                                                    </td>
                                                    <td>
                                                        <Input
                                                            type="number"
                                                            value={item.bag}
                                                            onChange={e => handleChange(e, index, 'bag')}
                                                            name={`bag_no_${item.id}`}
                                                            autoComplete="off"
                                                            onWheel={(e: any) => e.target.blur()}
                                                            step="any"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            type="number"
                                                            value={item.volume}
                                                            name={`volume_${item.id}`}
                                                            onChange={e => handleChange(e, index, 'volume')}
                                                            onWheel={(e: any) => e.target.blur()}
                                                            step="any"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            type="select"
                                                            value={item.unit}
                                                            onChange={e => handleSelectChange(e, index)}
                                                            name={`unit_${item.id}`}
                                                        >
                                                            {options.map(opt => (
                                                                <option key={opt.value} value={opt.label}>{opt.label}</option>
                                                            ))}
                                                        </Input>
                                                    </td>
                                                    <td>
                                                        <Input
                                                            type="number"
                                                            value={item.lot}
                                                            name={`lot_${item.id}`}
                                                            onChange={e => handleChange(e, index, 'lot')}
                                                            onWheel={(e: any) => e.target.blur()}
                                                            step="any"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            type="text"
                                                            value={item.institution}
                                                            name={`institution_${item.id}`}
                                                            onChange={e => handleChange(e, index, 'institution')}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col className="text-end">
                                    {/* <Button
                                        color="primary"
                                        className="btn btn-primary ms-3" type="submit"></Button> */}
                                        <Button color='primary' disabled={loading}>
                                            {loading ? <Spinner size='sm' className='me-2' /> : 'submit'}
                                        </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default AddComponents