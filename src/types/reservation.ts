export type Reservation = {
  date: Date;
  camera: boolean;
  vacancy: number;
};

export type ReservationWithTimestamp = Reservation & {
  createdAt: Date;
};
