import React from 'react';
import { TouchableOpacityProps } from 'react-native'

import { Container, Title } from './buttonStyles';

interface ButtonProps {
  title: string;
  rest?: TouchableOpacityProps;
  onPress?: () => void;
}

export function Button({ title, onPress, ...rest }: ButtonProps){
  return (
    <Container 
      onPress={onPress}
      {...rest}
    >
      <Title>
        { title }
      </Title>
    </Container>
  )
}