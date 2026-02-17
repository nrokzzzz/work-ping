import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, Col, Row, Form, Button, InputGroup } from 'react-bootstrap'
import LogoBox from '@/components/LogoBox'
import PageMetaData from '@/components/PageTitle'
import signInImg from '@/assets/images/sign-in.svg'
import 'bootstrap-icons/font/bootstrap-icons.css'

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <>
      <PageMetaData title="Reset Password" />

      <Card className="auth-card">
        <CardBody className="p-0">
          <Row className="align-items-center g-0">
            <Col lg={6} className="d-none d-lg-inline-block border-end">
              <div className="auth-page-sidebar">
                <img src={signInImg} width={521} height={521} alt="auth" className="img-fluid" />
              </div>
            </Col>

            <Col lg={6}>
              <div className="p-4">
                <LogoBox
                  textLogo={{ height: 24, width: 73 }}
                  squareLogo={{ className: 'me-1' }}
                  containerClassName="mx-auto mb-4 text-center auth-logo"
                />

                <h2 className="fw-bold text-center fs-18">Change Password</h2>

                <Row className="justify-content-center">
                  <Col xs={12} md={8}>
                    <Form>
                      {/* New Password */}
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <InputGroup>
                          <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Enter new password" />
                          <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>

                      {/* Confirm Password */}
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <InputGroup>
                          <Form.Control type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password" />
                          <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>

                      <div className="d-grid">
                        <Button variant="primary" type="submit">
                          Update Password
                        </Button>
                      </div>
                    </Form>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <p className="text-white mb-0 text-center">
        Back to page
        <Link to="/auth/sign-in" className="text-white fw-bold ms-1">
          Sign In
        </Link>
      </p>
    </>
  )
}

export default ChangePassword
