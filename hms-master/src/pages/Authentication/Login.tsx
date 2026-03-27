import React, { useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner } from 'reactstrap';
import { Link, useNavigate } from "react-router-dom";
import logoLight from "../../assets/images/Red_medic.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import AuthApiService from '../../helpers/services/auth/auth-api-service';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from "uuid";
import ErrorHandler from '../../helpers/ErrorHandler';
import { JSEncrypt } from 'jsencrypt';

const Login = () => {
    const authService: AuthApiService = new AuthApiService();

    let navigate: any = useNavigate();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [userNameValidationError, setUserNameValidationError] = useState(false);
    const [passwordValidationError, setPasswordValidationError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
    const doLogin = async () => {
        try {
            setIsLoading(true);
            const newUUID = uuidv4();
            const payload: any = {
                uniqueId: newUUID,
            };
            const response = await authService.generatePublicKey(payload);
            if (response?.data.PublicKey) {
                const publicKey = response.data.PublicKey;
                const credentials = `${userName}:${password}`;
                const encryptor = new JSEncrypt();
                encryptor.setPublicKey(publicKey);
                const encryptedCredentials = encryptor.encrypt(credentials);

                if (!encryptedCredentials) {
                    toast.error('Encryption failed');
                    setIsLoading(false);
                    return;
                }

                const loginPayload = {
                    uniqueId: newUUID,
                    encryptedData: encryptedCredentials,
                };

                const loginResponse = await authService.doLogin(loginPayload);
                if (loginResponse?.data) {
                    sessionStorage.setItem('userData', JSON.stringify(loginResponse?.data));
                }
                 toast("Successfully logged in", { containerId: 'TR' });
                 navigate('/main');
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                toast.error('Invalid credentials', { containerId: 'TR' });
            } else {
                return ErrorHandler(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content mt-lg-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-2 text-white-50">
                                    <Link to="/" className="d-inline-block auth-logo">
                                        <img src={logoLight} alt="logo" height="70" style={{ marginRight: "80px" }} />
                                    </Link>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4 card-bg-fill">
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Welcome Back!</h5>
                                            <p className="text-muted">Sign in to continue.</p>
                                        </div>

                                        <div className="p-2 mt-4">
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
                                                    <Label htmlFor="password-input" className="form-label">Password</Label>
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
                                                    <Input type="checkbox" id="auth-remember-check" className="form-check-input" />
                                                    <Label htmlFor="auth-remember-check" className="form-check-label">Remember me</Label>
                                                </div>

                                                <div className="mt-4">
                                                    <Button
                                                        color="success"
                                                        className="w-100"
                                                        type="submit"
                                                        disabled={isLoading} 
                                                    >
                                                        {isLoading && <Spinner size="sm" className="me-2" />} 
                                                        Sign In
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>

                                {/* <div className="mt-4 text-center">
                                    <p className="mb-0">Don't have an account? <Link to="/register" className="fw-semibold text-primary text-decoration-underline">Signup</Link></p>
                                </div> */}
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default Login;
