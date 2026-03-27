import React from "react";
import TableContainer from "../../Components/Common/TableContainer"; // Adjust the path if needed
import { Row, Col, Card, CardHeader } from "reactstrap";

const antenatalExamine = [
  { id: 1, label: "Uterine Size", value: "45 cm" },
  { id: 2, label: "Fetal Heart Rate", value: "140 bpm" },
  { id: 3, label: "Fundal Height", value: "30 cm" },
  { id: 4, label: "Amniotic Fluid", value: "Adequate" },
  { id: 5, label: "Fetal Movement", value: "Present" },
  { id: 6, label: "Blood Pressure", value: "120/80 mmHg" },
  { id: 7, label: "Weight", value: "70 kg" },
  { id: 8, label: "Urine Protein", value: "Negative" },
];

const antenatalExamineColumns = [
  { header: "Label", accessorKey: "label", enableColumnFilter: false },
  { header: "Value", accessorKey: "value", enableColumnFilter: false },
];

const AntenatalExamineTable = () => {
  return (











    <Row>
      <Col lg={12} className="px-0">
        <Card id="birthReport">
          <CardHeader className="border-0">
            <h4>Antenatal Examine</h4>
          </CardHeader>

          <div className="card-body pt-0">
            <div>
              <TableContainer
                columns={antenatalExamineColumns}
                data={antenatalExamine}
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

export default AntenatalExamineTable;
