import React from 'react';

import { Input, Button } from '../../Components/Form' 

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
} from './styles';

export function Register() {
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
        </Fields>
        <Button
          title="Enviar"
        />
      </Form>
    </Container>
  )
}