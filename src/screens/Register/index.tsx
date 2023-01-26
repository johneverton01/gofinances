import React, { useEffect, useState } from 'react';
import { 
  Keyboard, 
  Modal, 
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { useForm } from 'react-hook-form';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native'

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

  const { navigate }: NavigationProp<ParamListBase> = useNavigation();

  const dataKey = '@gofinances:transactions';

  const { 
    control, 
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormDate>({
    resolver: yupResolver(schema),
  })

  const formControll = control as unknown as Control<FieldValues, any>;

  const handleTransationsTypeSelect = (type: "positive" | "negative") => {
    setTransactionType(type)
  }

  const handleOpenSelectCategory = () => {
    setIsOpenCategoryModal(true)
  }

  const handleCloseSelectCategory = () => {
    setIsOpenCategoryModal(false)
  }

  const handleRegister = async (form: FormDate) => {
    if (!transactionType) {
      return Alert.alert('Selecione o tipo da transação')
    }

    if (category.key === 'category') {
      return Alert.alert('Selecione a categoria')
    }
    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    }

    try {
      const currentData = await loadData();

      const dataFormatted = [
        ...currentData,
        newTransaction 
      ]
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });

      navigate('Listagem');

    } catch (err) {
      console.log(err);
      Alert.alert('Não foi possível salvar');
    }
  }

  const loadData = async () => {
    const data = await AsyncStorage.getItem(dataKey);
    const formatedData = data ? JSON.parse(data) : [];
    return formatedData;
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
                onPress={() => handleTransationsTypeSelect("positive")}
                isActive={transactionType === "positive"}
              />

              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransationsTypeSelect("negative")}
                isActive={transactionType === "negative"}
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
