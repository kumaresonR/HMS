import { Link, useLocation, useNavigate } from "react-router-dom";
import InventoryApiService from "../../helpers/services/inventory/inventoryapiservice";
import SetupApiService from "../../helpers/services/setup/setup-api-service";
import { useEffect, useState } from "react";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import FormHeader from "../../common/FormHeader/FormHeader";
import moment from "moment";

const EditItemStock = () => {
    const inventoryApiService: InventoryApiService = new InventoryApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const id = state?.id;

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
            await inventoryApiService.editAddItemStock(id.itemStockId, formData);
            toast.success("Item Updated Successfully", { containerId: "TR" });
            navigate("/main/inventory");
        } catch (error: any) {
            return ErrorHandler(error);
        }
    };

    const getAllInventoryCategory = async () => {
        try {
            let result = await setupApiService.getAllInventoryCategory();
            console.log("getAllExpenses", result);
            setCategoryData(result);
        } catch (error: any) {
            console.log("getAllExpenses Error");
            console.log(error);
            return ErrorHandler(error);
        }
    };

    const getAllAddItems = async () => {
        try {
            let result = await inventoryApiService.getAllAddItems();
            console.log("getAllAddItems", result);
            setItemData(result);
        } catch (error: any) {
            console.log("getAllAddItems Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const getAllSupplier = async () => {
        try {
            let result = await setupApiService.getAllItemSupplier();
            console.log("getAllSupplier", result);
            setSupplierData(result);
        } catch (error: any) {
            console.log("getAllSupplier Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const getAllItemStore = async () => {
        try {
            let result = await setupApiService.getAllItemStore();
            console.log("getAllItemStore", result);
            setStoreData(result);
        } catch (error: any) {
            console.log("getAllItemStore Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    // const getAllItemStock = async () => {
    //     try {
    //         let result = await inventoryApiService.getAddItemStockById(id);
    //         console.log("getAllItemStock", result);
    //         setItemStockData(result);
    //     } catch (error: any) {
    //         console.log("getAllItemStock Error");
    //         console.log(error);
    //         return ErrorHandler(error)
    //     }
    // }

    const setItemStockData = (data: any) => {
        setItem(data.item);
        setItemCategory(data.itemCategory);
        setSupplier(data.supplier);
        setDescription(data.description);
        setStore(data.store);
        setQuantity(data.quantity);
        setPurchasePrice(data.purchasePrice);
        setDate(moment(data.date).format('YYYY-MM-DD'));
    }

    useEffect(() => {
        getAllInventoryCategory();
        getAllAddItems();
        getAllSupplier();
        getAllItemStore();
        if (id) {
            setItemStockData(id)
        }
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Item Stock" pageTitle="Setup" />
                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Edit Item Stock Details</h5>

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

                                        <Button type="submit" color="primary">Update Item Stock</Button>
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

export default EditItemStock;