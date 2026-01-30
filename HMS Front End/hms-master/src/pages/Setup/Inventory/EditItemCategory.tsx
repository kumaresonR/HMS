import { faXmark, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";
import ErrorHandler from "../../../helpers/ErrorHandler";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";

const EditItemCategory = () => {
  const setupApiService: SetupApiService = new SetupApiService();

  let navigate: any = useNavigate();

  const { state } = useLocation();

  const data = state?.data;

  const [category, setCategory] = useState<any>('');
  const [itemCategoryValidationError, setItemCategoryValidationError] = useState(false);
  const [description, setDescription] = useState('');
  const [modNo, setModNo] = useState('');
  const [modNoValidationError, setModNoValidationError] = useState(false);
  const [status, setStatus] = useState('');

  const handleCategoryChange = (value: any) => {
    setCategory(value);
    setItemCategoryValidationError(false);
  }

  const validateForm = () => {
    let isFormValid = true;

    if (!category) {
      setItemCategoryValidationError(true);
      isFormValid = false;
    }

    // if (!status) {
    //   setStatusValidationError(true);
    //   isFormValid = false;
    // }

    // if (!modNo) {
    //   setModNoValidationError(true);
    //   isFormValid = false;
    // }

    return isFormValid;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      editInventoryCategory();
    }
  }
  const editInventoryCategory = async () => {
    try {
      const payload = {
        itemCategory: category,
        description: description,
        status: status,
      };
      await setupApiService.editInventoryCategory(data.id,payload);
      navigate('/main/InventoryMainSetup');
      toast.success('Item Category Updated Successfully', { containerId: 'TR' });
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  const setData = (data: any) => {
    setCategory(data.itemCategory);
    setDescription(data.description);
    // setModNo(data.modNo);
    setStatus(data.status);
  }

  useEffect(() => {
    if (state?.data) {
      setData(data);
    }
  }, [state?.data]);

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <FormHeader title="Edit Item Category" pageTitle="Setup" />
          <Card>
            <CardBody>
              <div className='text-end'>
                <Button
                  color="primary"
                  onClick={() => navigate(-1)}
                  className="btn btn-primary add-btn mx-2"
                >
                  <IoArrowBack /> Back
                </Button>
              </div>
              <Row className="d-flex justify-content-center">
                <Col xl={12}>
                  <Form onSubmit={handleSubmit}>
                    <Row className='align-items-center'>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="itemCategory"> Item Category <span className='text-danger'> * </span></Label>
                          <Input
                            type="text"
                            id="itemCategory"
                            value={category}
                            onChange={e => handleCategoryChange(e.target.value)}
                            invalid={!!itemCategoryValidationError}
                          />
                          {itemCategoryValidationError && <div className="invalid-feedback">Item Category  Required</div>}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="description"> Description</Label>
                          <textarea
                            className={`form-control`}
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      {/* <Col>
                          <FormGroup>
                            <Label for="name">Version</Label>
                            <Input
                              className={`${modNoValidationError && !item.modNo ? 'is-invalid' : ''}`}
                              type="text"
                              id="name"
                              value={index.modNo}
                              onChange={e => handleCategoryDataChange(index, 'modNo', e.target.value)}
                            />
                            {modNoValidationError && !item.modNo && (
                              <div className="invalid-feedback">Version Required</div>
                            )}
                          </FormGroup>
                        </Col> */}
                    </Row>

                    <Col className='text-end'>
                      <Button type="submit" color="primary">Submit</Button>
                    </Col>
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

export default EditItemCategory