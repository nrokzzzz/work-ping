import { Card, CardBody, CardHeader, CardTitle, Button } from 'react-bootstrap';
import { withSwal } from 'react-sweetalert2';
import './UserInfo.css';
import avatar9 from '@/assets/images/users/avatar-9.jpg';

const UserInfo = ({ swal, onCancel }) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    swal
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'No, cancel!',
        confirmButtonText: 'Yes, delete it!',
         reverseButtons: true, 
        customClass: {
          cancelButton: 'btn btn-secondary w-xs mt-2',
          confirmButton: 'btn btn-danger w-xs mt-2'
         
        },
        buttonsStyling: false
      })
      .then((result) => {
        if (result.isConfirmed) {
          swal.fire({
            title: 'Deleted!',
            text: 'Employee has been deleted successfully.',
            icon: 'success',
            customClass: {
              confirmButton: 'btn btn-danger w-xs mt-2'
            },
            buttonsStyling: false
          });
          if (onCancel) {
            onCancel();
          }

        } else if (result.dismiss === swal.DismissReason.cancel) {
          swal.fire({
            title: 'Cancelled',
            text: 'Employee is safe 🙂',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-secondary mt-2'
            },
            buttonsStyling: false
          });
        }
      });
  };

  return (
    <Card className="h-100 border-0 shadow-none">
      <CardHeader>
        <CardTitle as="h5" className="text-center mb-0">
          Personal Info
        </CardTitle>
      </CardHeader>

      <CardBody className="user-info-container">

        {/* Profile */}
        <div className="profile-section">
          <img src={avatar9} alt="Profile" className="profile-image" />
          <h6 className="profile-name">Jeannette C. Mullin</h6>
          <small className="profile-role">Full Stack Developer</small>
        </div>

        {/* Info List */}
        <div className="info-section">
          <ul className="list-group info-list">
            <li className="list-group-item info-item">
              <span className="info-label">User ID</span>
              <span className="info-value">USR-10234</span>
            </li>
            <li className="list-group-item info-item">
              <span className="info-label">Email</span>
              <span className="info-value">jeannette@rhyta.com</span>
            </li>
            <li className="list-group-item info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">+909 707-302-2110</span>
            </li>
            <li className="list-group-item info-item">
              <span className="info-label">Date of Birth</span>
              <span className="info-value">12 Aug 1993</span>
            </li>
            <li className="list-group-item info-item">
              <span className="info-label">Address</span>
              <span className="info-value">221B Baker Street, London</span>
            </li>
            <li className="list-group-item info-item">
              <span className="info-label">Gender</span>
              <span className="info-value">Female</span>
            </li>
            <li className="list-group-item info-item">
              <span className="info-label">Date of Joining</span>
              <span className="info-value">01 Jan 2015</span>
            </li>
            <li className="list-group-item info-item">
              <span className="info-label">Experience</span>
              <span className="info-value">10 Years</span>
            </li>
            <li className="list-group-item info-item">
              <span className="info-label">Aadhar</span>
              <span className="info-value">XXXX-XXXX-1234</span>
            </li>
            <li className="list-group-item info-item">
              <span className="info-label">Passport</span>
              <span className="info-value">N1234567</span>
            </li>
            <li className="list-group-item info-item">
              <span className="info-label">PAN</span>
              <span className="info-value">ABCDE1234F</span>
            </li>
            <li className="list-group-item info-item border-0">
              <span className="info-label">Bank ID</span>
              <span className="info-value">HDFC0001234</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
           <Button variant="secondary" onClick={handleCancel}>
            Cancel
        </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>

      </CardBody>
    </Card>
  );
};

export default withSwal(UserInfo);
