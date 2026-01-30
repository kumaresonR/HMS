import React from "react";

const personalData = {
    firstName: "Jenisha",
    lastName: "R",
    dateOfBirth: "2003-06-11",
    gender: "Female",
    contactNumber: "+918907658111",
    email: "jenish@gmail.com",
    country: "India",
    state: "Tamil Nadu",
    address: "Nagercoil",
    pincode: "847919",
    bloodType: "B+",
    allergies: "Skin Allergy",
    insurance: "National Insurance",
    nationalIdentification: "Aadhaar card",
    nationalIdentificationNumber: "629704780912",
};

const emergencyContacts = [
    { name: "Aarav", relationship: "Father", contactNumber: "8907654888" },
    { name: "Ananya", relationship: "Mother", contactNumber: "8907654708" },
];

const PatientDetails = () => {
    return (
        <div>
            <table>
                <thead className="table-light">
                    <tr>
                        <th colSpan={2}>Personal Information</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(personalData).map(([key, value], index) => (
                        <tr key={index}>
                            <td>{key.replace(/([A-Z])/g, " $1")}</td>
                            <td>{value}</td>
                        </tr>
                    ))}
                </tbody>

                <thead className="table-light">
                    <tr>
                        <th colSpan={2}>Emergency Contacts</th>
                    </tr>
                </thead>
                <tbody>
                    {emergencyContacts.map((contact, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td>Name</td>
                                <td>{contact.name}</td>
                            </tr>
                            <tr>
                                <td>Relationship</td>
                                <td>{contact.relationship}</td>
                            </tr>
                            <tr>
                                <td>Contact Number</td>
                                <td>{contact.contactNumber}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default PatientDetails;
