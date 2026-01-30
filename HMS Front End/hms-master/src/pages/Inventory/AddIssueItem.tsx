import React, { useState, useEffect } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import InventoryApiService from '../../helpers/services/inventory/inventoryapiservice';
import SetupApiService from '../../helpers/services/setup/setup-api-service';
import EmployeeApiService from '../../helpers/services/employee/EmployeeApiService';
import { minimizePage } from '../../slices/pageResizer/uiSlice';
import { useDispatch } from 'react-redux';

const AddIssueItem = () => {
    const inventoryApiService: InventoryApiService = new InventoryApiService();
    const setupApiService: SetupApiService = new SetupApiService();
    const employeeApiService: EmployeeApiService = new EmployeeApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [userType, setUserType] = useState("");
    const [userTypeValidationError, setUserTypeValidationError] = useState(false);
    const [issueTo, setIssueTo] = useState("");
    const [issueToValidationError, setIssueToValidationError] = useState(false);
    const [issuedBy, setIssuedBy] = useState("");
    const [issuedByValidationError, setIssuedByValidationError] = useState(false);
    const [issueDate, setIssueDate] = useState("");
    const [issueDateValidationError, setIssueDateValidationError] = useState(false);
    const [returnDate, setReturnDate] = useState('');
    const [note, setNote] = useState('');
    const [itemCategory, setItemCategory] = useState('');
    const [itemCategoryValidationError, setItemCategoryValidationError] = useState(false);
    const [item, setItem] = useState('');
    const [itemValidationError, setItemValidationError] = useState(false);
    const [quantity, setQuantity] = useState<any>();
    const [quantityValidationError, setQuantityValidationError] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [itemData, setItemData] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [employeeData, setEmployeeData] = useState<any>([]);
    const data = { userType, issueTo, issuedBy, employeeData, issueDate, returnDate, note, itemCategory,item,quantity }

    const handleUserTypeChange = (value: any) => {
        setUserType(value);
        setUserTypeValidationError(false);
        handleEmployeeSearch(value);
    };

    const handleIssueToChange = (value: any) => {
        setIssueTo(value);
        setIssueToValidationError(false);
    };

    const handleIssuedByChange = (value: any) => {
        setIssuedBy(value);
        setIssuedByValidationError(false);
    };

    const handleIssueDateChange = (value: any) => {
        setIssueDate(value);
        setIssueDateValidationError(false);
    };

    const handleQuantityChange = (value: any) => {
        setQuantity(value);
        setQuantityValidationError(false);
    };

    const handleItemCategoryChange = (value: any) => {
        setItemCategory(value);
        setItemCategoryValidationError(false);
    };

    const handleItemChange = (value: any) => {
        setItem(value);
        setItemValidationError(false);
    };

    const validateForm = () => {
        let isFormValid = true;

        if (!userType) {
            setUserTypeValidationError(true);
            isFormValid = false;
        }

        if (!issueTo) {
            setIssueToValidationError(true);
            isFormValid = false;
        }

        if (!issuedBy) {
            setIssuedByValidationError(true);
            isFormValid = false;
        }

        if (!issueDate) {
            setIssueDateValidationError(true);
            isFormValid = false;
        }

        if (!itemCategory) {
            setItemCategoryValidationError(true);
            isFormValid = false;
        }

        if (!item) {
            setItemValidationError(true);
            isFormValid = false;
        }

        if (!quantity) {
            setQuantityValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            addItems();
        }
    };

    const addItems = async () => {
        try {
            const payload = {
                userType: userType,
                issueTo: issueTo,
                issuedBy: issuedBy,
                issueDate: issueDate,
                returnDate: returnDate,
                note: note,
                itemCategory: itemCategory,
                item: item,
                quantity: quantity
            };
            await inventoryApiService.createIssueItems(payload);
            toast.success("Issue Item Added Successfully", { containerId: "TR" });
            navigate("/main/issueItemList");
        } catch (error: any) {
            return ErrorHandler(error);
        }
    };

    const getAllInventoryCategory = async () => {
        try {
            let result = await setupApiService.getAllInventoryCategory();
            setCategoryData(result);
        } catch (error: any) {
            return ErrorHandler(error);
        }
    };

    const getAllAddItems = async () => {
        try {
            let result = await inventoryApiService.getAllAddItems();
            setItemData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllRole = async () => {
        try {
            let result = await employeeApiService.getAllRole();
            setRoleData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const handleEmployeeSearch = async (value: any) => {
        try {
            let url = "role=" + value
            let result = await employeeApiService.searchAllEmployee(url);
            setEmployeeData(result)
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllInventoryCategory();
        getAllAddItems();
        getAllRole();
    }, []);

    useEffect(() => {
        if (location?.state) {
            setUserType(location?.state?.userType);
            setEmployeeData(location?.state?.employeeData);
            setIssueTo(location?.state?.issueTo);
            setIssuedBy(location?.state?.issuedBy);
            setIssueDate(location?.state?.issueDate);
            setReturnDate(location?.state?.returnDate);
            setNote(location?.state?.note);
            setItemCategory(location?.state?.itemCategory);
            setItem(location?.state?.item);
            setQuantity(location?.state?.quantity);
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader
                        title="Add Issue Item"
                        pageTitle="Setup"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Add Income",
                            data
                        }))} />
                    <Card>
                        <CardBody>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Add Issue Item</h5>

                                <Link to="/main/issueItemList" className="text-end">
                                    <Button
                                        color="primary"
                                        className="btn btn-primary add-btn"
                                    >
                                        <IoArrowBack /> Back
                                    </Button>
                                </Link>
                            </div>


                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="userType">User Type <span className='text-danger'> * </span></Label>
                                                    <Input type="select"
                                                        id="userType"
                                                        value={userType}
                                                        onChange={e => handleUserTypeChange(e.target.value)}
                                                        invalid={!!userTypeValidationError}
                                                    >
                                                        <option value="">Select User Type</option>
                                                        {roleData.map((item: any, idx: any) => (
                                                            <option key={idx} value={item.roleName}>{item.roleName}</option>
                                                        ))}
                                                    </Input>
                                                    {userTypeValidationError && <div className="invalid-feedback">User Type Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="issueTo">Issue To <span className='text-danger'> * </span></Label>
                                                    <Input type="select"
                                                        id="issueTo"
                                                        value={issueTo}
                                                        onChange={e => handleIssueToChange(e.target.value)}
                                                        invalid={!!issueToValidationError}
                                                    >
                                                        <option value="">Select Person</option>
                                                        {employeeData.map((item: any, idx: any) => (
                                                            <option key={idx} value={item.fullName}>{item.fullName}</option>
                                                        ))}
                                                    </Input>
                                                    {issueToValidationError && <div className="invalid-feedback">Issue To Required</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="issuedBy">Issued By <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="issuedBy"
                                                        value={issuedBy}
                                                        onChange={(e) => handleIssuedByChange(e.target.value)}
                                                        invalid={!!itemValidationError}
                                                    />
                                                    {issuedByValidationError && (
                                                        <div className="invalid-feedback">
                                                            Issued By Required
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="issueDate">Issue Date <span className='text-danger'> * </span></Label>
                                                    <Input type="date"
                                                        id="issueDate"
                                                        value={issueDate}
                                                        onChange={e => handleIssueDateChange(e.target.value)}
                                                        invalid={!!issueDateValidationError}
                                                    />
                                                    {issueDateValidationError && <div className="invalid-feedback">Issue Date Required</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="returnDate">Return Date</Label>
                                                    <Input type="date"
                                                        id="returnDate"
                                                        value={returnDate}
                                                        onChange={e => setReturnDate(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="category">Category <span className='text-danger'> * </span></Label>
                                                    <Input type="select" id="category"
                                                        value={itemCategory}
                                                        onChange={e => handleItemCategoryChange(e.target.value)}
                                                        invalid={!!itemCategoryValidationError}
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categoryData.map((item: any, idx: any) => (
                                                            <option key={idx} value={item.itemCategory}>
                                                                {item.itemCategory}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                    {itemCategoryValidationError && <div className="invalid-feedback">Category Required</div>}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="Item">Item <span className='text-danger'> * </span></Label>
                                                    <Input type="select" id="Item"
                                                        value={item}
                                                        onChange={e => handleItemChange(e.target.value)}
                                                        invalid={!!itemValidationError}
                                                    >
                                                        <option value="">Select Item</option>
                                                        {itemData.map((item: any, idx: any) => (
                                                            <option key={idx} value={item.item}>{item.item}</option>
                                                        ))}
                                                    </Input>
                                                    {itemValidationError && <div className="invalid-feedback">Item Required</div>}
                                                </FormGroup>
                                            </Col>

                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="quantity">Quantity <span className='text-danger'> * </span></Label>
                                                    <Input type="text"
                                                        id="quantity"
                                                        value={quantity}
                                                        onChange={e => handleQuantityChange(e.target.value)}
                                                        invalid={!!quantityValidationError}
                                                    />
                                                    {quantityValidationError && <div className="invalid-feedback">Quantity Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="note">Note</Label>
                                                    <Input
                                                        type="textarea"
                                                        id="note"
                                                        value={note}
                                                        onChange={e => setNote(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button color="primary" type="submit">Submit</Button>
                                    </Form>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default AddIssueItem;
