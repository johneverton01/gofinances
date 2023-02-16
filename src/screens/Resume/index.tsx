import React, { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { addMonths, format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { HistoryCard } from '../../Components/HistoryCard';

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer
} from './styles'
import { categories } from '../../utils/categories';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string
  name: string
  total: number
  totalFormatted: string
  color: string,
  percent: string
}


export function Resume() {
  const [isLoading, setIsloading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [ totalByCategories, setTotalByCategories ] = useState<CategoryData[]>([])
  const theme = useTheme()
  const { user } = useAuth()
  const dataKey = `@gofinances:transactions_user:${user.id}`;


  const loadData = async () => {
    setIsloading(true);
    const data = await AsyncStorage.getItem(dataKey);
    const formatedData: TransactionData[] = data ? JSON.parse(data) : [];

    const totalByCategory: CategoryData[]  = []
    const filterBoosters = formatedData.filter((booster) => 
      new Date(booster.date).getMonth() === selectedDate.getMonth() &&
      new Date(booster.date).getFullYear() === selectedDate.getFullYear()
    )

    const amountTotalCategory = filterBoosters
    .reduce((acumullator: number, category: TransactionData) => {
      return acumullator + Number(category.amount)

    }, 0)

    categories.forEach(category => {
      let categorySum = 0;

      filterBoosters.forEach(expensives => {
        if (expensives.category === category.key) {
          categorySum += Number(expensives.amount)
        }
      });

      if(categorySum > 0) {
        const total = categorySum
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const percent = `${(categorySum / amountTotalCategory * 100).toFixed(0)}%`

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted: total,
          percent
        });
      }

    });

    setTotalByCategories(totalByCategory)
    setIsloading(false);
  }

  const handleDateChange = (action: 'next' | 'prev') => {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1))
    } else {
      setSelectedDate(subMonths(selectedDate, 1))
    }

  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]))

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>Resumo por categoria</Title>
        </Header>
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
        <Title>Resumo por categoria</Title>
      </Header>
      
      <Content
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: useBottomTabBarHeight(),
        }}
      >

        <MonthSelect>
          <MonthSelectButton onPress={() => handleDateChange('prev')}>
            <MonthSelectIcon 
              name="chevron-left"
            />
          </MonthSelectButton>

            <Month>
              { format(selectedDate, 'MMMM, yyyy', {locale: ptBR}) }
            </Month>

          <MonthSelectButton 
            onPress={() => handleDateChange('next')}            
          >
            <MonthSelectIcon 
              name="chevron-right"
            />
          </MonthSelectButton>
        </MonthSelect>

        <ChartContainer>
          <VictoryPie 
            data={totalByCategories}
            colorScale={totalByCategories.map(category => category.color)}
            style={{
              labels: { 
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape 
              }
            }}
            labelRadius={50}
            x="percent"
            y="total"
          />
          {
            totalByCategories.map(item => (
              <HistoryCard
                key={item.key}
                title={item.name}
                amount={item.totalFormatted}
                color={item.color}
              />
            ))
          }
        </ChartContainer>
      </Content>

    </Container>
  )
}