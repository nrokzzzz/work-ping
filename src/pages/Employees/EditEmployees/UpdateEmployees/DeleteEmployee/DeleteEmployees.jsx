import * as React from 'react'
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Filter,
  Sort,
  Page
} from '@syncfusion/ej2-react-grids'

const employeeData = [
  {
    id: 1,
    name: 'John Doe',
    phoneNumber: '9876543210',
    dateOfJoining: new Date('2021-06-15'),
    organization: 'TechNova',
    dateOfBirth: new Date('1998-02-10'),
    departmentId: 'D001',
    aadhaarNumber: '1234 5678 9012',
    panNumber: 'ABCDE1234F',
    bankId: 'HDFC000123',
    passportId: 'N1234567'
  },
  {
    id: 2,
    name: 'Jane Smith',
    phoneNumber: '9123456780',
    dateOfJoining: new Date('2020-01-20'),
    organization: 'InnoSoft',
    dateOfBirth: new Date('1996-09-18'),
    departmentId: 'D002',
    aadhaarNumber: '4321 8765 2109',
    panNumber: 'PQRSX5678L',
    bankId: 'ICIC000456',
    passportId: 'M7654321'
  }
]

function EmployeeTable() {
  return (
    <div style={{ padding: '20px' }}>
      <GridComponent
        dataSource={employeeData}
        allowSorting={true}
        allowFiltering={true}
        allowPaging={true}
        pageSettings={{ pageSize: 5 }}
        filterSettings={{ type: 'Menu' }}
        height={400}
      >
        <ColumnsDirective>
          <ColumnDirective field="id" headerText="ID" width="80" textAlign="Right" />

          <ColumnDirective field="name" headerText="Name" width="180" />

          <ColumnDirective
            field="phoneNumber"
            headerText="Phone Number"
            width="150"
          />

          <ColumnDirective
            field="dateOfJoining"
            headerText="Date of Joining"
            type="date"
            format="dd-MMM-yyyy"
            width="150"
          />

          <ColumnDirective
            field="organization"
            headerText="Organization"
            width="150"
          />

          <ColumnDirective
            field="dateOfBirth"
            headerText="Date of Birth"
            type="date"
            format="dd-MMM-yyyy"
            width="150"
          />

          <ColumnDirective
            field="departmentId"
            headerText="Department ID"
            width="130"
          />

          <ColumnDirective
            field="aadhaarNumber"
            headerText="Aadhaar Number"
            width="180"
          />

          <ColumnDirective
            field="panNumber"
            headerText="PAN Number"
            width="140"
          />

          <ColumnDirective
            field="bankId"
            headerText="Bank ID"
            width="130"
          />

          <ColumnDirective
            field="passportId"
            headerText="Passport ID"
            width="130"
          />
        </ColumnsDirective>

        <Inject services={[Filter, Sort, Page]} />
      </GridComponent>
    </div>
  )
}

export default EmployeeTable
