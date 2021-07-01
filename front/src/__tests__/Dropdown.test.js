import '@testing-library/jest-dom'
import { render, screen, } from '@testing-library/react'; 

import { Dropdown } from 'Components/Dropdown';

describe('Drowpdown Tests', () => {
    test('Dropdown Present', () => {
        render(<Dropdown id="test" options={{'test1':'Test 1','test2':'Test 2'}} label="Test Drowdown"/>)
        expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    });
});