import { useState } from "react";
import api from "../api/axios";
import { Container, TextField, Button, Typography } from "@mui/material";

function AddPatient() {
  const [form, setForm] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    telephone: "",
    email: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("patients/", form);
    alert("Patient ajouté");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Ajouter un patient
      </Typography>

      <form onSubmit={submit}>
        {Object.keys(form).map(key => (
          <TextField
            key={key}
            label={key}
            fullWidth
            margin="normal"
            onChange={e => setForm({ ...form, [key]: e.target.value })}
          />
        ))}
        <Button variant="contained" fullWidth type="submit">
          Enregistrer
        </Button>
      </form>
    </Container>
  );
}

export default AddPatient;
