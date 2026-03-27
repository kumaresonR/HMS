import React, { useState } from "react";
import {
    Col,
    Input,
    Label,
    Row,
} from "reactstrap";
import 'react-toastify/dist/ReactToastify.css';

const DailyTransactionReport = () => {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Processing Transaction Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="dateFrom">
                                Date From
                            </Label>
                            <Input
                                type="date"
                                className="form-control"
                                id="dateFrom"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                placeholder="Enter Date From"
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="dateTo">
                                Date To
                            </Label>
                            <Input
                                type="date"
                                className="form-control"
                                id="dateTo"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                placeholder="Enter Date To"
                            />
                        </div>
                    </Col>
                </Row>

            </div>
        </React.Fragment>
    );
};

export default DailyTransactionReport;
