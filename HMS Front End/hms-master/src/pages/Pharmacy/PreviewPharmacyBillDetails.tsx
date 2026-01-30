import React from "react"
import { Card, CardBody, Col, Container, Label, Row } from "reactstrap"
import PaymentDetails from './PaymentDetails'
import PaymentForm from './PaymentForm'

const PreviewPharmacyBillDetails = (props: any) => {
    const data = props.data;

    return (
        <React.Fragment>
            <Container fluid>
                <Card>
                    <CardBody>
                        <PaymentDetails data={data} />
                        <PaymentForm data={data} handleClose={props.handleClose} />
                        {/* <PaymentDetailsTable data={data} /> */}
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment >
    )
}

export default PreviewPharmacyBillDetails