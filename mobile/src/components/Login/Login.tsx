import React, { FunctionComponent, useState } from 'react';
import {
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '@store/ReduxStore';
import { login, register } from '@store/user/reducer';

import Styles from './Login.styles';

interface LoginFieldsProps {
    email: string;
    password: string;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
}

const LoginFields: FunctionComponent<LoginFieldsProps> = ({
  email, password, setEmail, setPassword,
}) => (
    <>
        <View style={Styles.fieldWrapper}>
            <Text style={Styles.fieldLabel}>Email</Text>
            <TextInput
                style={Styles.inputField}
                onChangeText={setEmail}
                value={email}
                placeholder="example@domain.com"
                autoCapitalize="none"
            />
        </View>
        <View style={Styles.fieldWrapper}>
            <Text style={Styles.fieldLabel}>Password</Text>
            <TextInput
                style={Styles.inputField}
                onChangeText={setPassword}
                value={password}
                placeholder="••••••••"
                autoCapitalize="none"
                secureTextEntry={true}
            />
        </View>
    </>
);

const SignIn: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const signIn = () => {
    dispatch(login({ email, password }));
  };

  return (
    <View style={Styles.loginForm}>
        <LoginFields
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
        />
        <TouchableOpacity style={Styles.submitButton} onPress={signIn}>
            <Text style={Styles.submitButtonText}>Sign In</Text>
        </TouchableOpacity>
    </View>
  );
};

const SignUp: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const signUp = () => {
    dispatch(register({ email, password }));
  };

  return (
    <View style={Styles.loginForm}>
        <LoginFields
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
        />
        <TouchableOpacity style={Styles.submitButton} onPress={signUp}>
            <Text style={Styles.submitButtonText}>Sign Up</Text>
        </TouchableOpacity>
    </View>
  );
};

interface TabItemProps {
    text: string;
    name: string;
    onPress: () => void;
    currentSelected: string;
}

const TabItem: FunctionComponent<TabItemProps> = ({
  text, name, onPress, currentSelected,
}) => (
    <TouchableOpacity
        style={[Styles.tabItem, ...(currentSelected === name ? [Styles.tabItemSelected] : [])]}
        onPress={onPress}
    >
        <Text
            style={[Styles.tabText, ...(currentSelected === name ? [Styles.tabTextSelected] : [])]}
        >
            {text}
        </Text>
    </TouchableOpacity>
);

const Login: FunctionComponent = () => {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');

  return (
    <View style={Styles.loginRoot}>
        <View style={Styles.tabBar}>
            <TabItem name="signIn" text="Sign In" currentSelected={mode} onPress={() => setMode('signIn')}/>
            <TabItem name="signUp" text="Sign Up" currentSelected={mode} onPress={() => setMode('signUp')}/>
        </View>
        {mode === 'signIn' ? <SignIn/> : <SignUp/>}
    </View>
  );
};

export default Login;
