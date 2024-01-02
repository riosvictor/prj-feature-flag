import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    </Box>
  );
}