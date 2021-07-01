import '@testing-library/jest-dom'
import * as React from 'react'
import { render, screen } from '@testing-library/react'; 
import MatchMediaMock from 'jest-matchmedia-mock';
import App from 'App';

let matchMedia;

describe('NavBar Tests', () => {
    beforeAll(() => {
        matchMedia = new MatchMediaMock();
    });
    afterEach(() => {
        matchMedia.clear();
    });
    test('Nav Bar View Recordings Link', () => {
        render(<App />);
        expect(screen.getByText(/View Recordings/)).toBeInTheDocument();
    });
    test('Nav Bar Record Link', () => {
        render(<App />);
        expect(screen.getByText("Record")).toBeInTheDocument();
    });
    test('Nav Bar Upload Link', () => {
        render(<App />);
        expect(screen.getByText(/Upload/)).toBeInTheDocument();
    });
    test('Nav Bar Logo Link', () => {
        render(<App />);
        expect(screen.getByTestId("nav-logo-link")).toBeInTheDocument();
    });
});