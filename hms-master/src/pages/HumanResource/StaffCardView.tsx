import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, CardImg, CardTitle, CardText, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import StorageService from '../../helpers/storage/storage-service';

const StaffCardView = (props: any) => {
    const data = props.data;
    let navigate: any = useNavigate();
    const [userId, setUserId] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const cardsPerPage = 4;

    // Calculate total pages
    const totalPages = Math.ceil(data.length / cardsPerPage);

    // Get paginated staff data
    const startIndex = (currentPage - 1) * cardsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + cardsPerPage);

    const previousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const generateRandomColor = (name: any) => {
        const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const viewDetails = (id: any) => {
        navigate('/main/MyProfiles', { state: { id: id } })
    }

    useEffect(() => {
        let user = StorageService.getUserDataFromSessionStorage();
        setUserId(user.user_id);
    }, []);

    return (
        <>
            <Row className='staffCard'>
                {paginatedData.map((data: any, idx: any) => (
                    <Col key={idx} xs={12} sm={6} lg={3} className="mb-4">
                        <Card className={`text-center h-100 ${userId === data.employeeId ? "pointer" : ""}`}
                            onClick={(e) => {
                                if (userId === data.employeeId) {
                                    viewDetails(data.employeeId);
                                }
                            }}>
                            {data.photo ? (
                                <CardImg
                                    top
                                    width="100%"
                                    src={`data:image/png;base64,${data.photo}`}
                                    alt="Profile Image"
                                    onError={(e: any) => {
                                        e.target.onerror = null;
                                        e.target.src = '';
                                    }}
                                    style={{
                                        borderRadius: '50%',
                                        width: '150px',
                                        height: '150px',
                                        margin: '0 auto',
                                    }}
                                />
                            ) : (
                                <div
                                    className="avatar-xxs rounded-circle material-shadow d-flex justify-content-center align-items-center"
                                    style={{
                                        backgroundColor: generateRandomColor(data.firstName),
                                        color: 'white',
                                        width: '150px',
                                        height: '150px',
                                        margin: '0 auto',
                                        fontSize: '2.5rem',
                                    }}
                                >
                                    {data.firstName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <CardBody>
                                <CardTitle tag="h5">{data.firstName} {data.lastName}</CardTitle>
                                <CardText className="text-pink mb-1">
                                    <span className="text-pink mb-0">{data.roleDetails.roleName}</span>
                                </CardText>
                                <CardText className="badge bg-primary-subtle text-success text-primary mb-2">
                                    <b>
                                        <span className="text-primary">{data.staffId}</span>
                                    </b>
                                </CardText>
                                <CardText>{data.phone}</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
                <div className="col-sm">
                    <div className="text-muted">
                        Showing <span className="fw-semibold ms-1">{paginatedData.length}</span> of{' '}
                        <span className="fw-semibold">{data.length}</span> Results
                    </div>
                </div>
                <div className="col-sm-auto">
                    <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
                        <li className={currentPage === 1 ? 'page-item disabled' : 'page-item'}>
                            <Link to="#" className="page-link" onClick={previousPage}>
                                Previous
                            </Link>
                        </li>

                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index} className="page-item">
                                <Link
                                    to="#"
                                    className={
                                        currentPage === index + 1 ? 'page-link active' : 'page-link'
                                    }
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </Link>
                            </li>
                        ))}

                        <li className={currentPage === totalPages ? 'page-item disabled' : 'page-item'}>
                            <Link to="#" className="page-link" onClick={nextPage}>
                                Next
                            </Link>
                        </li>
                    </ul>
                </div>
            </Row>
        </>
    );
};

export default StaffCardView;
