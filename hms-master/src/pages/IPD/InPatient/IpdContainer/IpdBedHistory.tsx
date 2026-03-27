import moment from "moment";
import { useEffect, useState } from "react";
import { Card, CardBody, Col, Table } from "reactstrap"

const IpdBedHistory = (props: any) => {
    const [data, setData] = useState(props.data);

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return <>
        <Col>
            <Card >
                <CardBody>
                    <h5>Bed History</h5>
                    <div className="table-responsive">
                        <Table hover className="table-centered align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Bed Group</th>
                                    <th>Bed</th>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                    {/* <th>Active Bed</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {data?.bedDetails?.bedGroup?.name || 'NA'}
                                    </td>
                                    <td>
                                        <span>{data?.bedDetails?.name || 'NA'}</span>
                                    </td>
                                    <td>
                                        {data.admissions?.admissionDate ? moment(data.admissions.admissionDate).format('DD/MM/YYYY, hh:mm A') : "NA"}
                                    </td>
                                    <td>
                                        {data.admissions?.dischargeDate ? moment(data.admissions.dischargeDate).format('DD/MM/YYYY, hh:mm A') : "NA"}
                                    </td>
                                    {/* <td>Yes</td> */}
                                </tr>
                            </tbody>
                        </Table>
                    </div>

                </CardBody>
            </Card >
        </Col>
    </>
}
export default IpdBedHistory