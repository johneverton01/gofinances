import React, { useState } from 'react';
import { 
  Keyboard, 
  Modal, 
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Button,
  CategorySelectButton,
  InputForm,
  TransactionTypeButton,
} from "../../Components/Form"

import { Category, CategorySelect } from "../CategorySelect"

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionType,
} from "./styles"
import { Control, FieldValues } from 'react-hook-form/dist/types';

interface FormDate {
  name: string
  amount: string
}

const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('Nome é obrigatório'),
  amount: Yup
  .number()
  .typeError('Informe um valor númerico')
  .positive('O valor não pode ser negativo')
  .required('Preço é obrigatório')
})

export function Register() {
  const [transactionType, setTransactionType] = useState("")
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false)

  const [category, setCategory] = useState<Category>({
    key: "category",
    name: "Categoria",
  })

  const { 
    control, 
    handleSubmit,
    formState: { errors }
  } = useForm<FormDate>({
    resolver: yupResolver(schema),
  })

  const formControll = control as unknown as Control<FieldValues, any>;

  const handleTransationsTypeSelect = (type: "up" | "down") => {
    setTransactionType(type)
  }

  const handleOpenSelectCategory = () => {
    setIsOpenCategoryModal(true)
  }

  const handleCloseSelectCategory = () => {
    setIsOpenCategoryModal(false)
  }

  const handleRegister = (form: FormDate) => {
    if (!transactionType) {
      return Alert.alert('Selecione o tipo da transação')
    }

    if (category.key === 'category') {
      return Alert.alert('Selecione a categoria')
    }
    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
    }
  }

  return (
    <TouchableWithoutFeedback 
      onPress={Keyboard.dismiss}
    >
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              name="name"
              control={formControll}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />

            <InputForm
              name="amount"
              control={formControll}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionType>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => handleTransationsTypeSelect("up")}
                isActive={transactionType === "up"}
              />

              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransationsTypeSelect("down")}
                isActive={transactionType === "down"}
              />
            </TransactionType>
            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategory}
            />
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={isOpenCategoryModal}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategory}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}
