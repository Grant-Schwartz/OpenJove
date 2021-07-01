import '@testing-library/jest-dom'
import {useState} from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'; 
import { TextInput } from 'Components/TextInput';

let matchMedia;

describe('TextInput Tests', () => {
    test('TextInput Present', () => {
        render(<TextInput placeholder="Test" type="text" label="Test" id="test" error={false}/>);
        expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
});