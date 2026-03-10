import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Button, Form } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import MaskedInput from 'react-text-mask-legacy'
import axiosClient from '@/helpers/httpClient'
import axios from 'axios'

import { use2FA } from '@/context/TwoFAContext'
import { useAuthContext } from '@/context/useAuthContext'

const schema = yup.object({
  organizationName: yup.string().required('Organization Name is required'),
  organizationType: yup.string().required('Organization Type is required'),
  casualLeaves: yup
    .number()
    .typeError('Casual Leaves must be a number')
    .min(0, 'Minimum 0')
    .max(15, 'Maximum 15')
    .required('Casual Leaves is required'),
  ipAddress: yup
    .string()
    .matches(
      /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
      'Invalid IP Address'
    )
    .required('IP Address is required'),
})

const OrganizationDetailsForm = () => {

  const navigate = useNavigate()

  const [geoCoords, setGeoCoords] = useState([])

  const { organizationId } = useParams()

  const { require2FA } = use2FA()
  const { is2FAAuthnticator } = useAuthContext()

  console.log('Organization ID from URL:', organizationId)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    shouldFocusError: false,
  })

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      try {

        const res = await axiosClient.get(
          `/api/admin/organization/get-organization-by-id/${organizationId}`
        )

        const data = res.data

        reset({
          organizationName: data?.name || '',
          organizationType: data?.type || '',
          casualLeaves: data?.clDays || '',
          ipAddress: data?.IPWhitelist?.[0] || '',
          description: data?.description || '',
        })

      } catch (error) {

        console.error('Error fetching organization details:', error)

      }
    }

    if (organizationId) {
      fetchOrganizationDetails()
    }

  }, [organizationId, reset])


  const onSubmit = async (data) => {

    const newData = {
      _id: organizationId,
      name: data.organizationName,
      type: data.organizationType,
      clDays: Number(data.casualLeaves),
      description: data.description,
      IPWhitelist: [data.ipAddress],
    }

    console.log('Organization Update Payload:', newData)

    if (is2FAAuthnticator) {

      try {

        const response = await axiosClient.post(
          '/api/admin/organization/update-organization',
          newData
        )

        console.log('Update Response:', response.data)

        if (response?.data) {
          navigate('/organization/update-view-organization')
        }

      } catch (error) {

        console.error('Error updating organization:', error)

      }

    } else {

      require2FA(async () => {

        try {

          const response = await axiosClient.post(
            '/api/admin/organization/update-organization',
            newData
          )

          console.log('Update Response:', response.data)

          if (response?.data) {
            navigate('/organization/update-view-organization')
          }

        } catch (error) {

          throw new Error(
            error?.response?.data?.message || "Failed to update organization"
          )

        }

      })

    }

  }

  return (
    <ComponentContainerCard id="basic" title="Organization Details">
      <Form onSubmit={handleSubmit(onSubmit)}>
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
              Organization IP Address <span className="text-danger">*</span>
            </Form.Label>
            <Controller
              name="ipAddress"
              control={control}
              render={({ field }) => (
                <MaskedInput
                  {...field}
                  mask={[
                    /\d/, /\d/, /\d/, '.',
                    /\d/, /\d/, /\d/, '.',
                    /\d/, /\d/, /\d/, '.',
                    /\d/, /\d/, /\d/,
                  ]}
                  className="form-control"
                  placeholder="___.___.___.___"
                />
              )}
            />
            <small className="text-danger">{errors.ipAddress?.message}</small>
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
  )
}

export default OrganizationDetailsForm