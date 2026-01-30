import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import { toast } from "react-toastify"
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row, Spinner } from "reactstrap"
import StorageService from "../../helpers/storage/storage-service"
import { encode } from "base-64"
import AuthApiService from "../../helpers/services/auth/auth-api-service"
import { Link, useNavigate } from "react-router-dom"
const data = [
    {
        name: "Bejancy",
        code: "doctor",
        doctorId: "HMSDOCTOR01",
        userName: "bejancy",
        password: "password",
        icon: "",
        role: "DOCTOR"
    },
    {
        name: "Aswin",
        code: "doctor",
        doctorId: "HMSDOCTOR02",
        userName: "aswin",
        password: "password",
        icon: "",
        role: "DOCTOR"
    },
    {
        name: "Raja",
        code: "doctor",
        doctorId: "HMSDOCTOR03",
        userName: "raja",
        password: "password",
        icon: "",
        role: "DOCTOR"
    }
]
const DoctorLogin = () => {
    let navigate: any = useNavigate();
    const authService: AuthApiService = new AuthApiService();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [userNameValidationError, setUserNameValidationError] = useState(false);
    const [passwordValidationError, setPasswordValidationError] = useState(false);

    const handleUserNameChange = (value: any) => {
        setUserName(value);
        setUserNameValidationError(false);
    };

    const handlePasswordChange = (value: any) => {
        setPassword(value);
        setPasswordValidationError(false);
    };

    const validateForm = () => {
        let isFormValid = true;

        if (!userName) {
            setUserNameValidationError(true);
            isFormValid = false;
        }

        if (!password) {
            setPasswordValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doLogin();
        }
    };
    const doLogin = () => {
        const user = data.find(u => u.userName === userName && u.password === password);

        if (user) {
            const encryptedUser = {
                ...user,
                userName: encode(userName),
                password: encode(password)
            };
            StorageService.saveUserData(encryptedUser);
            toast("Successfully logged in", { containerId: 'TR' });
            navigate('/main');
        } else {
            toast.error('Invalid credentials', { containerId: 'TR' });
        }
    };
    return (
        <React.Fragment>
            <div className="auth-page-wrapper pt-5">
                <div className="auth-one-bg-position auth-one-bg" id="auth-particles">

                    <div className="bg-overlay"></div>

                    <div className="shape">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 120">
                            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
                        </svg>
                    </div>
                    <div className="auth-page-content mt-lg-5">
                        <Container>
                            <Row>
                                <Col lg={12}>
                                    <div className="text-center mt-sm-5 mb-4 text-white-50">
                                        <div>
                                            <Link to="/" className="d-inline-block auth-logo">
                                                <h4>I-MEDIC-X</h4>
                                            </Link>
                                        </div>
                                        <p className="mt-3 fs-15 fw-medium">Doctor Login</p>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                <Col md={8} lg={6} xl={5}>
                                    <Card className="mt-4 card-bg-fill">
                                        <CardBody className="p-4">
                                            <div className="text-center mt-2">
                                                <h5 className="text-primary">Welcome Back !</h5>
                                                <p className="text-muted">Sign in to continue to I-MEDIC-X.</p>
                                            </div>
                                            <div className="p-2 my-4">
                                                <Form onSubmit={handleSubmit}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="userName" className="form-label">User Name</Label>
                                                        <Input
                                                            name="userName"
                                                            placeholder="Enter User Name"
                                                            type="text"
                                                            className={`form-control  ${userNameValidationError ? 'is-invalid' : ''}`}
                                                            onChange={e => handleUserNameChange(e.target.value)}
                                                        />
                                                        {userNameValidationError && <div className="invalid-feedback">User Name required.</div>}
                                                    </div>

                                                    <div className="mb-3">
                                                        <div className="float-end">
                                                            <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                                                        </div>
                                                        <Label className="form-label" htmlFor="password-input">Password</Label>
                                                        <div className="position-relative auth-pass-inputgroup mb-3">
                                                            <Input
                                                                name="password"
                                                                className={`form-control pe-5 ${passwordValidationError ? 'is-invalid' : ''}`}
                                                                type={isPasswordVisible ? "text" : "password"}
                                                                placeholder="Enter Password"
                                                                value={password}
                                                                onChange={e => handlePasswordChange(e.target.value)}
                                                            />
                                                            {passwordValidationError && <div className="invalid-feedback">Password Required.</div>}
                                                            <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon" onClick={() => setIsPasswordVisible(!isPasswordVisible)}><i className="ri-eye-fill align-middle"></i></button>
                                                        </div>
                                                    </div>

                                                    <div className="form-check">
                                                        <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                                        <Label className="form-check-label" htmlFor="auth-remember-check">Remember me</Label>
                                                    </div>

                                                    <div className="mt-4">
                                                        <Button color="success"
                                                            className="btn btn-success w-100" type="submit">
                                                            Sign In
                                                        </Button>
                                                    </div>
                                                </Form>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>

                <footer className="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center">
                                    <p className="mb-0 text-muted">&copy; {new Date().getFullYear()}. </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </React.Fragment>
    )
}

export default DoctorLogin