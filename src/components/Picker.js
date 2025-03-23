import React from 'react';
import styled from 'styled-components';

const Picker = ({ 
  label, 
  options, 
  selectedOption, 
  onOptionChange, 
  hideSettings = false,
  description 
}) => {
  return (
    <Container>
      <Label htmlFor={`${label.toLowerCase()}-select`}>{label}</Label>
      <SelectWrapper>
        <Select
          id={`${label.toLowerCase()}-select`}
          value={selectedOption.id}
          onChange={(e) => {
            const selected = options.find(option => option.id === e.target.value);
            onOptionChange(selected);
          }}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </Select>
        <IconWrapper>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </IconWrapper>
      </SelectWrapper>
      {description && <Description>{description}</Description>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  appearance: none;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--text-color);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  font-style: italic;
`;

export default Picker; 