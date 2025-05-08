import HomeIcon from '@/assets/svg/home-icon.svg';
import AddNoteIcon from '@/assets/svg/addNote-icon.svg';
import HistoryIcon from '@/assets/svg/history-icon.svg';
import AnalyticsIcon from '@/assets/svg/analytics-icon.svg';
import AddCategoryIcon from '@/assets/svg/addCategory-icon.svg';
import ProfileIcon from '@/assets/svg/profile-icon.svg';

export const icons = {
  home: HomeIcon,
  addNote: AddNoteIcon,
  history: HistoryIcon,
  analytics: AnalyticsIcon,
  addCategory: AddCategoryIcon,
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
  { iconKey: 'addCategory', label: 'Add Category', href: '/addCategory', navigation: true },
  { iconKey: 'profile', label: 'Profile', href: '/profile', navigation: true },
];
