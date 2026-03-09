import { useState } from "react"
import { Button } from "react-bootstrap"
import EmployeesWindow from "./EmployeesWindow"
import UploadUsersFromExcel from "./UploadUsersFromExcel"

const ButtonPage = () => {

    const [showWindow,setShowWindow] = useState(false)

    const [showExcelUpload, setShowExcelUpload] = useState(false)
 return (
   <>
     <Button onClick={()=>setShowWindow(true)}>
        Open Employees Window
     </Button>

     <EmployeesWindow
        show={showWindow}
        handleClose={()=>setShowWindow(false)}
     />
     <Button onClick={() => setShowExcelUpload(true)}>
        Upload Excel Users
      </Button>

      <UploadUsersFromExcel
        show={showExcelUpload}
        handleClose={() => setShowExcelUpload(false)}
      />
   </>
 )
}

export default ButtonPage


