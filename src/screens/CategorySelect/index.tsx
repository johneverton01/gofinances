import React from 'react';
import { FlatList } from 'react-native';

import { Button } from '../../Components/Form'

import { categories } from '../../utils/categories';


import { 
  Container,
  Header,
  Title,
  CategoryItem,
  Icon,
  Name,
  Separator,
  Footer,
} from './styles';

export interface Category {
  key: string;
  name: string;
}

interface CategorySelectProps {
  category: Category;
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}

export function CategorySelect({
  category,
  setCategory,
  closeSelectCategory
}: CategorySelectProps) {

  const handleCategorySelect = (category: Category) => {
    setCategory(category)
  }

  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList 
        data={categories}
        style={{ flex: 1, width: '100%' }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <CategoryItem
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </CategoryItem>
        )}
        ItemSeparatorComponent={() => <Separator/>}
      />

      <Footer>
        <Button 
          title="Selecionar" 
          onPress={closeSelectCategory}
        />
      </Footer>
    </Container>
  );
}