import {
  Col,
  Row,
  Button,
  Card,
  CardBody,
  ProgressBar
} from 'react-bootstrap'
import { useState, useRef } from 'react'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageMetaData from '@/components/PageTitle'
import { useNavigate } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import axiosClient from '@/helpers/httpClient'

import { use2FA } from '@/context/TwoFAContext'
import { useAuthContext } from '@/context/useAuthContext'
import toast from 'react-hot-toast'
const BulkUpload = () => {
  const navigate = useNavigate()

  const [file, setFile] = useState(null) // ✅ single file
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [allTasks, setAllTasks] = useState([])
  const [showTable, setShowTable] = useState(false)

  const { require2FA } = use2FA()
  const { is2FAAuthnticator } = useAuthContext()
  const fileInputRef = useRef(null)

  const formatSize = (size) => {
    if (size < 1024) return size + ' B'
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0] // ✅ only first file
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      setLoading(true)
      setUploadProgress(0)


      if (fileInputRef.current) fileInputRef.current.value = ''
      if (is2FAAuthnticator) {

        try {

          const res = await axiosClient.post(
            '/api/admin/add-employees/by-excel',
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
              onUploadProgress: (progressEvent) => {
                const percent = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                )
                setUploadProgress(percent)
              },
            }
          )
          setAllTasks(res.data?.data)
          setShowTable(true)

          setFile(null)

        } catch (error) {
          // Error handled by interceptor

        }

      } else {

        require2FA(async () => {

          try {

            const res = await axiosClient.post(
              '/api/admin/add-employees/by-excel',
              formData,
              {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                  const percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  )
                  setUploadProgress(percent)
                },
              }
            )
            setAllTasks(res.data?.data)
            setShowTable(true)

            setFile(null)

          } catch (error) {

            throw new Error(
              error?.response?.data?.message || "Failed to add Employee"
            )

          }

        })

      }

    } catch (err) {
      // Error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageMetaData title="Employees-SpreadSheet" />

      <Row>
        <Col xl={12}>
          <ComponentContainerCard
            title={
              <div className="d-flex justify-content-between align-items-center">
                <span>Add Employees Details By Excel-SpreadSheet</span>

                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() =>
                    navigate('/employees/add-employees/single-employee-form')
                  }
                >
                  <IconifyIcon icon="bx:upload" className="me-1" />
                  By-Form
                </Button>
              </div>
            }
            description="Upload an Excel or CSV file containing employee details."
          >
            {/* Hidden File Input */}
            <input
              type="file"
              accept=".csv,.xlsx"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* Drop Box */}
            <div
              className="border border-2 border-dashed rounded p-5 text-center bg-light"
              style={{ cursor: 'pointer' }}
              onClick={() => fileInputRef.current.click()}
            >
              <h5 className="fw-semibold mb-2">
                Click to Select File
              </h5>
              <p className="text-muted mb-1">
                Supported formats: .csv, .xlsx
              </p>
            </div>

            {/* File Preview Card */}
            {file && (
              <Card className="shadow-sm mt-3">
                <CardBody className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{file.name}</h6>
                    <small className="text-muted">
                      {formatSize(file.size)}
                    </small>
                  </div>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleRemoveFile}
                  >
                    Remove
                  </Button>
                </CardBody>
              </Card>
            )}

            {/* Upload Button */}
            <div className="text-end mt-4">
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={!file || loading}
              >
                {loading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>

            {/* Progress Bar */}
            {loading && (
              <div className="mt-3">
                <ProgressBar
                  now={uploadProgress}
                  label={`${uploadProgress}%`}
                  striped
                  animated
                />
              </div>
            )}

            {/* File Format Instructions */}
            {showTable && (
              <Col xl={12} className="mt-4">
                <Card>
                  <CardBody>
                    <h5 className="mb-2">
                      You Uploaded {allTasks?.count?.total || 0} Records,
                      {(allTasks?.count?.total || 0) - (allTasks?.count?.failed || 0)} Success,
                      {allTasks?.count?.failed || 0} Failed.
                    </h5>
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover text-nowrap">
                        <thead className="table-light">
                          <tr>
                            <th>Row</th>
                            <th>Error</th>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Organization</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allTasks?.failedRecords?.map((task, idx) => (
                            <tr key={idx}>
                              <td>{task.rowNumber || '--'}</td>
                              <td>{task.error || '--'}</td>
                              <td>{task.rowData?.['User ID'] || '--'}</td>
                              <td>{task.rowData?.['User Name'] || '--'}</td>
                              <td>{task.rowData?.['Email'] || '--'}</td>
                              <td>{task.rowData?.['Contact Number'] || '--'}</td>
                              <td>{task.rowData?.['Organization Name'] || '--'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            )}
            <div className="mt-4 p-3 border rounded bg-light">
              <h6 className="mb-2">📌 File Format Instructions</h6>
              <p className="text-muted mb-2">
                Your Excel / CSV file must contain the following columns in the same order and must maintain the same label names*:
              </p>

              <div className="table-responsive">
                <table className="table table-sm table-bordered mb-0">
                  <thead className="table-secondary">
                    <tr>
                      <th>#</th>
                      <th>Column Label</th>
                      <th>Example Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>1</td><td>employeeId</td><td>23A91A5000</td></tr>
                    <tr><td>2</td><td>name</td><td>Rahul Singh</td></tr>
                    <tr><td>3</td><td>email</td><td>example@gmail.com</td></tr>
                    <tr><td>4</td><td>organizationName</td><td>Vishnu_priya_1212's Organization</td></tr>
                    <tr><td>5</td><td>phone</td><td>3690249011</td></tr>
                    <tr><td>6</td><td>dob</td><td>28/03/2008</td></tr>
                    <tr><td>7</td><td>gender</td><td>Male / Female</td></tr>
                    <tr><td>8</td><td>workType</td><td>Remote / Onsite / Hybrid</td></tr>
                    <tr><td>9</td><td>address</td><td>Street 0, City</td></tr>
                    <tr><td>10</td><td>dateOfJoining</td><td>14/04/2025</td></tr>
                    <tr><td>11</td><td>aadhaar</td><td>478166794292</td></tr>
                    <tr><td>12</td><td>salary</td><td>50000</td></tr>
                    <tr><td>13</td><td>passport</td><td>C4047249</td></tr>
                    <tr><td>14</td><td>pan</td><td>YVQCB8999N</td></tr>
                    <tr><td>15</td><td>bankId</td><td>35788501242</td></tr>
                  </tbody>
                </table>
              </div>

              <small className="text-muted d-block mt-2">
                ⚠️ Make sure column names match exactly. Do not change spelling or order.
              </small>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}

export default BulkUpload
