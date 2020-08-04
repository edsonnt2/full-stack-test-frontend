import React, { useEffect, useState } from 'react';
import InputMask, { Props as PropsInput } from 'react-input-mask';

import './styles.css';

interface Props extends PropsInput {
  name: string;
  error?: {
    [nameInput: string]: string;
  };
}

const Input: React.FC<Props> = ({ error, name, ...rest }) => {
  const [messsageError, setMesssageError] = useState('');

  useEffect(() => {
    const message = error && error[name] ? error[name] : '';
    setMesssageError(message);
  }, [error, name]);

  return (
    <div className="BoxInput">
      <InputMask {...rest} name={name} className="Input" />
      {messsageError && <span className="MessageError">{messsageError}</span>}
    </div>
  );
};

export default Input;
