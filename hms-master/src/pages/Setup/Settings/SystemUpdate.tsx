import React from "react";
import {
  Card,
  CardBody,
  Col,

  Row,

} from "reactstrap";

const SystemUpdate = () => {

  return (
    <React.Fragment>

      <Row className="justify-content-center">
        <Col lg={12}>
          <Card>
            <CardBody>
              <div className="text-center">
                <Row className="justify-content-center">
                  <Col lg={9}>



                    <div className="text-center">

                      <Col lg={11}>
                        <div className="mb-4">
                          <i className="bx bx-party display-4 text-success"></i>
                        </div>
                        <h4 className="mt-4 fw-semibold">Welcome to I-MEDIC-X - Version 5.0</h4>
                        <p className="text-muted mt-3">
                          You are now using the latest, most advanced version of Smart Hospital. Version 5.0 offers enhanced efficiency, seamless integration, and powerful tools to elevate your hospital management experience and improve patient care.{" "}
                        </p>

                      </Col>

                    </div>
                  </Col>
                </Row>

              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

    </React.Fragment>
  );
};

export default SystemUpdate;
