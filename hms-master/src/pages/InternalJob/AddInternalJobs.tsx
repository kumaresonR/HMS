import React, { useEffect, useState } from 'react'
import FormHeader from '../../common/FormHeader/FormHeader'
import { IoArrowBack } from 'react-icons/io5'
import { Container, Card, CardBody, Button, Row, Col, FormGroup, Label, Input, Form } from 'reactstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { minimizePage } from '../../slices/pageResizer/uiSlice'

const AddInternalJobs = () => {
  let navigate: any = useNavigate();
  const dispatch = useDispatch();
  const uselocation = useLocation();

  const [jobTitle, setJobTitle] = useState('');
  const [jobTitleValidationError, setJobTitleValidationError] = useState(false);
  const [department, setDepartment] = useState('');
  const [departmentValidationError, setDepartmentValidationError] = useState(false);
  const [location, setLocation] = useState('');
  const [locationValidationError, setLocationValidationError] = useState(false);
  const [jobType, setJobType] = useState('');
  const [jobTypeValidationError, setJobTypeValidationError] = useState(false);
  const [jobId, setJobId] = useState('');
  // const [jobTitleValidationError,setJobTitleValidationError] = useState(false);
  const [postedOn, setPostedOn] = useState('');
  const [postedOnValidationError, setPostedOnValidationError] = useState(false);
  const [noOfOpenings, setNoOfOpenings] = useState('');
  const [noOfOpeningsValidationError, setNoOfOpeningsValidationError] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryValidationError, setSummaryValidationError] = useState(false);
  const [keyResponsibilities, setKeyResponsibilities] = useState('');
  const [keyResponsibilitiesValidationError, setKeyResponsibilitiesValidationError] = useState(false);
  const [requiredQualifications, setRequiredQualifications] = useState('');
  const [requiredQualificationsValidationError, setRequiredQualificationsValidationError] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [experienceLevelValidationError, setExperienceLevelValidationError] = useState(false);
  const [preferredSkills, setPreferredSkills] = useState('');
  const [preferredSkillsValidationError, setPreferredSkillsValidationError] = useState(false);
  const [applicationDeadline, setApplicationDeadline] = useState('');
  // const [jobTitleValidationError,setJobTitleValidationError] = useState(false);
  const [howToApply, setHowToApply] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [hiringManagerValidationError, setHiringManagerValidationError] = useState(false);
  const [salaryRange, setSalaryRange] = useState('');
  const [perks, setPerks] = useState('');
  const data = {
    jobTitle, department, location, jobType, jobId, postedOn, noOfOpenings,
    summary, keyResponsibilities, requiredQualifications, experienceLevel,perks,
    preferredSkills, applicationDeadline, howToApply,hiringManager,salaryRange
  }

  const handleJobTitleChange = (value: any) => {
    setJobTitle(value);
    setJobTitleValidationError(false);
  }

  const handleDepartmentChange = (value: any) => {
    setDepartment(value);
    setDepartmentValidationError(false);
  }

  const handleLocationChange = (value: any) => {
    setLocation(value);
    setLocationValidationError(false);
  }

  const handleJobTypeChange = (value: any) => {
    setJobType(value);
    setJobTypeValidationError(false);
  }

  const handlePostedOnChange = (value: any) => {
    setPostedOn(value);
    setPostedOnValidationError(false);
  }

  const handleNoOfOpeningsChange = (value: any) => {
    setNoOfOpenings(value);
    setNoOfOpeningsValidationError(false);
  }

  const handleSummaryChange = (value: any) => {
    setSummary(value);
    setSummaryValidationError(false);
  }

  const handleKeyResponsibilitiesChange = (value: any) => {
    setKeyResponsibilities(value);
    setKeyResponsibilitiesValidationError(false);
  }

  const handleQualificationsChange = (value: any) => {
    setRequiredQualifications(value);
    setRequiredQualificationsValidationError(false);
  }

  const handleExperienceLevelChange = (value: any) => {
    setExperienceLevel(value);
    setExperienceLevelValidationError(false);
  }

  const handlePreferredSkillsChange = (value: any) => {
    setPreferredSkills(value);
    setPreferredSkillsValidationError(false);
  }

  const handleHiringManagerChange = (value: any) => {
    setHiringManager(value);
    setHiringManagerValidationError(false);
  }

  const validateForm = () => {
    let isFormValid = true;

    if (!jobTitle) {
      setJobTitleValidationError(true);
      isFormValid = false;
    }

    if (!department) {
      setDepartmentValidationError(true);
      isFormValid = false;
    }

    if (!location) {
      setLocationValidationError(true);
      isFormValid = false;
    }

    if (!jobType) {
      setJobTypeValidationError(true);
      isFormValid = false;
    }

    if (!postedOn) {
      setPostedOnValidationError(true);
      isFormValid = false;
    }

    if (!noOfOpenings) {
      setNoOfOpeningsValidationError(true);
      isFormValid = false;
    }

    if (!summary) {
      setSummaryValidationError(true);
      isFormValid = false;
    }

    if (!keyResponsibilities) {
      setKeyResponsibilitiesValidationError(true);
      isFormValid = false;
    }

    if (!requiredQualifications) {
      setRequiredQualificationsValidationError(true);
      isFormValid = false;
    }

    if (!experienceLevel) {
      setExperienceLevelValidationError(true);
      isFormValid = false;
    }

    if (!preferredSkills) {
      setPreferredSkillsValidationError(true);
      isFormValid = false;
    }

    if (!hiringManager) {
      setHiringManagerValidationError(true);
      isFormValid = false;
    }

    return isFormValid;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      navigate('/main/ViewInternalJobs')
    }
  }

  useEffect(() => {
    if (uselocation?.state) {
      setJobTitle(uselocation?.state?.jobTitle);
      setDepartment(uselocation?.state?.department);
      setLocation(uselocation?.state?.location);
      setJobType(uselocation?.state?.jobType);
      setJobId(uselocation?.state?.jobId);
      setPostedOn(uselocation?.state?.postedOn);
      setNoOfOpenings(uselocation?.state?.noOfOpenings);
      setSummary(uselocation?.state?.summary);
      setKeyResponsibilities(uselocation?.state?.keyResponsibilities);
      setRequiredQualifications(uselocation?.state?.requiredQualifications);
      setExperienceLevel(uselocation?.state?.experienceLevel);
      setPerks(uselocation?.state?.perks);
      setPreferredSkills(uselocation?.state?.preferredSkills);
      setApplicationDeadline(uselocation?.state?.applicationDeadline);
      setHowToApply(uselocation?.state?.howToApply);
      setHiringManager(uselocation?.state?.hiringManager);
      setSalaryRange(uselocation?.state?.salaryRange)
    }
  }, [uselocation?.state]);

  return (
    <React.Fragment>
      <Container fluid>
        <FormHeader title="Add Jobs"
          pageTitle="Setup"
          onMinimize={() => dispatch(minimizePage({
            route: uselocation.pathname,
            pageName: "Add Jobs",
            data
          }))} />
        <Card>
          <CardBody>
            <div className='text-end'>
              <Button
                color="primary"
                onClick={() => navigate(-1)}
                className="btn btn-primary add-btn mx-2"
              >
                <IoArrowBack /> Back
              </Button>
            </div>
            <Row className="d-flex justify-content-center">
              <Col xl={12}>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="jobTitle">Job Title <span className='text-danger'> * </span></Label>
                        <Input
                          type="text"
                          id="jobTitle"
                          value={jobTitle}
                          onChange={e => handleJobTitleChange(e.target.value)}
                          invalid={!!jobTitleValidationError}
                        />
                        {jobTitleValidationError && (
                          <div className="invalid-feedback">Job Title Required</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="department">Department <span className='text-danger'> * </span></Label>
                        <Input
                          type="text"
                          id="department"
                          value={department}
                          onChange={e => handleDepartmentChange(e.target.value)}
                          invalid={!!departmentValidationError}
                        />
                        {departmentValidationError && (
                          <div className="invalid-feedback">Department Required</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="location">Location <span className='text-danger'> * </span></Label>
                        <Input
                          type="text"
                          id="location"
                          value={location}
                          onChange={e => handleLocationChange(e.target.value)}
                          invalid={!!locationValidationError}
                        />
                        {locationValidationError && (
                          <div className="invalid-feedback">Location Required</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="jobType">Job Type <span className='text-danger'> * </span></Label>
                        <Input
                          type="text"
                          id="jobType"
                          value={jobType}
                          onChange={e => handleJobTypeChange(e.target.value)}
                          invalid={!!jobTypeValidationError}
                        />
                        {jobTypeValidationError && (
                          <div className="invalid-feedback">Job Type Required</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="jobId">Job Id </Label>
                        <Input
                          type="text"
                          id="jobId"
                          value={jobId}
                          onChange={e => setJobId(e.target.value)}
                        // invalid={!!jobIdValidationError}
                        />
                        {/* {jobIdValidationError && (
                          <div className="invalid-feedback">Job Id Required</div>
                        )} */}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="postedOn">Posted On <span className='text-danger'> * </span></Label>
                        <Input
                          type="date"
                          id="postedOn"
                          value={postedOn}
                          onChange={e => handlePostedOnChange(e.target.value)}
                          invalid={!!postedOnValidationError}
                        />
                        {postedOnValidationError && (
                          <div className="invalid-feedback">Posted On Required</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="noOfOpenings">Number Of Openings <span className='text-danger'> * </span></Label>
                        <Input
                          type="text"
                          id="noOfOpenings"
                          value={noOfOpenings}
                          onChange={e => handleNoOfOpeningsChange(e.target.value)}
                          invalid={!!noOfOpeningsValidationError}
                        />
                        {noOfOpeningsValidationError && (
                          <div className="invalid-feedback">Openings Required</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <h5>Job Description</h5>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="summary">Summary <span className='text-danger'> * </span></Label>
                        <Input
                          type="textarea"
                          id="summary"
                          value={summary}
                          onChange={e => handleSummaryChange(e.target.value)}
                          invalid={!!summaryValidationError}
                        />
                        {summaryValidationError && (
                          <div className="invalid-feedback">Summary Required</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="keyResponsibilities">Key Responsibilities <span className='text-danger'> * </span></Label>
                        <Input
                          type="textarea"
                          id="keyResponsibilities"
                          value={keyResponsibilities}
                          onChange={e => handleKeyResponsibilitiesChange(e.target.value)}
                          invalid={!!keyResponsibilitiesValidationError}
                        />
                        {keyResponsibilitiesValidationError && (
                          <div className="invalid-feedback">Key Responsibilities Required</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="requiredQualifications">Required Qualifications <span className='text-danger'> * </span></Label>
                        <Input
                          type="textarea"
                          id="requiredQualifications"
                          value={requiredQualifications}
                          onChange={e => handleQualificationsChange(e.target.value)}
                          invalid={!!requiredQualificationsValidationError}
                        />
                        {requiredQualificationsValidationError && (
                          <div className="invalid-feedback">Qualifications Required</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="experienceLevel">Experience Level <span className='text-danger'> * </span></Label>
                        <Input
                          type="textarea"
                          id="experienceLevel"
                          value={experienceLevel}
                          onChange={e => handleExperienceLevelChange(e.target.value)}
                          invalid={!!experienceLevelValidationError}
                        />
                        {experienceLevelValidationError && (
                          <div className="invalid-feedback">Experience Level Required</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="preferredSkills">Preferred Skills <span className='text-danger'> * </span></Label>
                        <Input
                          type="textarea"
                          id="preferredSkills"
                          value={preferredSkills}
                          onChange={e => handlePreferredSkillsChange(e.target.value)}
                          invalid={!!preferredSkillsValidationError}
                        />
                        {preferredSkillsValidationError && (
                          <div className="invalid-feedback">Preferred Skills Required</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <h5>Application Details</h5>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="applicationDeadline">Application Deadline</Label>
                        <Input
                          type="date"
                          id="applicationDeadline"
                          value={applicationDeadline}
                          onChange={e => setApplicationDeadline(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="hiringManager">Hiring Manager <span className='text-danger'> * </span></Label>
                        <Input
                          type="text"
                          id="hiringManager"
                          value={hiringManager}
                          onChange={e => handleHiringManagerChange(e.target.value)}
                          invalid={!!hiringManagerValidationError}
                        />
                        {hiringManagerValidationError && (
                          <div className="invalid-feedback">Hiring Manager Required</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md>
                      <FormGroup>
                        <Label for="howToApply">How To Apply</Label>
                        <Input
                          type="textarea"
                          id="howToApply"
                          value={howToApply}
                          onChange={e => setHowToApply(e.target.value)}
                        />
                      </FormGroup>
                    </Col>

                  </Row>
                  <Row>
                    <h5>Employee Benefits</h5>
                    <Col>
                      <FormGroup>
                        <Label for="salaryRange">Salary Range</Label>
                        <Input
                          type="textarea"
                          id="salaryRange"
                          value={salaryRange}
                          onChange={e => setSalaryRange(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label for="perks">Perks</Label>
                        <Input
                          type="textarea"
                          id="perks"
                          value={perks}
                          onChange={e => setPerks(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className='text-center'>
                    <Button type="submit" color="primary">Submit</Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default AddInternalJobs