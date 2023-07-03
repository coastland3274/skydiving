export type Booking = {
  title: string;
  vacancy: number;
  capacity: number;
  modelType: string;
  waitingList: boolean;
  full: boolean;
  passwordProtected: boolean;
  start: string;
  end: string;
  allDay: boolean;
  color: string;
  url: string;
  submit: boolean;
  meta: Meta;
  classNames: string[];
  params: Params;
};

type Params = {
  selectedSlot: number;
  selectedDate?: string;
};

type Meta = {
  merchant: Merchant;
  resource: Merchant;
};

type Merchant = {
  id: string;
};

export const isBooking = (arg: unknown): arg is Booking => {
  const t = arg as Booking;

  return (
    typeof t?.title === 'string' &&
    typeof t?.vacancy === 'number' &&
    typeof t?.capacity === 'number' &&
    typeof t?.modelType === 'string' &&
    typeof t?.waitingList === 'boolean' &&
    typeof t?.full === 'boolean' &&
    typeof t?.passwordProtected === 'boolean' &&
    typeof t?.start === 'string' &&
    typeof t?.end === 'string' &&
    typeof t?.allDay === 'boolean' &&
    typeof t?.color === 'string' &&
    typeof t?.url === 'string' &&
    typeof t?.submit === 'boolean' &&
    typeof t?.meta?.merchant?.id === 'string' &&
    typeof t?.meta?.resource?.id === 'string' &&
    typeof t?.classNames === 'object' &&
    typeof t?.params?.selectedSlot === 'number' &&
    typeof t?.params?.selectedDate === 'object'
  );
};

export const isBookings = (args: unknown[]): args is Booking[] => {
  return !args.some((arg) => !isBooking(arg));
};
