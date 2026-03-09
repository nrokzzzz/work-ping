import { useState } from "react"
import { Modal, Card, CardBody, Button, ButtonGroup } from "react-bootstrap"

import EmployeesWindow from "./EmployeesWindow"
import UploadUsersFromExcel from "./UploadUsersFromExcel"

const EmployeeManagerModal = ({ show, handleClose }) => {

  const [activeView, setActiveView] = useState("employees")

  return (

    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      centered
      scrollable
    >

      <Modal.Header closeButton>
        <Modal.Title>Employee Manager</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Card>

          <CardBody>

            {/* Switch Buttons */}

            <div className="d-flex justify-content-between mb-3">

              <ButtonGroup>

                <Button
                  variant={activeView === "employees" ? "primary" : "outline-primary"}
                  onClick={() => setActiveView("employees")}
                >
                  Employee List
                </Button>

                <Button
                  variant={activeView === "excel" ? "primary" : "outline-primary"}
                  onClick={() => setActiveView("excel")}
                >
                  Upload Excel
                </Button>

              </ButtonGroup>

            </div>

            {/* View Switch */}

            {activeView === "employees" && (
              <EmployeesWindow />
            )}

            {activeView === "excel" && (
              <UploadUsersFromExcel />
            )}

          </CardBody>

        </Card>

      </Modal.Body>

    </Modal>

  )
}

export default EmployeeManagerModal