import { useState, useCallback } from 'react';
import { AddressData } from '../types/address/AddressTypes';
import { SocialType } from '../types/social/SocialTypes';

interface CompanyInfo {
  name: string;
  nit: string;
  description: string;
  categories: number[];
}

const initialSocialState: SocialType = {
  email: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  phone_number: '',
  whatsapp: '',
  x: '',
};

const initialCompanyInfo: CompanyInfo = {
  name: '',
  nit: '',
  description: '',
  categories: [],
};

interface ValidationErrors {
  name?: string;
  nit?: string;
  categories?: string;
  addresses?: string;
  social?: string;
}

export const useCompanyForm = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(initialCompanyInfo);
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [social, setSocial] = useState<SocialType>(initialSocialState);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleCompanyInfoChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCategoryChange = useCallback((event: any) => {
    const { name, value } = event.target;
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSocialChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    basePath: string
  ) => {
    const { name, value } = event.target;
    setSocial(prev => ({
      ...prev,
      [name]: `${basePath}${value}`,
    }));
  }, []);

  const handleSocialDirectChange = useCallback((name: string, value: string) => {
    setSocial(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleAddressChange = useCallback((index: number, newData: AddressData) => {
    setAddresses(prevAddresses => {
      const updatedAddresses = [...prevAddresses];
      updatedAddresses[index] = newData;
      return updatedAddresses;
    });
  }, []);

  const addAddress = useCallback(() => {
    setAddresses(prevAddresses => [
      ...prevAddresses,
      { nomenclature: '', region: '', city: '', country: '' },
    ]);
  }, []);

  const removeAddress = useCallback(() => {
    setAddresses(prevAddresses => prevAddresses.slice(0, -1));
  }, []);

  const validateForm = useCallback((): { isValid: boolean; errors: ValidationErrors } => {
    const newErrors: ValidationErrors = {};

    // Validate company name
    if (!companyInfo.name.trim()) {
      newErrors.name = 'El nombre de la empresa es requerido';
    } else if (companyInfo.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validate NIT
    if (!companyInfo.nit.trim()) {
      newErrors.nit = 'El NIT es requerido';
    } else if (!/^\d{9}-?\d?$/.test(companyInfo.nit.trim())) {
      newErrors.nit = 'El NIT debe tener un formato válido';
    }

    // Validate categories
    if (companyInfo.categories.length === 0) {
      newErrors.categories = 'Debe seleccionar al menos una categoría';
    }

    // Validate email if provided
    if (social.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(social.email)) {
      newErrors.social = 'El email debe tener un formato válido';
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  }, [companyInfo, social]);

  const resetForm = useCallback(() => {
    setCompanyInfo(initialCompanyInfo);
    setAddresses([]);
    setSocial(initialSocialState);
    setErrors({});
  }, []);

  return {
    companyInfo,
    addresses,
    social,
    errors,
    handleCompanyInfoChange,
    handleCategoryChange,
    handleSocialChange,
    handleSocialDirectChange,
    handleAddressChange,
    addAddress,
    removeAddress,
    validateForm,
    resetForm,
  };
};