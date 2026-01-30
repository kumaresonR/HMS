import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Row } from 'reactstrap';
import { timeDurationData } from '../../../common/data/FakeData';
import TableContainer from '../../../Components/Common/TableContainer';
import moment from 'moment';
import { toast } from 'react-toastify';
import ReportApiService from '../../../helpers/services/report/report-api-service';

const ProfitAndLoss = () => {
  const reportApiService: ReportApiService = new ReportApiService();

  const [incomeReportData, setIncomeReportData] = useState([]);
  const [timeDuration, setTimeDuration] = useState('');
  const [timeDurationValidationError, setTimeDurationValidationError] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const totalIncome = incomeReportData.reduce((sum: any, data: any) => sum + (data.totalIncome || 0), 0);
  const totalExpense = incomeReportData.reduce((sum: any, data: any) => sum + (data.totalExpense || 0), 0);
  const totalProfitOrLoss = incomeReportData.reduce((sum: any, data: any) => sum + (data.profitOrLoss || 0), 0);
  const isLoss = totalProfitOrLoss < 0;

  // Calculate totalProfit only for positive values
  const totalProfit = incomeReportData.reduce((sum: number, data: any) => {
    return sum + (data.profitOrLoss > 0 ? data.profitOrLoss : 0);
  }, 0);

  // Calculate totalLoss only for negative values, convert them to positive for display
  const totalLoss = incomeReportData.reduce((sum: number, data: any) => {
    return sum + (data.profitOrLoss < 0 ? Math.abs(data.profitOrLoss) : 0);
  }, 0);

  const incomeReportColumns = [
    // {
    //   header: 'Module Name',
    //   accessorKey: 'moduleName',
    //   enableColumnFilter: false,
    // },
    {
      header: 'Date',
      accessorKey: 'date',
      enableColumnFilter: false,
      cell: (info: any) => (
        <div>
          <span>
            {info.getValue() ? moment(info.getValue()).format('DD/MM/YYYY, h:mm A') : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      header: 'Income',
      accessorKey: 'totalIncome',
      enableColumnFilter: false,
    },
    {
      header: 'Expense',
      accessorKey: 'totalExpense',
      enableColumnFilter: false,
    },
    {
      header: 'Profit / Loss',
      accessorKey: 'profitOrLoss',
      enableColumnFilter: false,
    },
  ]

  const getAllPatientData = async () => {
    try {
      if (!timeDuration) {
        setTimeDurationValidationError(true);
        return [];
      } else {
        setTimeDurationValidationError(false);
      }
      if (timeDuration === "Period" && (!startDate || !endDate)) {
        toast.warning("Start Date and End Date are required for Period", { containerId: 'TR' });
        return [];
      }
      const params = new URLSearchParams();

      if (timeDuration && timeDuration !== "Period") {
        params.append("timeDuration", timeDuration);
      }

      if (timeDuration === "Period") {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }

      const url = `search?${params.toString()}`;
      let result = await reportApiService.getAllProfitLossReport(url);
      setIncomeReportData(result.data);
      return result.data || [];
    } catch (error: any) {
      toast.error(error.message, { containerId: 'TR' });
      return [];
    }
  }

  const exportData = async () => {
    try {
      if (!timeDuration) {
        setTimeDurationValidationError(true);
        return [];
      } else {
        setTimeDurationValidationError(false);
      }

      if (timeDuration === "Period" && (!startDate || !endDate)) {
        toast.warning("Start Date and End Date are required for Period", { containerId: 'TR' });
        return [];
      }

      const params = new URLSearchParams();
      if (timeDuration && timeDuration !== "Period") {
        params.append("timeDuration", timeDuration);
      }
      if (timeDuration === "Period") {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }

      const url = `?${params.toString()}`;
      const result = await reportApiService.exportProfitLossReport(url); // should return a Blob

      // Create object URL from the blob
      const blob = new Blob([result], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const objectURL = URL.createObjectURL(blob);

      // Create a temporary <a> element and trigger download
      const link = document.createElement('a');
      link.href = objectURL;
      link.download = 'ProfitAndLossReport.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to free up memory
      URL.revokeObjectURL(objectURL);

      return result;
    } catch (error: any) {
      toast.error(error.message, { containerId: 'TR' });
      return [];
    }
  };


  return (
    <React.Fragment>
      <div>
        <div>
          <h5 className="card-title mb-4">Profit&Loss Report</h5>
        </div>
        <Row>
          <Col lg={4}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="time-duration-input">
                Time Duration <span className='text-danger'> * </span>
              </Label>
              <Input
                type="select"
                className="form-control"
                id="pathology-duration-input"
                value={timeDuration}
                onChange={e => setTimeDuration(e.target.value)}
                invalid={!!timeDurationValidationError}
              >
                <option value=''>Select Duration</option>
                {timeDurationData.map((data, idx) => (
                  <option key={idx} value={data.code}>{data.duration}</option>
                ))}
              </Input>
              {timeDurationValidationError && <div className="invalid-feedback">Time Duration Required.</div>}
            </div>
          </Col>

          {timeDuration === 'Period' && (
            <>
              <Col lg={4}>
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="DateFrom"
                  >
                    Date From
                  </Label>
                  <Input
                    type="date"
                    className="form-control"
                    id="DateFrom"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </Col>
              <Col lg={4}>
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="DateTo"
                  >
                    Date To
                  </Label>
                  <Input
                    type="date"
                    className="form-control"
                    id="DateTo"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </Col>
            </>
          )}
        </Row>
        <Row>
          <Col lg={12} className="px-0">
            <Card id="incomeReport">
              <CardHeader className="border-0">
                <Row className="g-4">
                  <div className="text-end">
                    <div>
                      <button type="button" onClick={getAllPatientData}
                        className="btn btn-primary">
                        Search
                      </button>
                    </div>
                  </div>
                  {incomeReportData?.length > 0 && (
                    <div className="col-sm-12">
                      <div className="p-2 border row">
                        <h5 className="text-danger mb-3">Total Summary</h5>
                        <div className="col-sm-6">
                          <p><strong>Total Income (₹):</strong> {totalIncome}</p>
                          <p><strong>Total Expense (₹):</strong> {totalExpense}</p>
                        </div>
                        <div className="col-sm-6">
                          <p>
                            <strong>{isLoss ? 'Loss (₹):' : 'Profit (₹):'}</strong>
                            <span className={isLoss ? 'text-danger' : 'text-success'}>
                              {' '}{totalProfitOrLoss.toLocaleString()}
                            </span>
                          </p>
                          {/* <p><strong>Total Profit:</strong> <span className='text-success'>{totalProfit}</span></p>
                          <p><strong>Total Loss:</strong> <span className='text-danger'>{totalLoss}</span></p> */}
                          {/* <div>
                            <h4>{isLoss ? 'Loss' : 'Profit'}</h4>
                            <p style={{ color: isLoss ? 'red' : 'green' }}>
                              {totalProfitOrLoss.toLocaleString()}
                            </p>
                          </div> */}

                        </div>
                      </div>
                    </div>
                  )}
                </Row>
              </CardHeader>

              <div className="card-body pt-0">
                {incomeReportData?.length > 0 && (
                  <div className='text-end py-3'>
                    <button type="button" className="btn btn-success" onClick={() => exportData()}>
                      <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                      Export
                    </button>
                  </div>
                )}
                <div>
                  <TableContainer
                    columns={incomeReportColumns}
                    data={incomeReportData}
                    isGlobalFilter={false}
                    isCustomerFilter={false}
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
      </div>
    </React.Fragment>
  );
};

export default ProfitAndLoss