import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import format from 'date-fns/format'
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components'
import { HighlightCard } from '../../Components/HighlightCard';
import { TransactionsCard, TransactionsCardProps } from '../../Components/TransactionsCard';

import { 
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadContainer,
} from './styles';

const ptBrLocale = require('date-fns/locale/pt-BR')

export interface DataListProps extends TransactionsCardProps {
  id: string;
}

interface HighlightProps {
  amount: string
  lastTransaction: string
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsloading] = useState(true);
  const [transactionList, setTransactionList] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)
  
  const theme = useTheme()
  
  const dataKey = '@gofinances:transactions'

  const getLastTransactionDate = (
    collection: DataListProps[], 
    type: 'positive' | 'negative'
  ) => {
    const listTransactionDates = collection
      .filter((transaction) => transaction.type === type)
      .map((transaction) => new Date (transaction.date).getTime())
      
    
    const lastTransaction = Math.max.apply(Math, listTransactionDates)
    const lastTransactionFormatted = format(
      new Date(lastTransaction), 
      "dd 'de'  MMMM",
      {locale: ptBrLocale}
    )
    return lastTransactionFormatted 
  }

  async function loadTransactions () {
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0; 

    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => {

      if (item.type === 'positive') {
        entriesTotal += Number(item.amount)
      } else {
        expensiveTotal += Number(item.amount)
      }

      const amount = Number(item.amount)
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      
     const date = Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
     }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount, 
        type: item.type,
        category: item.category,
        date
      } as DataListProps
    });

    const total = entriesTotal - expensiveTotal;
     
    setTransactionList(transactionsFormatted)
    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive')
    const lastTransactionExpensive = getLastTransactionDate(transactions, 'negative')
    const totalInterval = `01 à ${lastTransactionExpensive}`

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpensive}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    })
    
    setIsloading(false)
  }

  useEffect(() => {
    loadTransactions();
  }, [])

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []))

  if (isLoading) {
    return (
      <Container>
        <LoadContainer>
          <ActivityIndicator 
            color={theme.colors.primary}
            size="large"
          />
        </LoadContainer>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo 
              source={{ uri: 'https://avatars.githubusercontent.com/u/23002870?v=4'}} 
            />
            <User>
              <UserGreeting>Olá</UserGreeting>
              <UserName>John</UserName>
            </User>
          </UserInfo>
          <LogoutButton 
            onPress={() => {}}
          >
              <Icon name="power" />
          </LogoutButton>
        </UserWrapper>

      </Header>

      <HighlightCards>
        <HighlightCard
          type="up" 
          title="Entradas"
          amount={highlightData.entries.amount}
          lastTransaction={highlightData.entries.lastTransaction}
          />
        <HighlightCard
          type="down" 
          title="Saídas"
          amount={highlightData.expensives.amount}
          lastTransaction={highlightData.expensives.lastTransaction}
        />
        <HighlightCard 
          type="total"
          title="Total"
          amount={highlightData.total.amount}
          lastTransaction={highlightData.total.lastTransaction}
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionsList 
          data={transactionList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionsCard data={item} /> }
        />
      </Transactions>

      

    </Container>
  )
}