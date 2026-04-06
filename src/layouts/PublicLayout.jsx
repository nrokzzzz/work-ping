import { Suspense } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Preloader from '@/components/Preloader';
import { currentYear, developedBy } from '@/context/constants';

const PublicLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="white" expand="lg" className="border-bottom shadow-sm py-2">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-5 text-primary text-decoration-none">
            {developedBy}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="public-nav" />
          <Navbar.Collapse id="public-nav">
            <Nav className="ms-auto align-items-center gap-1">
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
              <Nav.Link as={Link} to="/privacy-policy">Privacy Policy</Nav.Link>
              <Nav.Link as={Link} to="/terms-and-conditions">Terms</Nav.Link>
              <Link to="/auth/sign-in" className="btn btn-primary ms-2 px-3">
                Sign In
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1 py-5 bg-light">
        <Container>
          <Suspense fallback={<Preloader />}>{children}</Suspense>
        </Container>
      </main>

      <footer className="border-top bg-white py-3 text-center text-muted small">
        <Container>
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-2">
            <Link to="/privacy-policy" className="text-muted text-decoration-none">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="text-muted text-decoration-none">Terms &amp; Conditions</Link>
            <Link to="/about" className="text-muted text-decoration-none">About</Link>
            <Link to="/contact" className="text-muted text-decoration-none">Contact</Link>
          </div>
          <div>&copy; {currentYear} {developedBy}. All rights reserved.</div>
        </Container>
      </footer>
    </div>
  );
};

export default PublicLayout;
