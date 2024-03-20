import { Box, Paper } from "@mui/material";
import { FC } from "react";
import CompanyForm, { FormData } from "../components/company.form";
import { createCompany } from "../../../services/companies/companyService";

const AddCompanies: FC = () => {
    const handleSubmit = (formData: FormData) => {
        createCompany(formData);
    };

    return (
        <Box display="flex" gap={2} justifyContent="center">
            <CompanyForm handleSubmit={handleSubmit} />
        </Box>
    );
};

export default AddCompanies;
