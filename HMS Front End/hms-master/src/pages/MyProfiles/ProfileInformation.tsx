import React from "react";
import { Row, Col, Card, CardHeader, Table, CardBody } from "reactstrap";

const AddressDetails = (props:any) => {
  const data = props.data;
  
  const addressInfo = [
    { label: "Current Address", value: data.currentAddress || 'NA' },
    { label: "Permanent Address", value: data.permanentAddress || 'NA' },
  ];

  return (
    <Card>
      <CardHeader className="border-0">
        <h4>Address Details</h4>
      </CardHeader>
      <div className="card-body pt-0">
        <Table className="no-odd-row-bg">
          <tbody>
            {addressInfo.map((item, index) => (
              <tr key={index}>
                <td>{item.label}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

const BankDetails = (props:any) => {
  const data = props.data;
  
  const bankInfo = [
    { label: "Account Title", value: data.accountTitle || 'NA' },
    { label: "Bank Name", value: data.bankName || 'NA' },
    { label: "Bank Branch Name", value: data.bankBranchName || 'NA' },
    { label: "Bank Account Number", value: data.bankAccountNo || 'NA' },
    { label: "IFSC Code", value: data.ifscCode || 'NA' },
  ];

  return (
    <Card>
      <CardHeader className="border-0">
        <h4>Bank Account Details</h4>
      </CardHeader>
      <div className="card-body pt-0">
        <Table className="no-odd-row-bg">
          <tbody>
            {bankInfo.map((item, index) => (
              <tr key={index}>
                <td>{item.label}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

const SocialMediaLinks = (props:any) => {
  const data = props.data;

  const socialMediaInfo = [
    { label: "Facebook URL", value: data.facebookUrl || 'NA' },
    { label: "Twitter URL", value: data.twitterUrl || 'NA' },
    { label: "Linkedin URL", value: data.linkedinUrl || 'NA' },
    { label: "Instagram URL", value: data.instagramUrl || 'NA' },
  ];

  return (
    <Card>
      <CardHeader className="border-0">
        <h4>Social Media Links</h4>
      </CardHeader>
      <div className="card-body pt-0">
        <Table className="no-odd-row-bg">
          <tbody>
            {socialMediaInfo.map((item, index) => (
              <tr key={index}>
                <td>{item.label}</td>
                <td><a href={item.value} target="blank">{item.value} </a></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};
const PersonalInformation = (props:any) => {
  const data = props.data;
  const personalInfo = [
    { label: "Phone", value: data.phone || 'NA' },
    // { label: "Emergency Contact Number", value: data.emergencyContactNumber || 'NA' },
    { label: "Email", value: data.email || 'NA' },
    { label: "Gender", value: data.gender || 'NA' },
    { label: "Blood Group", value: data.bloodGroup || 'NA' },
    { label: "Date Of Birth", value: data.dateOfBirth || 'NA' },
    { label: "Marital Status", value: data.maritalStatus || 'NA' },
    { label: "Husband Name", value: data.fatherName || 'NA' },
    { label: "Father/ Mother Name", value: data.motherName || 'NA' },
    { label: "Qualification", value: data.qualification || 'NA' },
    { label: "Work Experience", value: data.workExperience || 'NA' },
    { label: "Specialization", value: data.specialization || 'NA' },
    { label: "Note", value: data.note || 'NA' },
    { label: "Pan Number", value: data.panNumber || 'NA' },
    { label: "National Identification Number", value: data.nationalIdNumber || 'NA' },
    { label: "Local Identification Number", value: data.localIdNumber || 'NA' },
    { label: "Reference Contact", value: data.referenceContact || 'NA' },
  ];

  return (
    <Row className="profileInfo">
      <Col lg={12}>
        <Card>
          <CardHeader className="border-0">
            <h4>Personal Information</h4>
          </CardHeader>
          <div className="card-body pt-0">
            <Table className="no-odd-row-bg">
              <tbody>
                {personalInfo.map((item, index) => (
                  <tr key={index}>
                    <td>{item.label}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

const ProfileInformation = (props:any) => {
  return (
    <Row className="personalDetailsCont">
      <Col lg={6}>
        <PersonalInformation data={props.data} />
      </Col>
      <Col lg={6}>
        <AddressDetails data={props.data} />
        <BankDetails data={props.data} />
        <SocialMediaLinks data={props.data} />
      </Col>
    </Row>
  );
};

// const ProfileInformation = () => {
//   return (
//     <React.Fragment>
//       <Card>
//         <CardBody>
//           <Row>
//             <Col lg={6}>
//               <ProfileInformation />
//             </Col>
//             <Col lg={6}>
//               <AddressAndBankDetails />
//             </Col>
//           </Row>
//         </CardBody>
//       </Card>
//     </React.Fragment>
//   );
// };

export default ProfileInformation;
