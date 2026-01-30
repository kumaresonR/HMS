import { Button, Col, Container, Label, Row } from "reactstrap"
import PurchaseDetailDataTable from "./PurchaseDetailDataTable"
import { useState } from "react";
import moment from "moment";
import PharmacyApiService from "../../helpers/services/pharmacy/pharmacy-api-service";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";

const PreviewPurchaseDetails = (props: any) => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();

    const [data, setData] = useState(props.data);
    const [rows, setRows] = useState(props.data?.medicines || []);
    const supplierId = props.data.supplierId?.match(/supplierId=([^,]+)/)?.[1]?.trim() || "NA";

    console.log("Extracted Supplier ID:", supplierId);

    const [salePrices, setSalePrices] = useState(
        props.data?.medicines?.reduce((acc: any, medicine: any) => {
            acc[medicine.medicineId] = medicine.salePrice || '';
            return acc;
        }, {})
    );

    const handleSalePriceChange = (medicineId: string, value: string) => {
        const numericValue = value ? parseFloat(value) : 0;

        setSalePrices((prev: any) => ({
            ...prev,
            [medicineId]: numericValue,
        }));

        setRows((prevRows: any) =>
            prevRows.map((medicine: any) =>
                medicine.medicineId === medicineId
                    ? { ...medicine, salePrice: numericValue }
                    : medicine
            )
        );
    };

    const doCreatePayment = async () => {
        try {
            let formData: FormData = new FormData();
            const payload: any = {
                purchaseBillId: props.data.purchaseBillId,
                purchaseDate: props.data.purchaseDate,
                supplierId: supplierId,
                billNo: props.data.billNo,
                note: props.data.note,
                totalAmount: props.data.totalAmount,
                discount: props.data.discount,
                tax: props.data.tax,
                netAmount: props.data.netAmount,
                paymentMode: props.data.paymentMode,
                paymentAmount: props.data.paymentAmount,
                chequeNo: props.data.chequeNo,
                chequeDate: props.data.chequeDate,
                paymentNote: props.data.paymentNote,
                medicines: rows,
            };

            console.log("paylod", payload)
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log("JSON.stringify(jsonBlob)", JSON.stringify(payload))
            formData.append('purchaseBillData', jsonBlob);
            formData.append('chequeAttachment', props.data.chequeAttachDocument);
            formData.append("attachment", props.data.attachment);
            await pharmacyApiService.editPurchaseMedicine(data.purchaseBillId, formData);
            toast.success('Purchase Medicine Details Updated Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    return <>
        <Container fluid>
            <Row>
                <Col>
                    <Label>Pharmacy Purchase No : {data.purchaseBillId}</Label>
                </Col>
                <Col>
                    <Label>Bill No : {data.billNo}</Label>
                </Col>
                <Col>
                    <Label>Purchase Date  : {moment(data.purchaseDate).format('DD-MM-YYYY  h:mm:ss A')}</Label>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col>
                    <Row>
                        <Col><Label>Supplier Name</Label></Col>
                        <Col><Label>: {data.supplierId.split("supplierName=")?.[1]?.split(",")?.[0]?.trim() || "NA"}</Label></Col>
                    </Row>
                    <Row>
                        <Col><Label>Contact Person</Label></Col>
                        <Col><Label>: {data.supplierId.split("contactPersonName=")?.[1]?.split(",")?.[0]?.trim() || "NA"}</Label></Col>
                    </Row>
                    <Row>
                        <Col><Label>Drug License Number</Label></Col>
                        <Col><Label>: {data.supplierId.split("drugLicenceNumber=")?.[1]?.split(",")?.[0]?.trim() || "NA"}</Label></Col>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <Col><Label>Supplier Contact</Label></Col>
                        <Col><Label>: {data.supplierId.split("supplierContact=")?.[1]?.split(",")?.[0]?.trim() || "NA"}</Label></Col>
                    </Row>
                    <Row>
                        <Col><Label>Contact Person Phone</Label></Col>
                        <Col><Label>: {data.supplierId.split("contactPersonName=")?.[1]?.split(",")?.[0]?.trim() || "NA"}</Label></Col>
                    </Row>
                    <Row>
                        <Col><Label>Address</Label></Col>
                        <Col><Label>: {data.supplierId.split("address=")?.[1]?.split(",")?.[0]?.trim() || "NA"}</Label></Col>
                    </Row>
                </Col>
            </Row>
            <hr />
            <PurchaseDetailDataTable
                // salePrices={salePrices}
                // onSalePriceChange={handleSalePriceChange}
                data={data} />
            <hr />
            <Row>
                <Col>
                    <Label>Payment Mode : {data.paymentMode}</Label>
                </Col>
                <Col md={4}>
                    <Col className="d-flex justify-content-between">
                        <Label>Total (₹) </Label>
                        <Label>{data.totalAmount}</Label>
                    </Col>
                    <Col className="d-flex justify-content-between">
                        <Label>Discount (%)</Label>
                        <Label>{data.discount} %</Label>
                    </Col>
                    <Col className="d-flex justify-content-between">
                        <Label>Tax (₹) </Label>
                        <Label>{data.tax}</Label>
                    </Col>
                    <Col className="d-flex justify-content-between">
                        <Label>Net Amount  (₹)  </Label>
                        <Label>{data.netAmount}</Label>
                    </Col>
                </Col>
            </Row>
            {/* <Row>
                <Col className="text-end">
                    <Button onClick={doCreatePayment}>Save</Button>
                </Col>
            </Row> */}
        </Container>
    </>
}
export default PreviewPurchaseDetails