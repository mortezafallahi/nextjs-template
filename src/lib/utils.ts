import type { Message } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import jalaali from 'jalaali-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertInvalidCharacter = (
  text: string | null | undefined
): string => {
  if (!text) {
    return '';
  }

  const charMap: { [key: string]: string } = {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    ك: 'ک',
    دِ: 'د',
    بِ: 'ب',
    زِ: 'ز',
    ذِ: 'ذ',
    شِ: 'ش',
    سِ: 'س',
    ى: 'ی',
    ي: 'ی',
  };

  let newText = text;
  for (const [key, value] of Object.entries(charMap)) {
    newText = newText.replace(new RegExp(key, 'g'), value);
  }

  return newText;
};

export const isDescriptiveQuestion = (type?: string): boolean => {
  return type?.includes('_DESCRIPTIVE') ?? false;
};

export const isChoiceQuestion = (type?: string): boolean => {
  return type?.includes('CHOICE') ?? false;
};

export const isMultipleChoice = (type?: string): boolean => {
  return type?.includes('MULTIPLE_') ?? false;
};

export interface MessageGroup {
  sender: 'user' | 'ai';
  messages: Message[];
  avatar: string | undefined;
  name: string | undefined;
}

export const groupMessagesBySender = (messages: Message[]): MessageGroup[] => {
  if (!messages.length) return [];

  const groups: MessageGroup[] = [];
  let currentGroup: MessageGroup = {
    sender: messages[0]!.sender,
    messages: [messages[0]!],
    avatar: messages[0]!.avatar,
    name: messages[0]!.name,
  };

  for (let i = 1; i < messages.length; i++) {
    const message = messages[i]!;
    if (message.sender === currentGroup.sender) {
      currentGroup.messages.push(message);
      if (message.sender === 'ai') {
        currentGroup.avatar = message.avatar;
        currentGroup.name = message.name;
      }
    } else {
      groups.push(currentGroup);
      currentGroup = {
        sender: message.sender,
        messages: [message],
        avatar: message.avatar,
        name: message.name,
      };
    }
  }
  groups.push(currentGroup);
  return groups;
};

export const formatPrice = (
  price: number | string | null | undefined
): string => {
  if (price === null || price === undefined) return '۰';
  const toman = Math.floor(Number(price) / 10);
  return new Intl.NumberFormat('fa-IR').format(toman);
};

export const formatIsoToShamsi = (isoDate?: string | null): string => {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return '';

    const today = new Date();
    const dateToConvert = date > today ? today : date;

    const { jy, jm, jd } = jalaali.toJalaali(
      dateToConvert.getFullYear(),
      dateToConvert.getMonth() + 1,
      dateToConvert.getDate()
    );

    const paddedMonth = String(jm).padStart(2, '0');
    const paddedDay = String(jd).padStart(2, '0');

    return `${jy}/${paddedMonth}/${paddedDay}`;
  } catch {
    return '';
  }
};

export const formatShamsiToGregorian = (shamsiDate?: string): string => {
  if (!shamsiDate) return '';
  try {
    const [jy, jm, jd] = shamsiDate.split('/').map(Number);
    if (!jy || !jm || !jd) return '';

    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);

    return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
  } catch {
    return '';
  }
};

export const formatTimestamp = (date: Date | string) =>
  new Date(date).toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  });
