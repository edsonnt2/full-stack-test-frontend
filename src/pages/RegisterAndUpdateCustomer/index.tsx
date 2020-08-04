import React, {
  useCallback,
  FormEvent,
  useState,
  ChangeEvent,
  useEffect,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';

import './styles.css';
import Input from '../../components/Input';
import api from '../../services/api';
import { format, parseISO } from 'date-fns';
import { FiArrowLeftCircle } from 'react-icons/fi';

interface Customer {
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

const ListCustomer: React.FC = () => {
  const [errors, setErrors] = useState<{}>({});
  const history = useHistory();
  const { id } = useParams();

  const [datas, setDatas] = useState({
    fullName: '',
    cpf: '',
    birthday: '',
    email: '',
    phone: '',
  });

  const handleOnChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDatas(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        const { fullName, cpf, birthday, email, phone } = datas;

        let getErrors: { [key: string]: string } | undefined = undefined;

        if (fullName === '') {
          getErrors = {
            fullName: 'Nome é obrigatório',
          };
        }

        if (cpf === '') {
          getErrors = {
            ...getErrors,
            cpf: 'CPF é obrigatório',
          };
        }

        if (birthday === '') {
          getErrors = {
            ...getErrors,
            birthday: 'Data de Nascimento é obrigatório',
          };
        }

        if (email === '') {
          getErrors = {
            ...getErrors,
            email: 'E-mail é obrigatório',
          };
        }

        if (phone === '') {
          getErrors = {
            ...getErrors,
            phone: 'Celular é obrigatório',
          };
        }

        if (getErrors) {
          setErrors(getErrors);
          console.log(getErrors);
          return;
        }

        const formattedCpf = cpf
          .split('')
          .filter(char => Number(char) || char === '0')
          .join('');
        const formattedPhone = phone
          .split('')
          .filter(char => Number(char) || char === '0')
          .join('');

        const splitBirthday = birthday.split('/');
        const formattedBirthday = `${splitBirthday[2]}-${splitBirthday[1]}-${splitBirthday[0]}`;

        const dataForm = {
          fullName,
          cpf: formattedCpf,
          birthday: formattedBirthday,
          contact: {
            email,
            phone: formattedPhone,
          },
        };

        if (!id) {
          await api.post('customers', dataForm);
        } else {
          await api.put(`customers/${id}`, dataForm);
        }
        history.push('/');
      } catch (error) {
        alert(error.response.data.error);
      }
    },
    [datas, history, id],
  );

  useEffect(() => {
    if (id) {
      api
        .get<Customer>(`customers/find/${id}`)
        .then(
          ({
            data: {
              fullName,
              birthday,
              cpf,
              contact: { email, phone },
            },
          }) => {
            setDatas({
              fullName,
              birthday: format(parseISO(birthday), 'dd/MM/yyyy'),
              cpf,
              email,
              phone,
            });
          },
        )
        .catch(error => {
          console.log(error);
          alert('Ocorreu um erro ao buscar dados de cliente !');
        });
    }
  }, [id]);

  return (
    <div className="ContainerReginterAndCustomer">
      <button
        type="button"
        className="ButtonReturn"
        onClick={() => {
          history.goBack();
        }}
      >
        <FiArrowLeftCircle size={22} />
        voltar
      </button>
      <h1>{id ? 'Atualizar Dados do Cliente' : 'Cadastar Novo Cliente'}</h1>

      <form onSubmit={handleSubmit}>
        <Input
          mask=""
          error={errors}
          value={datas.fullName}
          name="fullName"
          onChange={handleOnChange}
          placeholder="Nome Completo"
        />
        <Input
          mask="999.999.999-99"
          error={errors}
          value={datas.cpf}
          name="cpf"
          onChange={handleOnChange}
          placeholder="CPF"
        />
        <Input
          mask="99/99/9999"
          error={errors}
          value={datas.birthday}
          name="birthday"
          onChange={handleOnChange}
          placeholder="Data de Nascimento"
        />
        <Input
          mask="(99) 99999-9999"
          error={errors}
          value={datas.phone}
          name="phone"
          onChange={handleOnChange}
          placeholder="Celular"
        />
        <Input
          mask=""
          error={errors}
          value={datas.email}
          name="email"
          onChange={handleOnChange}
          placeholder="E-mail"
        />

        <button className="Button" type="submit">
          {id ? 'Atualizar Dados' : 'Cadastrar Cliente'}
        </button>
      </form>
    </div>
  );
};

export default ListCustomer;
