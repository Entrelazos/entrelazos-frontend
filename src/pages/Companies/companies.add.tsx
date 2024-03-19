import { Box, Paper } from "@mui/material";
import { FC } from "react";
import CompanyForm from "./components/company.form";
import { createCompany } from "../../services/companies/companyService";

const AddCompanies: FC = () => {
    const handleSubmit = (event) => {
        const formData = new FormData(event.currentTarget);
        const formDataObject: { [key: string]: string } = {};
        for (let [key, value] of formData.entries()) {
            formDataObject[key] = value.toString();
        }

        const { name, type, nit, nomenclature, country, region, city } = formDataObject;

        const companyInfo = {
            name,
            type,
            nit
        }

        const companyAddress = {
            nomenclature,
            country,
            region,
            city
        }

        console.log('====================================');
        console.log(formDataObject);
        console.log('====================================');
        createCompany({ ...companyInfo, ...companyAddress })
        event.preventDefault();
    };
    return (
        <Box display="flex" gap={2} justifyContent="center" >
            <CompanyForm handleSubmit={handleSubmit} />
        </Box>
    )
}
export default AddCompanies;