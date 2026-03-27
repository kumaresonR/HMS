import { Col, Container, Row, Table } from "reactstrap"

const PreviewRadiologyTestDetails = (props:any) => {
    return <>
        <Container fluid>
            <Row>
                <Col>
                    <p><b>Test Name :</b> Resting 12-lead EKG</p>
                    <p><b>Short Name :</b> RLE</p>
                    <p><b>Test Type :</b> RLE</p>
                    <p><b>Report Days :</b> 1</p>
                    <p><b>Charge Category : </b> 2</p>
                </Col>
                <Col>
                    <p><b>Category Name :</b> X-RAY LUMBOSACRAL SPINE AP AND LAT VIEWS</p>
                    <p><b>Sub Category :</b> RLE / lead EKG</p>
                    <p><b>Tax Category : </b> Cytopathology</p>
                    <p><b>Standard Charge : </b> ₵150.00</p>
                    <p><b>Tax (%) :</b> 18.00</p>
                    <h6>Amount : (₹)177.00</h6>
                </Col>
            </Row>
           
            <Row>
                <div className="table-responsive">
                    <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Test Parameter Name</th>
                                <th>Reference Range</th>
                                <th>Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {bloodDonorData?.map((data: any, idx: any) => (
                                <tr key={idx}>
                                    <td>{data.doctorName} </td>
                                    <th>{data.dateOfBirth}</th>
                                </tr>
                            ))} */}
                        </tbody>
                    </Table>
                </div>
            </Row>
        </Container>
    </>
}
export default PreviewRadiologyTestDetails