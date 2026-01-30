import React, { useState, useEffect } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SetupApiService from '../../helpers/services/setup/setup-api-service';
import InventoryApiService from '../../helpers/services/inventory/inventoryapiservice';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { minimizePage } from '../../slices/pageResizer/uiSlice';

const AddItemStock = () => {
    const inventoryApiService: InventoryApiService = new InventoryApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [categoryData, setCategoryData] = useState([]);
    const [itemCategory, setItemCategory] = useState("");
    const [itemCategoryvalidationError, setItemCategoryValidationError] = useState(false);
    const [itemData, setItemData] = useState([]);
    const [item, setItem] = useState("");
    const [itemValidationError, setItemValidationError] = useState(false);
    const [supplierData, setSupplierData] = useState([]);
    const [supplier, setSupplier] = useState("");
    const [supplierValidationError, setSupplierValidationError] = useState(false);
    const [storeData, setStoreData] = useState([]);
    const [store, setStore] = useState("");
    const [storeValidationError, setStoreValidationError] = useState(false);
    const [availableQuantity, setAvailabelQnt] = useState('');
    const [quantity, setQuantity] = useState('');
    const [quantityValidationError, setQuantityValidationError] = useState(false);
    const [purchasePrice, setPurchasePrice] = useState('');
    const [purchasePriceValidationError, setPurchasePriceValidationError] = useState(false);
    const [date, setDate] = useState('');
    const [description, setDescription] = useState("");
    const [documentFile, setDocument] = useState<any>();
    const data = { itemCategory, item, supplier, store,quantity,purchasePrice,date,description }

    const handleItemChange = (value: any) => {
        setItem(value);
        setItemValidationError(false);
    };

    const handleItemCategoryChange = (value: any) => {
        setItemCategory(value);
        setItemCategoryValidationError(false);
    };

    const handleSupplierChange = (value: any) => {
        setSupplier(value);
        setSupplierValidationError(false);
    }

    const handleStoreChange = (value: any) => {
        setStore(value);
        setStoreValidationError(false);
    }

    const handleQuantityChange = (value: any) => {
        setQuantity(value);
        setQuantityValidationError(false);
    }

    const handlePurchasePriceChange = (value: any) => {
        setPurchasePrice(value);
        setPurchasePriceValidationError(false);
    }

    const onFileUploadListener = (event: any) => {
        const file = event.target.files[0];
        setDocument(file);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!item) {
            setItemValidationError(true);
            isFormValid = false;
        }

        if (!itemCategory) {
            setItemCategoryValidationError(true);
            isFormValid = false;
        }

        if (!supplier) {
            setSupplierValidationError(true);
            isFormValid = false;
        }

        if (!store) {
            setStoreValidationError(true);
            isFormValid = false;
        }

        if (!quantity) {
            setQuantityValidationError(true);
            isFormValid = false;
        }

        if (!purchasePrice) {
            setPurchasePriceValidationError(true);
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
            let formData: FormData = new FormData();
            const payload = {
                itemCategory: itemCategory,
                item: item,
                supplier: supplier,
                store: store,
                quantity: quantity,
                purchasePrice: purchasePrice,
                date: date,
                description: description
            };
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log("JSON.stringify(jsonBlob)", payload)
            formData.append('itemStockData', jsonBlob);
            formData.append('attachment', documentFile);
            await inventoryApiService.createAddItemStock(formData);
            toast.success("Item Added Successfully", { containerId: "TR" });
            navigate("/main/inventory");
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

    const getAllSupplier = async () => {
        try {
            let result = await setupApiService.getAllItemSupplier();
            setSupplierData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllItemStore = async () => {
        try {
            let result = await setupApiService.getAllItemStore();
            setStoreData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllInventoryCategory();
        getAllAddItems();
        getAllSupplier();
        getAllItemStore();
    }, []);

    useEffect(() => {
        if (location?.state) {
            setItemCategory(location?.state?.itemCategory);
            setItem(location?.state?.item);
            setSupplier(location?.state?.supplier);
            setStore(location?.state?.store);
            setQuantity(location?.state?.quantity);
            setPurchasePrice(location?.state?.purchasePrice);
            setDate(location?.state?.date);
            setDescription(location?.state?.description);
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader
                        title="Add Item Stock"
                        pageTitle="Setup"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Add Item Stock",
                            data
                        }))} />
                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Add Item Stock Details</h5>

                                    <Link to="/main/inventory" className="text-end">
                                        <Button
                                            color="primary"
                                            className="btn btn-primary add-btn"
                                        >
                                            <IoArrowBack /> Back
                                        </Button>
                                    </Link>
                                </div>
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="item_category">Item Category</Label>
                                                    <Input
                                                        type="select"
                                                        id="item_category"
                                                        value={itemCategory}
                                                        onChange={(e) =>
                                                            handleItemCategoryChange(e.target.value)
                                                        }
                                                        invalid={!!itemCategoryvalidationError}
                                                    >
                                                        <option value="">Select Item Category</option>
                                                        {categoryData.map((item: any, idx: any) => (
                                                            <option key={idx} value={item.itemCategory}>
                                                                {item.itemCategory}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                    {itemCategoryvalidationError && (
                                                        <div className="invalid-feedback">
                                                            Item Category Required
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="item">Item </Label>
                                                    <Input
                                                        type="select"
                                                        id="item"
                                                        value={item}
                                                        onChange={(e) =>
                                                            handleItemChange(e.target.value)
                                                        }
                                                        invalid={!!itemValidationError}
                                                    >
                                                        <option value="">Select Item </option>
                                                        {itemData.map((item: any, idx: any) => (
                                                            <option key={idx} value={item.item}>
                                                                {item.item}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                    {itemValidationError && (
                                                        <div className="invalid-feedback">
                                                            Item Required
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="supplier">Supplier </Label>
                                                    <Input
                                                        type="select"
                                                        id="supplier"
                                                        value={supplier}
                                                        onChange={(e) =>
                                                            handleSupplierChange(e.target.value)
                                                        }
                                                        invalid={!!supplierValidationError}
                                                    >
                                                        <option value="">Select Supplier </option>
                                                        {supplierData.map((item: any, idx: any) => (
                                                            <option key={idx} value={item.name}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                    {supplierValidationError && (
                                                        <div className="invalid-feedback">
                                                            Supplier Required
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="store">Store</Label>
                                                    <Input
                                                        type="select"
                                                        id="store"
                                                        value={store}
                                                        onChange={(e) =>
                                                            handleStoreChange(e.target.value)
                                                        }
                                                        invalid={!!storeValidationError}
                                                    >
                                                        <option value="">Select Store </option>
                                                        {storeData.map((item: any, idx: any) => (
                                                            <option key={idx} value={item.itemStoreName}>
                                                                {item.itemStoreName}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                    {storeValidationError && (
                                                        <div className="invalid-feedback">
                                                            Store Required
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="quantity">Quantity</Label>
                                                    <Input
                                                        type="text"
                                                        id="quantity"
                                                        value={quantity}
                                                        onChange={(e) => handleQuantityChange(e.target.value)}
                                                        invalid={!!quantityValidationError}
                                                    />
                                                    {quantityValidationError && (
                                                        <div className="invalid-feedback">
                                                            Quantity Required
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>

                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="purchase_price">Purchase Price</Label>
                                                    <Input
                                                        type="number"
                                                        id="purchase_price"
                                                        value={purchasePrice}
                                                        onChange={(e) => handlePurchasePriceChange(e.target.value)}
                                                        invalid={!!purchasePriceValidationError}
                                                        onWheel={(e: any) => e.target.blur()}
                                                        step="any"
                                                    />
                                                    {purchasePriceValidationError && (
                                                        <div className="invalid-feedback">
                                                            Purchase Price Required
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>

                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="date">Date</Label>
                                                    <Input
                                                        type="date"
                                                        id="date"
                                                        value={date}
                                                        onChange={(e) => setDate(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="description">Description</Label>
                                                    <Input
                                                        type="textarea"
                                                        id="description"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col md={12}>
                                                <FormGroup>
                                                    <label className="text-start mb-2">Attach Document</label>
                                                    <Input
                                                        type="file"
                                                        className="form-control"
                                                        id="attachment"
                                                        onChange={onFileUploadListener}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button type="submit" color="primary">Add Item Stock</Button>
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

export default AddItemStock;
