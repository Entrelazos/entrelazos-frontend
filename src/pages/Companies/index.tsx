import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import companyService from '../../services/companies/companyService';
import { fetchApiData } from '../../store/api/thunks';
import { AppDispatch } from '../../store/store';
import { CompanyApiResponse } from '../../types/api/ApiTypes';

interface RootState {
  api: {
    data: CompanyApiResponse | null;
    loading: boolean;
    error: string | null;
  };
}

const CompaniesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.api);

  useEffect(() => {
    const fetchData = async () => {
      // Dispatch the async thunk without awaiting it directly
      dispatch(fetchApiData({ apiService: companyService, method: 'GET', data: "test" }));
    };
    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }

    if (data) {
      return (
        <div>
          {/* Display the fetched data here */}
          <ul>
            {data?.items.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  };

  return <div>{renderContent()}</div>;
};

export default CompaniesPage;
