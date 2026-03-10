import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
} from 'react-bootstrap'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import countryCodes from 'country-calling-code'
import FaceEmbeddings from './FaceEmbeddings'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import axiosClient from '@/helpers/httpClient'

const schema = yup.object({
  userId: yup.string().required('User Id is required'),
  userName: yup.string().required('User Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),

  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .required('Phone is required'),

  dob: yup.string().required('Date of Birth is required'),
  gender: yup.string().required('Gender is required'),
  doj: yup.string().required('Date of Joining is required'),
  role: yup.string().required('Role is required'),

  aadhaar: yup
    .string()
    .matches(/^[0-9]{12}$/, 'Aadhaar must be 12 digits')
    .required('Aadhaar is required'),

  pan: yup
    .string()
    .nullable()
    .transform(v => (v === '' ? null : v))
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),

  organizationName: yup.string().required('organizationName is required'),
  teamName: yup.string().required('teamName is required'),
  address: yup.string().required('Address is required'),
})

const AddEmployee = () => {
  const navigate = useNavigate()
  const [organizations, setOrganizations] = useState([])
  const [orgSearch, setOrgSearch] = useState('')
  const [selectedOrg, setSelectedOrg] = useState('')
  const [step, setStep] = useState(0)
  const [countryCode, setCountryCode] = useState('+91')
  const [search, setSearch] = useState('')
  const [faceEmbedding, setFaceEmbedding] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const goNext = handleSubmit(() => {
    setStep(1)
    console.log(step)
  })

  const submitForm = async () => {
  const v = getValues()

  const data = {
    userName: v.userName,
    email: v.email,
    phone: v.phone,
    userId: v.userId,
    organizationName: v.organizationName,
    teamName: v.teamName,
    doj: v.doj,
    role: v.role,

    gender: v.gender,
    salary: v.salary,
    dob: v.dob,
    address: v.address,
    isActive: true,

    aadhaar: v.aadhaar,
    pan: v.pan,
    passport: v.passport,
    bankId: v.bankId
  }

  try {
    console.log("Submitting Employee Data:", data)

    const res = await axiosClient.post(
      "/api/admin/add-employees/by-form",
      data
    )

    console.log("Employee added:", res.data)
  } catch (error) {
    console.error("Error adding employee:", error)
  }
}
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await axiosClient.get(
          '/api/admin/get-all-employees/get-organization-info'
        )

        const formatted = Object.entries(res.data || {}).map(([name, obj]) => ({
          name,
          organizationId: obj.organizationId
        }))

        setOrganizations(formatted)

      } catch (error) {
        console.log(error)
      }
    }

    fetchOrganizations()
  }, [])
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {step === 0 && (
        <ComponentContainerCard
          title={
            <div className="d-flex justify-content-between align-items-center">
              <span>Add Basic Employee Details</span>

              <Button
                variant="outline-primary"
                size="sm"
                onClick={() =>
                  navigate('/employees/add-employees/bulk-upload')
                }
              >
                <IconifyIcon icon="bx:upload" className="me-1" />
                Spread-Sheet
              </Button>
            </div>
          }
        >
          <Form className="row g-3">

            <div className="col-md-4">
              <Form.Label>User-Id <span className="text-danger">*</span></Form.Label>
              <Form.Control placeholder="Enter User Id" {...register('userId')} />
              <small className="text-danger">{errors.userId?.message}</small>
            </div>

            <div className="col-md-4">
              <Form.Label>User-Name <span className="text-danger">*</span></Form.Label>
              <Form.Control placeholder="Enter Full Name" {...register('userName')} />
              <small className="text-danger">{errors.userName?.message}</small>
            </div>

            <div className="col-md-4">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control placeholder="Enter Email" {...register('email')} />
              <small className="text-danger">{errors.email?.message}</small>
            </div>

            <div className="col-md-4">
              <Form.Label>
                Organization Name <span className="text-danger">*</span>
              </Form.Label>

              <Dropdown className="w-100">

                <Dropdown.Toggle
                  as="div"
                  className="form-control d-flex justify-content-between align-items-center arrow-none"
                  style={{ cursor: "pointer" }}
                >
                  <span>{selectedOrg || "Select Organization"}</span>
                  <IconifyIcon icon="bx:chevron-down" className="fs-4" />
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="w-100 p-2"
                  style={{
                    maxHeight: '220px',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                  }}
                >

                  <Form.Control
                    placeholder="Search organization"
                    className="mb-2"
                    value={orgSearch}
                    onChange={(e) => setOrgSearch(e.target.value)}
                  />

                  {organizations
                    .filter(o =>
                      o.name.toLowerCase().includes(orgSearch.toLowerCase())
                    )
                    .map((o) => (
                      <Dropdown.Item
                        key={o.organizationId}
                        onClick={() => {
                          setSelectedOrg(o.name)
                          setValue('organizationName', o.name)
                          setOrgSearch('')
                        }}
                      >
                        {o.name}
                      </Dropdown.Item>
                    ))}

                </Dropdown.Menu>

              </Dropdown>

              <input type="hidden" {...register('organizationName')} />

              <small className="text-danger">
                {errors.organizationName?.message}
              </small>
            </div>

            <div className="col-md-4">
              <Form.Label>Team Name <span className="text-danger">*</span></Form.Label>
              <Form.Control placeholder="Enter Team Name" {...register('teamName')} />
              <small className="text-danger">{errors.teamName?.message}</small>
            </div>

            <div className="col-md-4">
              <Form.Label>Contact-Number <span className="text-danger">*</span></Form.Label>
              <div className="d-flex gap-2">
                <Dropdown>
                  <DropdownToggle
                    className="btn btn-light border arrow-none"
                    style={{ minWidth: 90 }}
                  >
                    {countryCode}
                    <IconifyIcon icon="bx:chevron-down" className="ms-2" />
                  </DropdownToggle>

                  <DropdownMenu style={{ maxHeight: 200, overflowY: 'auto' }}>
                    <Form.Control
                      placeholder="Search country"
                      className="m-2"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    {countryCodes
                      .filter(c =>
                        c.country.toLowerCase().includes(search.toLowerCase())
                      )
                      .map(c => (
                        <DropdownItem
                          key={c.isoCode2}
                          onClick={() => {
                            setCountryCode('+' + c.countryCodes[0])
                            setSearch('')
                          }}
                        >
                          {c.country} (+{c.countryCodes[0]})
                        </DropdownItem>
                      ))}
                  </DropdownMenu>
                </Dropdown>

                <Form.Control
                  placeholder="10-digit phone number"
                  {...register('phone')}
                />
              </div>
              <small className="text-danger">{errors.phone?.message}</small>
            </div>

            <div className="col-md-4">
              <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
              <Form.Control type="date" {...register('dob')} />
              <small className="text-danger">{errors.dob?.message}</small>
            </div>

            <div className="col-md-4">
              <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
              <Form.Select {...register('gender')}>
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Form.Select>
              <small className="text-danger">{errors.gender?.message}</small>
            </div>

            <div className="col-md-4">
              <Form.Label>Date of Joining <span className="text-danger">*</span></Form.Label>
              <Form.Control type="date" {...register('doj')} />
              <small className="text-danger">{errors.doj?.message}</small>
            </div>

            <div className="col-12">
              <div className="row">

                <div className="col-md-4 d-flex flex-column gap-3">

                  <div>
                    <Form.Label>Role <span className="text-danger">*</span></Form.Label>
                    <Form.Select {...register('role')}>
                      <option value="">Select Role</option>
                      <option value="manager">Manager</option>
                      <option value="teamLead">Team Lead</option>
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                      <optoin value="user">User</optoin>
                    </Form.Select>
                    <small className="text-danger">{errors.role?.message}</small>
                  </div>

                  <div>
                    <Form.Label>Aadhaar <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      placeholder="12-digit Aadhaar number"
                      {...register('aadhaar')}
                    />
                    <small className="text-danger">{errors.aadhaar?.message}</small>
                  </div>

                </div>

                <div className="col-md-8">
                  <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    {...register('address')}
                  />
                  <small className="text-danger">{errors.address?.message}</small>
                </div>

              </div>
            </div>

            <div className="col-md-4">
              <Form.Label>Passport <small className="text-muted">(Optional)</small></Form.Label>
              <Form.Control placeholder="Enter passport number" {...register('passport')} />
            </div>

            <div className="col-md-4">
              <Form.Label>PAN <small className="text-muted">(Optional)</small></Form.Label>
              <Form.Control
                placeholder="ABCDE1234F"
                {...register('pan')}
              />
              <small className="text-danger">{errors.pan?.message}</small>
            </div>

            <div className="col-md-4">
              <Form.Label>Bank-Id <small className="text-muted">(Optional)</small></Form.Label>
              <Form.Control placeholder="Enter bank account number" {...register('bankId')} />
            </div>

            <div className="col-12 d-flex justify-content-end mt-3">
              <Button onClick={goNext}>Next</Button>
            </div>

          </Form>
        </ComponentContainerCard>
      )}

      {step === 1 && (
        <>
          <FaceEmbeddings onCapture={d => setFaceEmbedding(d)} />
          <div className="d-flex justify-content-between mt-3">
            <Button onClick={() => setStep(0)}>Previous</Button>
            <Button variant="success" onClick={submitForm}>
              Submit
            </Button>
          </div>
        </>
      )}
    </>
  )
}

export default AddEmployee