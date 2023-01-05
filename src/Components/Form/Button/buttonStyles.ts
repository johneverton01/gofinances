import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  width: 100%;

  background-color: ${({ theme }) => theme.colors.secondary};

  border-radius: 6px;
  padding: 18px;
  align-items: center;
`

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;

  color: ${({ theme }) => theme.colors.shape};  
`