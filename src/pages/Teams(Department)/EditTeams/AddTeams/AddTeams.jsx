import { useLocation, useNavigate } from 'react-router-dom';
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Card, CardBody, Col, Row, Button } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import TeamsForm from './TeamsForm';

const API_URL = 'http://localhost:5000/api/admin/team';

const CreateTeam = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const editTeam = state?.team || null;

  const handleSave = async (payload) => {
    try {
      if (editTeam) {
        await fetch(`${API_URL}/${editTeam._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${API_URL}/create-team`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    } catch (error) {
      console.error('SAVE TEAM ERROR 👉', error);
    }
  };

  return (
      <ComponentContainerCard id="basic" title="Add teams">
          <TeamsForm
                onSave={handleSave}
                onCancel={() => navigate('')}
                defaultValues={editTeam}
              />
      </ComponentContainerCard>

   
  );
};

export default CreateTeam;
