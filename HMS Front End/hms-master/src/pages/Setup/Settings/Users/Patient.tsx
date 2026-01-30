import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
    Input,
} from "reactstrap";
import TableContainer from "../../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
 

// Define a type for the user data
interface UserData {
    patientId: number;
    name: string;
    username: string;
    mobileNumber: string;
    action: string;
}

const Patient = () => {
    // Dummy user data
    const userData: UserData[] = [
        { patientId: 1, name: 'John Doe', username: 'johndoe', mobileNumber: '123-456-7890', action: 'Edit' },
        { patientId: 2, name: 'Jane Smith', username: 'janesmith', mobileNumber: '098-765-4321', action: 'Edit' },
        { patientId: 3, name: 'Sam Wilson', username: 'samwilson', mobileNumber: '456-789-0123', action: 'Edit' },
        { patientId: 4, name: 'Emily Johnson', username: 'emilyj', mobileNumber: '321-654-9870', action: 'Edit' },
        { patientId: 5, name: 'Michael Brown', username: 'mikeb', mobileNumber: '234-567-8901', action: 'Edit' },
        { patientId: 6, name: 'Sarah Davis', username: 'sarahd', mobileNumber: '567-890-1234', action: 'Edit' },
        { patientId: 7, name: 'David Wilson', username: 'davidw', mobileNumber: '678-901-2345', action: 'Edit' },
        { patientId: 8, name: 'Jessica Lee', username: 'jessical', mobileNumber: '789-012-3456', action: 'Edit' },
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    // Updated user columns
    const userColumns = [
        {
            header: 'Patient Id',
            accessorKey: 'patientId',
            enableColumnFilter: false,
        },
        {
            header: 'Name',
            accessorKey: 'name',
            enableColumnFilter: false,
        },
        {
            header: 'Username',
            accessorKey: 'username',
            enableColumnFilter: false,
        },
        {
            header: 'Mobile Number',
            accessorKey: 'mobileNumber',
            enableColumnFilter: false,
        },
        {
            header: "Action",
            cell: (cell: any) => {
                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const isChecked = e.target.checked;
                    const confirmChange = window.confirm(
                        `Are you sure you want to ${isChecked ? "enable" : "disable"} this option?`
                    );
                    if (!confirmChange) {
                        e.target.checked = !isChecked; // revert the checkbox state if not confirmed
                    } else {
                        // Proceed with the update logic if confirmed
                        console.log(`Checkbox ${isChecked ? "enabled" : "disabled"}`);
                        // Place any additional logic here, such as updating the backend or state
                    }
                };
        
                return (
                    <div className="form-check form-switch form-check-right mb-2">
                        <Input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckRightDisabled"
                            defaultChecked
                            onChange={handleChange}
                        />
                    </div>
                );
            },
        }
    ];

    // Handler for delete action
    const handleDelete = (id: number) => {
        // Implement delete logic here
        console.log(`Deleted user with patient ID: ${id}`);
    };

    return (
        <React.Fragment>
            <div >
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={userData}
                />

                <Card id="users">
                    <CardHeader className="border-0">
                        <Row className="g-4 align-items-center">
                            <div className="col-sm">
                                <div>
                                    <h5 className="card-title mb-0">Patient</h5>
                                </div>
                            </div>
                            <div className="col-sm-auto">
                                <div>
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsExportCSV(true)}>
                                        <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                        Export
                                    </button>
                                </div>
                            </div>
                        </Row>
                    </CardHeader>

                    <div className="card-body pt-0">
                        <div>
                            <TableContainer
                                columns={userColumns}
                                data={userData}
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

            </div>
        </React.Fragment>
    );
};

export default Patient;
