import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar";

import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    api.get("patients/")
      .then((res) => setPatients(res.data))
      .catch(() => logout());
  }, [logout]);

  return (
    <>
      <Navbar onLogout={logout} />

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Patients
        </Typography>

        <Grid container spacing={2}>
          {patients.map((p) => (
            <Grid item xs={12} md={4} key={p.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {p.nom} {p.prenom}
                  </Typography>
                  <Typography color="text.secondary">
                    📞 {p.telephone || "N/A"}
                  </Typography>
                  <Typography color="text.secondary">
                    ✉ {p.email || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
