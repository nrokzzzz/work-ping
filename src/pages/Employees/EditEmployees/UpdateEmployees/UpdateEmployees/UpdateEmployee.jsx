import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
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

const EmployeeExample = {
  1: {
    userId: 'EMP002',
    user: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+919876543210',
    dob: '1997-08-21',
    gender: 'Male',
    doj: '2024-02-01',
    role: 'Tester',
    aadhaar: '987654321098',
    pan: 'ABCDE6789F',
    passport: 'N1234567',
    bank: '456789012345',
    address: 'Banjara Hills, Hyderabad, Telangana',
    faceEmbedding: 'c9f7a1b3e8d4f0a9c2b1...',
    faceSource: 'camera',
  },
}

const schema = yup.object({
  userId: yup.string().required(),
  user: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().matches(/^[0-9]{10}$/).required(),
  dob: yup.string().required(),
  gender: yup.string().required(),
  doj: yup.string().required(),
  role: yup.string().required(),
  aadhaar: yup.string().matches(/^[0-9]{12}$/).required(),
  pan: yup.string().nullable(),
  address: yup.string().required(),
})

const UpdateEmployee = () => {
  const { empId } = useParams()
  const empData = EmployeeExample[empId]

  const phoneWithoutCode = empData.phone.slice(-10)
  const initialCountryCode = empData.phone.slice(0, empData.phone.length - 10)

  const [step, setStep] = useState(0)
  const [countryCode, setCountryCode] = useState(initialCountryCode)
  const [search, setSearch] = useState('')
  const [faceEmbedding, setFaceEmbedding] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      userId: empData.userId,
      user: empData.user,
      email: empData.email,
      phone: phoneWithoutCode,
      dob: empData.dob,
      gender: empData.gender,
      doj: empData.doj,
      role: empData.role,
      aadhaar: empData.aadhaar,
      pan: empData.pan,
      passport: empData.passport,
      bank: empData.bank,
      address: empData.address,
    },
  })

  const goNext = handleSubmit(() => setStep(1))

  const submitForm = () => {
    const data = getValues()
    const payload = {
      ...data,
      phone: countryCode + data.phone,
      faceEmbedding: faceEmbedding?.hash,
      faceSource: faceEmbedding?.source,
    }
    console.log('UPDATED EMPLOYEE:', payload)
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {step === 0 && (
        <ComponentContainerCard title="Update Employee Details">
          <Form className="row g-3">

            <div className="col-md-4">
              <Form.Label>User Id</Form.Label>
              <Form.Control {...register('userId')} />
            </div>

            <div className="col-md-4">
              <Form.Label>User Name</Form.Label>
              <Form.Control {...register('user')} />
            </div>

            <div className="col-md-4">
              <Form.Label>Email</Form.Label>
              <Form.Control {...register('email')} />
            </div>

            <div className="col-md-4">
              <Form.Label>Contact Number</Form.Label>
              <div className="d-flex gap-2">
                <Dropdown>
                  <DropdownToggle className="btn btn-light border arrow-none" style={{ minWidth: 90 }}>
                    {countryCode}
                    <IconifyIcon icon="bx:chevron-down" className="ms-2" />
                  </DropdownToggle>
                  <DropdownMenu style={{ maxHeight: 200, overflowY: 'auto' }}>
                    <Form.Control
                      className="m-2"
                      placeholder="Search country"
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

                <Form.Control {...register('phone')} />
              </div>
            </div>

            <div className="col-md-4">
              <Form.Label>DOB</Form.Label>
              <Form.Control type="date" {...register('dob')} />
            </div>

            <div className="col-md-4">
              <Form.Label>Gender</Form.Label>
              <Form.Select {...register('gender')}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Form.Select>
            </div>

            <div className="col-md-4">
              <Form.Label>DOJ</Form.Label>
              <Form.Control type="date" {...register('doj')} />
            </div>

            <div className="col-md-4">
              <Form.Label>Role</Form.Label>
              <Form.Select {...register('role')}>
                <option>Admin</option>
                <option>Developer</option>
                <option>Tester</option>
              </Form.Select>
            </div>

            <div className="col-md-4">
              <Form.Label>Aadhaar</Form.Label>
              <Form.Control {...register('aadhaar')} />
            </div>

            <div className="col-12">
              <Form.Label>Address</Form.Label>
              <Form.Control as="textarea" rows={3} {...register('address')} />
            </div>

            <div className="col-md-4">
              <Form.Label>Passport</Form.Label>
              <Form.Control {...register('passport')} />
            </div>

            <div className="col-md-4">
              <Form.Label>PAN</Form.Label>
              <Form.Control {...register('pan')} />
            </div>

            <div className="col-md-4">
              <Form.Label>Bank</Form.Label>
              <Form.Control {...register('bank')} />
            </div>

            <div className="col-12 d-flex justify-content-end">
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
              Update
            </Button>
          </div>
        </>
      )}
    </>
  )
}

export default UpdateEmployee
