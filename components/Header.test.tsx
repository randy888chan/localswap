import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header'; // Adjust path as necessary
import { useParticleAuth } from './ParticleAuthContext'; // Adjust path

// Mock the useParticleAuth hook
vi.mock('./ParticleAuthContext');

const mockLogin = vi.fn();
const mockLogout = vi.fn();
const mockConnectWallet = vi.fn();
const mockDisconnectWallet = vi.fn();
const mockOpenWallet = vi.fn();

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock return value for the hook
    (useParticleAuth as vi.Mock).mockReturnValue({
      userInfo: null,
      walletAccounts: null,
      isLoadingAuth: false,
      isLoadingWallet: false,
      login: mockLogin,
      logout: mockLogout,
      connectWallet: mockConnectWallet,
      disconnectWallet: mockDisconnectWallet,
      openWallet: mockOpenWallet,
    });
  });

  it('renders loading state correctly', () => {
    (useParticleAuth as vi.Mock).mockReturnValue({
      ...vi.mocked(useParticleAuth)(), // Keep other defaults
      isLoadingAuth: true,
      userInfo: null, // Ensure no user info when loading auth initially
    });
    render(<Header />);
    expect(screen.getByText('Authenticating...')).toBeInTheDocument();
  });

  it('renders login buttons when logged out', () => {
    render(<Header />);
    expect(screen.getByText('Login with Email')).toBeInTheDocument();
    expect(screen.getByText('Login with Google')).toBeInTheDocument();
  });

  it('calls login with "email" when email login button is clicked', () => {
    render(<Header />);
    fireEvent.click(screen.getByText('Login with Email'));
    expect(mockLogin).toHaveBeenCalledWith('email');
  });

  it('calls login with "google" when Google login button is clicked', () => {
    render(<Header />);
    fireEvent.click(screen.getByText('Login with Google'));
    expect(mockLogin).toHaveBeenCalledWith('google');
  });

  describe('When logged in', () => {
    const mockUserInfo = { name: 'Test User', uuid: 'test-uuid-123' };

    it('renders welcome message and "Connect Wallet" button if no wallet connected', () => {
      (useParticleAuth as vi.Mock).mockReturnValue({
        ...vi.mocked(useParticleAuth)(),
        userInfo: mockUserInfo,
        walletAccounts: null, // No wallet accounts
      });
      render(<Header />);
      expect(screen.getByText(`Welcome, ${mockUserInfo.name}`)).toBeInTheDocument();
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('calls connectWallet when "Connect Wallet" button is clicked', () => {
      (useParticleAuth as vi.Mock).mockReturnValue({
        ...vi.mocked(useParticleAuth)(),
        userInfo: mockUserInfo,
        walletAccounts: null,
      });
      render(<Header />);
      fireEvent.click(screen.getByText('Connect Wallet'));
      expect(mockConnectWallet).toHaveBeenCalledWith(); // No specific walletType passed by default
    });

    describe('When wallet is connected', () => {
      const mockWalletAccounts = ['0x1234567890abcdef1234567890abcdef12345678'];
      const expectedDisplayAddress = `${mockWalletAccounts[0].substring(0, 6)}...${mockWalletAccounts[0].substring(mockWalletAccounts[0].length - 4)}`;

      beforeEach(() => {
        (useParticleAuth as vi.Mock).mockReturnValue({
          ...vi.mocked(useParticleAuth)(),
          userInfo: mockUserInfo,
          walletAccounts: mockWalletAccounts,
        });
      });

      it('renders display address, "Wallet" button, and "Disconnect W." button', () => {
        render(<Header />);
        expect(screen.getByText(expectedDisplayAddress)).toBeInTheDocument();
        expect(screen.getByText('Wallet')).toBeInTheDocument(); // Button to open Particle Wallet UI
        expect(screen.getByText('Disconnect W.')).toBeInTheDocument();
      });

      it('calls openWallet when "Wallet" button is clicked', () => {
        render(<Header />);
        fireEvent.click(screen.getByText('Wallet'));
        expect(mockOpenWallet).toHaveBeenCalled();
      });

      it('calls disconnectWallet when "Disconnect W." button is clicked', () => {
        render(<Header />);
        fireEvent.click(screen.getByText('Disconnect W.'));
        expect(mockDisconnectWallet).toHaveBeenCalled();
      });
    });

    it('calls logout when "Logout" button is clicked', () => {
      (useParticleAuth as vi.Mock).mockReturnValue({
        ...vi.mocked(useParticleAuth)(),
        userInfo: mockUserInfo, // User is logged in
      });
      render(<Header />);
      fireEvent.click(screen.getByText('Logout'));
      expect(mockLogout).toHaveBeenCalled();
    });

    it('displays truncated UUID if name is not available in userInfo', () => {
        (useParticleAuth as vi.Mock).mockReturnValue({
          ...vi.mocked(useParticleAuth)(),
          userInfo: { uuid: 'test-uuid-123' }, // No name
          walletAccounts: null,
        });
        render(<Header />);
        expect(screen.getByText(`Welcome, ${'test-uuid-123'.substring(0,8)}`)).toBeInTheDocument();
      });
  });

  it('disables buttons when isLoadingWallet is true', () => {
    (useParticleAuth as vi.Mock).mockReturnValue({
      ...vi.mocked(useParticleAuth)(),
      userInfo: { name: 'Test User' },
      walletAccounts: ['0x123'],
      isLoadingWallet: true,
    });
    render(<Header />);
    expect(screen.getByText('Wallet')).toBeDisabled();
    expect(screen.getByText('Disconnect W.')).toBeDisabled();
  });

  it('disables logout button when isLoadingAuth is true', () => {
    (useParticleAuth as vi.Mock).mockReturnValue({
      ...vi.mocked(useParticleAuth)(),
      userInfo: { name: 'Test User' },
      isLoadingAuth: true,
    });
    render(<Header />);
    expect(screen.getByText('Logout')).toBeDisabled();
  });
});
