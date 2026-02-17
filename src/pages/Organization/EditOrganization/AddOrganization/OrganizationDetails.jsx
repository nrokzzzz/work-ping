import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Button, Form } from 'react-bootstrap'
import { useState } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import MaskedInput from 'react-text-mask-legacy'
import axiosClient from '@/helpers/httpClient'
import axios from 'axios'
import GeoFencing from '@/pages/Maps/GeoFencing'
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

const EmployeeDetailsForm = () => {
  const [geoCoords, setGeoCoords] = useState([])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    shouldFocusError: false,
  })

  const onSubmit = async (data) => {
    const newData = {
  name: data.organizationName,
  type: data.organizationType,
  clDays: data.casualLeaves,
  description: data.description,
  IPWhitelist: data.ipAddress,
  coordinates: geoCoords
}
//https://ubiquitous-space-memory-pjg5v97ppq7p3r5p6-5000.app.github.dev/

    console.log('Organization Details Submitted:', newData)

    try {
      const response = await axiosClient.post('/api/admin/organization/add-organization', newData,{
        withCredentials: true
      })
      console.log('Response:', response.data)
    } catch (error) {
      console.error('Error submitting organization details:', error)
    }
  }

  return (
    <ComponentContainerCard id="basic" title="Organization Details">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">

         
          <div className="col-md-4 mb-3">
            <Form.Label>Organization Name*</Form.Label>
            <Form.Control placeholder="Enter Organization Name" {...register('organizationName')} />
            <small className="text-danger">{errors.organizationName?.message}</small>
          </div>

         
          <div className="col-md-4 mb-3">
            <Form.Label>Organization Type*</Form.Label>
            <Form.Control placeholder="Enter Organization Type" {...register('organizationType')} />
            <small className="text-danger">{errors.organizationType?.message}</small>
          </div>

          
          <div className="col-md-4 mb-3">
            <Form.Label>Casual Leaves*</Form.Label>
            <Form.Control placeholder="Enter Casual Leaves" type="number" {...register('casualLeaves')} />
            <small className="text-danger">{errors.casualLeaves?.message}</small>
          </div>

          
          <div className="col-md-4 mb-3">
            <Form.Label>Organization IP Address*</Form.Label>
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
                    /\d/, /\d/, /\d/
                  ]}
                  className="form-control"
                  placeholder="___.___.___.___"
                />
              )}
            />
            <small className="text-danger">{errors.ipAddress?.message}</small>
          </div>
         
         
       

         
          
  
          <div className="col-12 mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={4} {...register('description')} />
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

export default EmployeeDetailsForm; 