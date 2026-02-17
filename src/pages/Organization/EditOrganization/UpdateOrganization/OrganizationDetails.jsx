import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Button, Form } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import MaskedInput from 'react-text-mask-legacy'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

const schema = yup.object({
  organizationName: yup.string().required(),
  organizationType: yup.string().required(),
  casualLeaves: yup.number().required(),
  ipAddress: yup.string().required(),
 
})

const tempOrg = {
  id: '1',
  organizationName: 'Aditya University',
  organizationType: 'Education',
  casualLeaves: 10,
  ipAddress: '192.168.001.010',
 
  description: 'Demo organization',
}

const EmployeeDetailsForm = () => {
  const { orgId } = useParams()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      organizationName: '',
      organizationType: '',
      casualLeaves: '',
      ipAddress: '',
      description: '',
    },
  })

  /* ================= DEBUG ================= */

  // console.log("Param id =",id)

  /* ================= AUTO FILL ================= */

  useEffect(() => {
    if (orgId === tempOrg.id) {
      reset(tempOrg)
    }
  }, [orgId, reset])

  /* ================= SUBMIT ================= */

  const onSubmit = (data) => {
    console.log("Submitted:", data)
  }

  /* ================= UI ================= */

  return (
    <ComponentContainerCard title="Organization Details">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">

          <div className="col-md-4 mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control placeholder="Enter Organization Name"
              {...register('organizationName')} />
          </div>

          <div className="col-md-4 mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Control placeholder="Enter Organization Type"
              {...register('organizationType')} />
          </div>

          <div className="col-md-4 mb-3">
            <Form.Label>Leaves</Form.Label>
            <Form.Control type="number"
              placeholder="Enter Casual Leaves"
              {...register('casualLeaves')} />
          </div>

          <div className="col-md-4 mb-3">
            <Form.Label>IP</Form.Label>
            <Controller
              name="ipAddress"
              control={control}
              render={({ field }) => (
                <MaskedInput
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
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
          </div>

          

          <div className="col-12 mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea"
              placeholder="Enter Description"
              {...register('description')} />
          </div>

          <div className="col-12 text-center">
            <Button type="submit">Submit</Button>
          </div>

        </div>
      </Form>
    </ComponentContainerCard>
  )
}

export default EmployeeDetailsForm
