import { Box, Paper } from "@mui/material";
import { FC } from "react";
import CompanyForm, { FormData } from "./components/company.form";
import { createCompany } from "../../services/companies/companyService";

const AddCompanies: FC = () => {
    const handleSubmit = (formData: FormData) => {
        const { name, type, nit, addresses } = formData;

        // Extracting the first address for simplicity. You may handle multiple addresses as needed.
        const { nomenclature, country, region, city } = addresses[0];

        const companyInfo = {
            name,
            type,
            description: "test",
            nit
        };

        const companyAddress = {
            nomenclature,
            city
        };

        console.log('Form Data:', formData);
        console.log('Company Info:', companyInfo);
        console.log('Company Address:', companyAddress);

        createCompany({ ...companyInfo, ...companyAddress });
    };

    return (
        <Box display="flex" gap={2} justifyContent="center">
            <CompanyForm handleSubmit={handleSubmit} />
        </Box>
    );
};

export default AddCompanies;
