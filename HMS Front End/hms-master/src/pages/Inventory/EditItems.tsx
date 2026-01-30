import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import FormHeader from "../../common/FormHeader/FormHeader";
import ErrorHandler from "../../helpers/ErrorHandler";
import InventoryApiService from "../../helpers/services/inventory/inventoryapiservice";
import SetupApiService from "../../helpers/services/setup/setup-api-service";

const EditItem = () => {
    const inventoryApiService: InventoryApiService = new InventoryApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const id = state?.id;
    const [item, setItem] = useState("");
    const [itemValidationError, setItemValidationError] = useState(false);
    const [itemCategory, setItemCategory] = useState("");
    const [itemCategoryvalidationError, setItemCategoryValidationError] =
        useState(false);
    const [unit, setUnit] = useState("");
    const [unitValidationError, setUnitValidationError] = useState(false);
    const [description, setDescription] = useState("");
    const [categoryData, setCategoryData] = useState([]);

    const handleItemChange = (value: any) => {
        setItem(value);
        setItemValidationError(false);
    };

    const handleItemCategoryChange = (value: any) => {
        setItemCategory(value);
        setItemCategoryValidationError(false);
    };

    const handleUnitChange = (value: any) => {
        setUnit(value);
        setUnitValidationError(false);
    };

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

        if (!unit) {
            setUnitValidationError(true);
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
                item: item,
                itemCategory: itemCategory,
                unit: unit,
                description: description,
            };
            await inventoryApiService.editAddItems(id, payload);
            toast.success("Item Updated Successfully", { containerId: "TR" });
            navigate("/main/itemList");
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
            let result = await inventoryApiService.getAddItemsById(id);
            console.log("getAllAddItems", result);
            setItemData(result);
        } catch (error: any) {
            console.log("getAllAddItems Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const setItemData = (data:any) => {
        setItem(data.item);
        setItemCategory(data.itemCategory);
        setUnit(data.unit);
        setDescription(data.description);
    }

    useEffect(() => {
        getAllInventoryCategory();
        getAllAddItems();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Edit Items" pageTitle="Setup" />
                    <Card>
                        <CardBody>
                            <Row className="d-flex justify-content-center">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Edit Item Details</h5>

                                    <Link to="/main/itemList" className="text-end">
                                        <Button color="primary" className="btn btn-primary add-btn">
                                            <IoArrowBack /> Back
                                        </Button>
                                    </Link>
                                </div>

                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="item">Item</Label>
                                                    <Input
                                                        type="text"
                                                        id="item"
                                                        value={item}
                                                        onChange={(e) => handleItemChange(e.target.value)}
                                                        invalid={!!itemValidationError}
                                                    />
                                                    {itemValidationError && (
                                                        <div className="invalid-feedback">
                                                            Item Required
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
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
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="unit">Unit</Label>
                                                    <Input
                                                        type="text"
                                                        id="unit"
                                                        value={unit}
                                                        onChange={(e) => handleUnitChange(e.target.value)}
                                                        invalid={!!unitValidationError}
                                                    />
                                                    {unitValidationError && (
                                                        <div className="invalid-feedback">
                                                            Unit Required
                                                        </div>
                                                    )}
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
                                        </Row>
                                        <Button color="primary" type="submit">
                                            Add Item
                                        </Button>
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
export default EditItem