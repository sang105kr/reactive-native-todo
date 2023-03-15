import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.main,
}))`
  width: ${({ width }) => width - 40}px;
  height: 60px;
  margin: 3px 0;
  padding: 15px 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.itemBackground};
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const Input = ({
  placeholder,
  value,
  onChangeText,
  onSubmitEditing,
  onBlur,
}) => {
  const { width } = Dimensions.get('window');
  return (
    <StyledInput
      width={width}
      placeholder={placeholder}
      maxLenth={50}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="done"
      // secureTextEntry={true} 입력문자 보호
      // multiline={true}  여러줄입력
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onBlur={onBlur}
    />
  );
};

// props속성의 타입과 필수여부체크
Input.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default Input;
