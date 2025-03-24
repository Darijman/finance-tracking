import HomeIcon from '@/assets/svg/home-icon.svg';
import AddActionIcon from '@/assets/svg/addAction-icon.svg';
import HistoryIcon from '@/assets/svg/history-icon.svg';
import AnalyticsIcon from '@/assets/svg/analytics-icon.svg';
import WalletIcon from '@/assets/svg/wallet-icon.svg';
import ProfileIcon from '@/assets/svg/profile-icon.svg';

export const icons = {
  home: HomeIcon,
  addAction: AddActionIcon,
  history: HistoryIcon,
  analytics: AnalyticsIcon,
  wallet: WalletIcon,
  profile: ProfileIcon,
};

interface SideBarButton {
  iconKey: keyof typeof icons;
  label: string;
  href: string;
  navigation?: boolean;
}

export const sideBarButtons: SideBarButton[] = [
  { iconKey: 'home', label: 'Home', href: '/', navigation: true },
  { iconKey: 'addAction', label: 'Add Action', href: '/addAction', navigation: true },
  { iconKey: 'history', label: 'History', href: '/history', navigation: true },
  { iconKey: 'analytics', label: 'Analytics', href: '/analytics', navigation: true },
  { iconKey: 'wallet', label: 'Balance', href: '/balance', navigation: true },
  { iconKey: 'profile', label: 'Profile', href: '/profile', navigation: true },
];
