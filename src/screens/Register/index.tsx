import React, { useState } from 'react';

import { 
  Button,
  Input,
  TransactionTypeButton
} from '../../Components/Form' 

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionType
} from './styles';

export function Register() {
  const [transactionType, setTransactionType] = useState('');

  const handleTransationsTypeSelect = (type: 'up' | 'down') => {
    setTransactionType(type);
  }


  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>
      <Form>
        <Fields>
          <Input 
            placeholder="Nome"
          />

          <Input 
            placeholder="Preço"
          />

          <TransactionType>
              <TransactionTypeButton 
                type="up"
                title="Income"
                onPress={() => handleTransationsTypeSelect('up')}
                isActive={transactionType === 'up'}
              />

              <TransactionTypeButton 
                type="down"
                title="Outcome"
                onPress={() => handleTransationsTypeSelect('down')}
                isActive={transactionType === 'down'}
              />
          </TransactionType>

        </Fields>
        <Button
          title="Enviar"
        />
      </Form>
    </Container>
  )
}