import React from "react";
import TableContainer from "../../Components/Common/TableContainer"; // Adjust the path if needed
import { Row, Col, Card, CardHeader } from "reactstrap";

const primaryExamine = [
  { id: 1, label: "Bleeding", value: "NA" },
  { id: 2, label: "Pulse Rate", value: "80 bpm" },
  { id: 3, label: "Blood Pressure", value: "120/80 mmHg" },
  { id: 4, label: "Temperature", value: "98.6 °F" },
  { id: 5, label: "Respiratory Rate", value: "18 breaths/min" },
  { id: 6, label: "Skin Condition", value: "Normal" },
  { id: 7, label: "Capillary Refill Time", value: "2 seconds" },
  { id: 8, label: "Edema", value: "None" },
];

const primaryExamineColumns = [
  { header: "Label", accessorKey: "label", enableColumnFilter: false },
  { header: "Value", accessorKey: "value", enableColumnFilter: false },
];

const PrimaryExamineTable = () => {
  return (
    <Row>
      <Col lg={12} className="px-0">
        <Card id="birthReport">
          <CardHeader className="border-0">
            <h4>Primary Examine</h4>
          </CardHeader>

          <div className="card-body pt-0">
            <div>
              <TableContainer
                columns={primaryExamineColumns}
                data={primaryExamine}
                isGlobalFilter={true}
                isCustomerFilter={true}
                customPageSize={5}
                tableClass="table table-bordered"
                theadClass="thead-light"
                divClass="table-responsive"
              />
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default PrimaryExamineTable;
