import { Row, Col, Table } from "reactstrap";

import { FaPencilAlt } from "react-icons/fa";
import { IoKey } from "react-icons/io5";
import './myProfile.css'
import { useNavigate } from "react-router-dom";

const StaffDetails = (props: any) => {
  let navigate: any = useNavigate();

  const data = props.data;

  const personalDetails = [
    { label: "Staff ID", value: data.staffId || 'NA' },
    { label: "Role", value: data.roleDetails?.roleName || 'NA' },
    { label: "Designation", value: data.designation || 'NA' },
  ];

  const jobDetails = [
    { label: "Department", value: data.departmentName || 'NA' },
    { label: "EPF No", value: data.epfNumber || 'NA' },
    { label: "Specialist", value: data.specialist || 'NA' },
    { label: "Basic Salary", value: data.basicSalary || 'NA' },
    { label: "Contract Type", value: data.contractType || 'NA' },
    { label: "Work Shift", value: data.workShift || 'NA' },
    { label: "Work Location", value: data.workLocation || 'NA' },
    { label: "Date Of Joining", value: data.dateOfJoining || 'NA' },
  ];

  const generateRandomColor = (name: string) => {
    const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];
    if (!name) return '#ccc';
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const editDetails = (id: any) => {
    navigate('/main/editEmployee', { state: { id: id } })
  }

  return (
    <div className="ProfileCardMain">
      <Row>

        <Col lg={4} className="profileCardTopLeft">

          <div className="card-body ">
            <div className="text-center mb- mt-3  profileImgCard">
              {data.photo ? (
                <img
                  src={`data:image/png;base64,${data.photo}`}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "150px", height: "150px" }}
                />
              ) : (
                <div
                  className="avatar-xxs rounded-circle material-shadow d-flex justify-content-center align-items-center"
                  style={{
                    backgroundColor: generateRandomColor(data?.firstName || ''),
                    color: 'white',
                    width: "150px", height: "150px",
                    fontSize: '2.5rem',
                  }}
                >
                  {data?.firstName ? data.firstName.charAt(0).toUpperCase() : '-'}
                </div>
              )}
              <br />
              <br />
            </div>

            <div className="no-odd-row-bg profileBtnCont">
              <Row>
                <h5 className="text-center"><b>{data?.firstName}</b></h5>
                <Col className="d-flex justify-content-center align-items-center  mb-1"
                  style={{ fontSize: '15px', color: '#9c9c9c' }}
                >
                  {/* <FaPencilAlt onClick={() => editDetails(data.employeeId)} />
                  <span className="ms-3"
                    style={{ fontSize: '20px', color: '#9c9c9c' }}
                  >
                    <IoKey />
                  </span> */}
                </Col>
              </Row>
              {personalDetails.map((item, index) => (
                <Row key={index}>
                  <Col sm={6}>
                    <div className="p-2"> <b> {item.label}</b></div>
                  </Col>
                  <Col sm={6}>
                    <div className="p-2"><b> {item.value}</b></div>
                  </Col>
                </Row>
              ))}
            </div>
          </div>

        </Col>

        <Col lg={8} className="profileCardTopRight">

          <Table className="profileDetailTable pb-0 mb-0">
            <>
              {jobDetails.reduce((rows: any[], item, index) => {
                if (index % 3 === 0) {
                  rows.push([]);
                }
                rows[rows.length - 1].push(item);
                return rows;
              }, []).map((row, rowIndex) => (
                <Row
                  key={rowIndex}
                  className={`py-2 ${rowIndex % 2 === 0 ? "custom-bg-class" : ""}`}
                  style={{
                    backgroundColor: rowIndex % 2 === 0 ? "#f2f0f9" : "transparent",
                  }}
                >
                  {row.map((item: any, colIndex: number) => (
                    <Col sm={4} key={colIndex} className="py-2">
                      <div className="p-2">{item.label}</div>
                      <div className="p-2"><b>{item.value}</b></div>
                    </Col>
                  ))}
                </Row>
              ))}
            </>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default StaffDetails;
