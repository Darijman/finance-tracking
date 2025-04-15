import HomeIcon from '@/assets/svg/home-icon.svg';
import AddNoteIcon from '@/assets/svg/addNote-icon.svg';
import HistoryIcon from '@/assets/svg/history-icon.svg';
import AnalyticsIcon from '@/assets/svg/analytics-icon.svg';
import WalletIcon from '@/assets/svg/wallet-icon.svg';
import ProfileIcon from '@/assets/svg/profile-icon.svg';

export const icons = {
  home: HomeIcon,
  addNote: AddNoteIcon,
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
  { iconKey: 'addNote', label: 'Add Note', href: '/addNote', navigation: true },
  { iconKey: 'history', label: 'History', href: '/history', navigation: true },
  { iconKey: 'analytics', label: 'Analytics', href: '/analytics', navigation: true },
  { iconKey: 'wallet', label: 'Balance', href: '/balance', navigation: true },
  { iconKey: 'profile', label: 'Profile', href: '/profile', navigation: true },
];
