import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";

import { Link } from "react-router-dom";
import LastTransactionTable from './LastTransactionTable'
import MostDisease from './MostDisease'
import PharmacySalesChart from './PharmacySalesChart'
import Widgets from "./Widgets";


const PharmacyDashboard = () => {
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <div>
            <Row>
              <Col md={6}>
                <h3 >Pharmacy</h3>
                <p className="card-title mb-4">Today - Sales Summary</p></Col>
              <Col md={6} className="text-end">
                <Link to="/main/pharmacy-datatable">
                  <button className="btn btn-primary">Pharmacy Bill</button>
                </Link>
              </Col>
              <Widgets />
            </Row>
            {/* {PharmacyData.map((item: any, key: number) => (
                    <Col xl={4} md={6} className="col" key={key}>
                      <Card className="card-animate">
                        <CardBody>
                          <div className="d-flex align-items-center">
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{item.label}</p>
                            </div>
                          </div>
                          <div className="d-flex align-items-end justify-content-between mt-4">
                            <div>
                              <h4 className="fs-20 fw-semibold ff-secondary mb-4">
                                <span className="counter-value" data-target="559.25">
                                  <CountUp
                                    start={0}
                                    prefix="₹"
                                    separator={item.separator}
                                    end={item.counter}
                                    decimals={item.decimals}
                                    duration={4}
                                  />
                                </span>
                              </h4>
                            </div>

                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))} */}


            {/* <Col lg={6}>
                <HighDemandGraph />
              </Col> */}
            <Row className="mt-4">

              <Col lg={6}>
                <MostDisease />
              </Col>

              <Col lg={6}>
                <PharmacySalesChart />
              </Col>

            </Row>
            <Row className="mt-4">
              <Col lg={12}>
                <LastTransactionTable />

              </Col>
              {/* <Col lg={6}>
                <IncomeVsProfitGraph />
              </Col> */}
            </Row>
          </div>
        </CardBody >
      </Card >
    </React.Fragment >
  );
};

export default PharmacyDashboard;
