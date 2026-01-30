import { useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, Input } from "reactstrap"
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";

const EditPostnatalHistory = (props: any) => {
    const ipdApiService: IPDApiService = new IPDApiService();

    const [ipdId, setIpdId] = useState('');
    const [laborTime, setLaborTime] = useState('');
    const [laborTimeValidationError, setLaborTimeValidationError] = useState(false);
    const [deliveryTime, setDeliveryTime] = useState('');
    const [deliveryTimeValidationError, setDeliveryTimeValidationError] = useState(false);
    const [routineQuestion, setRoutineQuestion] = useState('');
    const [generalRemark, setGeneralRemark] = useState('');
    const [postnatalId, setPostnationalId] = useState('');

    const handleLaborTimeChange = (value: any) => {
        setLaborTime(value);
        setLaborTimeValidationError(false);
    }

    const handleDeliveryTimeChange = (value: any) => {
        setDeliveryTime(value);
        setDeliveryTimeValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!laborTime) {
            setLaborTimeValidationError(true);
            isFormValid = false;
        }

        if (!deliveryTime) {
            setDeliveryTimeValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreate();
        }
    }

    const doCreate = async () => {
        try {
            let payload: any = {
                ipdId: ipdId,
                laborTime: laborTime,
                deliveryTime: deliveryTime,
                routineQuestion: routineQuestion || 'NA',
                generalRemark: generalRemark || 'NA'
            }
            await ipdApiService.editPostnatalHistory(postnatalId, payload);
            toast.success('Postnatal History Updated Successfully', { containerId: 'TR' });
            props.handleClose();
            props.refresh();
        } catch (error: any) {
            console.log("Postnatal History Failed", error);
            return ErrorHandler(error)
        }
    }

    const getPostnatalHistoryById = async () => {
        try {
            let data = await ipdApiService.getPostnatalHistoryById(props.id);
            setPostnatalData(data);
            console.log('PreviousObstetricHistory data', data);
        } catch (error) {
            console.log(error);
        }
    }

    const setPostnatalData = (data: any) => {
        setIpdId(data.ipdId);
        setPostnationalId(data.postnatalId);
        setLaborTime(data.laborTime);
        setDeliveryTime(data.deliveryTime);
        setRoutineQuestion(data.routineQuestion);
        setGeneralRemark(data.generalRemark);
    }

    useEffect(() => {
        setPostnatalData(props.id)
    }, []);

    return <>
        <Form onSubmit={handleSubmit}>
            <Col>
                <FormGroup>
                    <label className="text-start mb-2">Labor Time <span className="text-danger">*</span></label>
                    <Input className={` ${laborTimeValidationError ? 'is-invalid' : ''}`}
                        id="laborTime"
                        name="laborTime"
                        type="datetime-local"
                        value={laborTime}
                        onChange={e => handleLaborTimeChange(e.target.value)}
                    />
                    {laborTimeValidationError && <div className="invalid-feedback">Labor Time Required.</div>}
                </FormGroup>
            </Col>
            <Col>
                <FormGroup>
                    <label className="text-start mb-2">Delivery time <span className="text-danger">*</span></label>
                    <Input className={` ${deliveryTimeValidationError ? 'is-invalid' : ''}`}
                        id="DeliveryTime"
                        name="DeliveryTime"
                        type="datetime-local"
                        value={deliveryTime}
                        onChange={e => handleDeliveryTimeChange(e.target.value)}
                    />
                    {deliveryTimeValidationError && <div className="invalid-feedback">Delivery Time Required.</div>}
                </FormGroup>
            </Col>
            <Col md={12}>
                <FormGroup>
                    <label className="text-start mb-2">Routine Question</label>
                    <textarea className="form-control"
                        id="RoutineQuestion"
                        name="RoutineQuestion"
                        value={routineQuestion}
                        onChange={e => setRoutineQuestion(e.target.value)}
                    />
                </FormGroup>
            </Col>
            <Col md={12}>
                <FormGroup>
                    <label className="text-start mb-2">General Remark</label>
                    <textarea className="form-control"
                        id="GeneralRemark"
                        name="GeneralRemark"
                        value={generalRemark}
                        onChange={e => setGeneralRemark(e.target.value)}
                    />
                </FormGroup>
            </Col>
            <Col className="text-end">
                <Button color="primary">Save</Button>
            </Col>
        </Form>
    </>
}
export default EditPostnatalHistory