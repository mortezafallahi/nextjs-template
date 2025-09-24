export const store = {
  users: new Map<string, any>(),
  initialQuestion: null as any,
  init: () => {
    store.users.set('09123456789', {
      id: 101,
      uuid: 'test-uuid-pending',
      first_name: '',
      last_name: '',
      mobile: '09123456789',
      active: true,
      status: {
        key: 'PENDING',
        value: 'در انتظار تکمیل',
      },
      birthday: '1995-09-13T00:00:00.000Z',
      avatar: null,
      place_type: {
        key: 'PUBLIC',
        value: 'عمومی',
      },
      balance: 0,
    });

    store.users.set('09111111111', {
      id: 102,
      uuid: 'test-uuid-complete',
      first_name: 'کاربر',
      last_name: 'تکمیل شده',
      mobile: '09111111111',
      active: true,
      status: {
        key: 'COMPLETE',
        value: 'تکمیل شده',
      },
      birthday: '1995-09-13T00:00:00.000Z',
      avatar: null,
      place_type: {
        key: 'PUBLIC',
        value: 'عمومی',
      },
      balance: 0,
    });

    // Initial Question
    store.initialQuestion = {
      id: 1,
      optional: false,
      rules: null,
      title: 'آیا شما به بیماری های زیر مبتلا هستید؟',
      type: 'MULTIPLE_CHOICE',
      answers: [
        {
          id: 1,
          question_id: 1,
          title: 'فشارخون',
        },
        {
          id: 2,
          question_id: 1,
          title: 'دیابت',
        },
        {
          id: 3,
          question_id: 1,
          title: 'تری گلیسیرید',
        },
        {
          id: 4,
          question_id: 1,
          title: 'کلسترول',
        },
        {
          id: 5,
          question_id: 1,
          title: 'کبد چرب',
        },
        {
          id: 6,
          question_id: 1,
          title: 'رفلاکس معده',
        },
        {
          id: 7,
          question_id: 1,
          title: 'سندروم روده تحریک پذیر',
        },
        {
          id: 8,
          question_id: 1,
          title: 'یبوست',
        },
        {
          id: 9,
          question_id: 1,
          title: 'زخم معده',
        },
        {
          id: 10,
          question_id: 1,
          title: 'سندروم تخمدان پلی کیستیک',
        },
        {
          id: 11,
          question_id: 1,
          title: 'تنبلی تخمدان',
        },
      ],
    };
  },
};

store.init();

// Helper function
export const getInitialQuestion = () => {
  return store.initialQuestion;
};
