import { Alert, ActivityIndicator, Platform } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize"

import { 
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from "./styles";

import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'
import { SignInSocialButton } from "../../Components/SignInSocialButton";
import { useAuth } from '../../hooks/auth';
import { useState } from 'react';
import { useTheme } from 'styled-components/native';


export function SignIn() {
  const [isLoading, setIsLoading]  = useState(false)
  const theme = useTheme()
  const { signInWithGoogle, signInWithApple } = useAuth()

  const handleSignInWithGoogle = async () => {
    try {
      setIsLoading(true)
      return await signInWithGoogle()
    } catch (error) {
      console.error(error)
      Alert.alert('Ops', 'Não foi possível conectar a conta Google')
      setIsLoading(false)
    } 
  }

  const handleSignInWithApple = async () => {
    try {
      setIsLoading(true)
      return await signInWithApple()
    } catch (error) {
      console.error(error)
      Alert.alert('Ops', 'Não foi possível conectar a conta Apple')
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg 
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>          
        </TitleWrapper>
        <SignInTitle>
          Faça seu login com {'\n'}
            uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocialButton 
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          {
            Platform.OS === 'ios' &&
            <SignInSocialButton 
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />

          }
        </FooterWrapper>
        { isLoading &&  
          <ActivityIndicator 
            color={theme.colors.shape} 
            style={{ marginTop: 18 }}
            />
        }
      </Footer>
    </Container>
  )
}