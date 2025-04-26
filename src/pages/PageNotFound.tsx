import { Button, Typography, Container, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const PageNotFound = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleGoHome = () => {
    if (id) {
      navigate(`/user/${id}/dashboard`);
    } else {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <Container
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        padding: 2,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
      </Box>
      <Typography variant="h3" component="h1" gutterBottom>
        404 - Page not found
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        It seems you got lost, try going back to the overview page.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoHome}>
        Back to Overview
      </Button>
    </Container>
  );
};
