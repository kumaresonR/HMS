import { useState } from "react"
import { Col, Container, Row, Table } from "reactstrap"

const PreviewTestDetails = (props: any) => {
    const [data, setData] = useState(props.data)
    return <>
        <Container fluid>
            <Row>
                <Col>
                    <Table className="noBorderTable">
                        <tbody>
                            <tr>
                                <th scope="row">Test Name</th>
                                <td>{data.testName}</td>
                            </tr>
                            <tr>
                                <th scope="row">Short Name</th>
                                <td>{data.shortName}</td>
                            </tr>
                            <tr>
                                <th scope="row">Test Type</th>
                                <td>{data.testType}</td>
                            </tr>
                            <tr>
                                <th scope="row">Sub Category</th>
                                <td>{data.subCategory}</td>
                            </tr>
                            {data.method && (
                                <tr>
                                    <th scope="row">Method</th>
                                    <td>{data.method}</td>
                                </tr>
                            )}
                            <tr>
                                <th scope="row">Report Days</th>
                                <td>{data.reportDays}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col>
                    <Table className="noBorderTable">
                        <tbody>
                            <tr>
                                <th>Category Name</th>
                                <td>{data.categoryName}</td>
                            </tr>
                            <tr>
                                <th>Charge Name</th>
                                <td>{data.chargeName}</td>
                            </tr>
                            <tr>
                                <th>Charge Category</th>
                                <td>{data.chargeCategory}</td>
                            </tr>
                            <tr>
                                <th>Standard Charge</th>
                                <td>₹{data.standardCharge}</td>
                            </tr>
                            {data.testCategory && (
                                <tr>
                                    <th>Tax Category</th>
                                    <td>{data.testCategory}</td>
                                </tr>
                            )}
                            <tr>
                                <th>Tax (%)</th>
                                <td>{data.taxPercentage}</td>
                            </tr>
                            <tr>
                                <th>Amount (₹)</th>
                                <td><b>₹{data.amount}</b></td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>

            </Row>
            <Row>
                <Col>Charge Category Details :</Col>
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
                            {data.testParameters?.map((data: any, idx: any) => (
                                <tr key={idx}>
                                    <td>{data.parameterName} </td>
                                    <td>{data.normalRange}</td>
                                    <td>{data.unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Row>
        </Container>
    </>
}
export default PreviewTestDetails