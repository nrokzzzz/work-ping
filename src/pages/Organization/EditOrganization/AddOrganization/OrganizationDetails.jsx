import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axiosClient from '@/helpers/httpClient'
import toast from 'react-hot-toast'

import { use2FA } from '@/context/TwoFAContext'
import { useAuthContext } from '@/context/useAuthContext'

const schema = yup.object({
  organizationName: yup.string().required('Organization Name is required'),
  organizationType: yup.string().required('Organization Type is required'),
  foundedAt: yup
    .date()
    .max(new Date(), 'Founded Date cannot be in the future')
    .required('Founded Date is required'),
  casualLeaves: yup
    .number()
    .typeError('Casual Leaves must be a number')
    .min(0, 'Minimum 0')
    .max(15, 'Maximum 15')
    .required('Casual Leaves is required'),
  ipAddress: yup
    .string()
    .required('IP Address is required')
    .matches(
      /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
      'Invalid IP Address'
    ),
})

const handleIpKeyDown = (e) => {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (allowedKeys.includes(e.key)) return
  if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return
  if (!/^[0-9.]$/.test(e.key)) {
    e.preventDefault()
  }
}

const handleIpPaste = (e) => {
  const pasted = e.clipboardData.getData('text')
  if (!/^[0-9.]+$/.test(pasted)) {
    e.preventDefault()
  }
}

const OrganizationDetailsForm = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const [geoCoords, setGeoCoords] = useState([])

  const { require2FA } = use2FA()
  const { is2FAAuthnticator } = useAuthContext()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    shouldFocusError: false,
  })

  // Restore form data passed back via location.state (after QR redirect)
  useEffect(() => {
    const formData = location.state?.formData
    if (formData) {
      // Convert date to YYYY-MM-DD for the date input
      if (formData.foundedAt) {
        const d = new Date(formData.foundedAt)
        if (!isNaN(d.getTime())) {
          formData.foundedAt = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        }
      }
      reset(formData)
    }
  }, [location.state, reset])

  const onSubmit = async (data) => {
    const d = new Date(data.foundedAt)
    const foundedAt = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
    const newData = {
      name: data.organizationName,
      type: data.organizationType,
      foundedAt: foundedAt,
      clDays: data.casualLeaves,
      description: data.description,
      IPWhitelist: data.ipAddress,
      coordinates: geoCoords,
    }

    if (is2FAAuthnticator) {
      // Pass form data along to QR page so it can send it back
      toast('Please set up Two-Factor Authentication first.', { icon: '🔐' })
      navigate('/2fa-authnticator', {
        state: {
          action: 'ORG',
          path: '/organization/organization-details',
          formData: data,
        },
      })
      return
    }

    // 2FA is set up — use verification modal and create org
    require2FA(async () => {
      try {
        await axiosClient.post(
          '/api/admin/organization/add-organization',
          newData
        )

        toast.success('Organization added successfully!')
        reset()
        navigate('/organization/view-organizations')
      } catch (error) {
        throw new Error(
          error?.response?.data?.message || 'Failed to add organization'
        )
      }
    })
  }

  return (
    <Row className="justify-content-center mt-4">

      <Col xs={12} md={10} lg={8} xl={7}>

        <ComponentContainerCard id="basic" title="Organization Details">

          <Form noValidate onSubmit={handleSubmit(onSubmit)}>

            <div className="row">

              <div className="col-md-6 mb-3">
                <Form.Label>
                  Organization Name <span className="text-danger">*</span>
                </Form.Label>

                <Form.Control
                  placeholder="Enter Organization Name"
                  {...register('organizationName')}
                />

                <small className="text-danger">
                  {errors.organizationName?.message}
                </small>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>
                  Organization Type <span className="text-danger">*</span>
                </Form.Label>

                <Form.Control
                  placeholder="Enter Organization Type"
                  {...register('organizationType')}
                />

                <small className="text-danger">
                  {errors.organizationType?.message}
                </small>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>
                  Founded At <span className="text-danger">*</span>
                </Form.Label>

                <Form.Control
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  {...register('foundedAt')}
                />

                <small className="text-danger">
                  {errors.foundedAt?.message}
                </small>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>
                  Organization IP Address <span className="text-danger">*</span>
                </Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Enter IP Address (e.g., 192.168.1.1)"
                  {...register('ipAddress')}
                  maxLength={15}
                  onKeyDown={handleIpKeyDown}
                  onPaste={handleIpPaste}
                />

                <small className="text-danger">
                  {errors.ipAddress?.message}
                </small>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>
                  Casual Leaves <span className="text-danger">*</span>
                </Form.Label>

                <Form.Control
                  type="number"
                  placeholder="Enter Casual Leaves"
                  {...register('casualLeaves')}
                />

                <small className="text-danger">
                  {errors.casualLeaves?.message}
                </small>
              </div>

              <div className="col-12 mb-3">
                <Form.Label>
                  Description <small className="text-muted">(Optional)</small>
                </Form.Label>

                <Form.Control
                  as="textarea"
                  rows={4}
                  {...register('description')}
                />
              </div>

              <div className="col-12 text-center mt-3">
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </div>

            </div>

          </Form>

        </ComponentContainerCard>

      </Col>

    </Row>
  )
}

export default OrganizationDetailsForm