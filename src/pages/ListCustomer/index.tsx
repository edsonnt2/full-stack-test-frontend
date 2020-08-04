import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

import './styles.css';
import Input from '../../components/Input';
import api from '../../services/api';

interface Customer {
  _id: string;
  fullName: string;
  birthday: string;
  cpf: string;
  contact: {
    email: string;
    phone: string;
  };
  formattedBirthday: string;
  formattedCpf: string;
  formattedPhone: string;
}

const RegisterAndUpdateCustomer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');

  const handleDelete = useCallback(async (id: string) => {
    try {
      await api.delete(`customers/${id}`);
      setCustomers(prevState => prevState.filter(({ _id }) => _id !== id));
    } catch (error) {
      console.log(error);
      alert('Ocorreu um erro ao delete cliente !');
    }
  }, []);

  const handleFormattedFields = useCallback(
    ({ value, field }: { value: string; field: 'phone' | 'cpf' }): string => {
      if (field === 'phone') {
        return value
          .split('')
          .map((char, index) => {
            switch (index) {
              case 0:
                return `(${char}`;
              case 1:
                return `${char}) `;
              case 6:
                return `${char}-`;
              default:
                return char;
            }
          })
          .join('');
      }

      return value
        .split('')
        .map((char, index) => {
          switch (index) {
            case 2:
              return `${char}.`;
            case 5:
              return `${char}.`;
            case 8:
              return `${char}-`;
            default:
              return char;
          }
        })
        .join('');
    },
    [],
  );

  const handleLoadingCustomer = useCallback(async () => {
    api
      .get<Customer[]>('customers')
      .then(response =>
        setCustomers(
          response.data.map(data => {
            return {
              ...data,
              formattedBirthday: format(parseISO(data.birthday), 'dd/MM/yyyy'),
              formattedPhone: handleFormattedFields({
                value: data.contact.phone,
                field: 'phone',
              }),
              formattedCpf: handleFormattedFields({
                value: data.cpf,
                field: 'cpf',
              }),
            };
          }),
        ),
      )
      .catch(error => {
        console.log(error);
        alert('Ocorreu um erro ao carregar lista de clientes !');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [handleFormattedFields]);

  const handleSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setCustomers([]);
      setLoading(true);
      if (!value) handleLoadingCustomer();
      setSearch(value);
    },
    [handleLoadingCustomer],
  );

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search) {
        try {
          const response = await api.get<Customer[]>('customers/search', {
            params: {
              search,
            },
          });

          setCustomers(
            response.data.map(data => {
              return {
                ...data,
                formattedBirthday: format(
                  parseISO(data.birthday),
                  'dd/MM/yyyy',
                ),
                formattedPhone: handleFormattedFields({
                  value: data.contact.phone,
                  field: 'phone',
                }),
                formattedCpf: handleFormattedFields({
                  value: data.cpf,
                  field: 'cpf',
                }),
              };
            }),
          );
        } catch (error) {
          console.log(error);
          alert('Ocorreu um erro ao buscar cliente !');
        } finally {
          setLoading(false);
        }
      }
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [search, handleFormattedFields]);

  useEffect(() => {
    handleLoadingCustomer();
  }, [handleLoadingCustomer]);

  return (
    <div className="ContainerList">
      <Link to="register-and-update" className="LinkNewCustomer">
        Cadastrar Novo Cliente
      </Link>
      <Input
        mask=""
        name="search"
        value={search}
        onChange={handleSearch}
        placeholder="Busque pelo cliente"
      />

      {loading && <span>loading...</span>}

      {customers.length > 0 && (
        <>
          <h1>{search ? 'Clientes Encontrados' : 'Todos os Clientes'}</h1>

          <ul className="ListCustomer">
            {customers.map(
              ({
                _id,
                fullName,
                contact: { email },
                formattedPhone,
                formattedBirthday,
                formattedCpf,
              }) => (
                <li key={_id}>
                  <div>
                    <h2>
                      {fullName} - {formattedPhone}
                    </h2>

                    <button
                      type="button"
                      className="ButtonX"
                      onClick={() => handleDelete(_id)}
                    >
                      <FiTrash2 size={22} />
                    </button>
                  </div>
                  <div>
                    <span>
                      {formattedBirthday} - {email} - {formattedCpf}
                    </span>
                    <Link
                      to={`/register-and-update/${_id}`}
                      className="LinkEdit"
                    >
                      <FiEdit size={22} />
                    </Link>
                  </div>
                </li>
              ),
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default RegisterAndUpdateCustomer;
