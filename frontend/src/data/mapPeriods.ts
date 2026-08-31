export interface MapState {
  name: string;
  topicId?: number;
}

export interface MapPeriod {
  label: string;
  image: string;
  states: MapState[];
  startYear: number;
  endYear: number;
}

export const MAP_PERIODS: MapPeriod[] = [
  {
    label: "б.з.б. III ғ. – б.з. V ғ.",
    image: "/maps/днэ3-нэ5.jpg",
    states: [
      { name: "Үйсіндер", topicId: 7 },
      { name: "Қаңлылар", topicId: 8 },
      { name: "Ғұндар", topicId: 6 },
    ],
    startYear: -300,
    endYear: 500,
  },
  {
    label: "552 – 603",
    image: "/maps/552-603.jpg",
    states: [{ name: "Түрік қағанаты", topicId: 9 }],
    startYear: 552,
    endYear: 603,
  },
  {
    label: "603 – 682",
    image: "/maps/603-682.jpg",
    states: [
      { name: "Батыс Түрік қағанаты", topicId: 10 },
      { name: "Қимақтар", topicId: 14 },
    ],
    startYear: 603,
    endYear: 682,
  },
  {
    label: "682 – 704",
    image: "/maps/682-704.jpg",
    states: [{ name: "Батыс Түрік қағанаты", topicId: 10 }, { name: "Шығыс Түрік қанаты" }],
    startYear: 682,
    endYear: 704,
  },
  {
    label: "704 – 744",
    image: "/maps/704-744.jpg",
    states: [{ name: "Түргеш қағанаты", topicId: 11 }, { name: "Шығыс Түрік қанаты" }],
    startYear: 704,
    endYear: 744,
  },
  {
    label: "744 – 756",
    image: "/maps/744-756.jpg",
    states: [{ name: "Түргеш қағанаты", topicId: 11 }],
    startYear: 744,
    endYear: 756,
  },
  {
    label: "756 – IX ғ.",
    image: "/maps/756-9век.jpg",
    states: [{ name: "Қарлұқтар", topicId: 12 }],
    startYear: 756,
    endYear: 850,
  },
  {
    label: "IX ғ. – 940",
    image: "/maps/9век-940.jpg",
    states: [
      { name: "Қимақтар", topicId: 14 },
      { name: "Оғыздар", topicId: 13 },
      { name: "Қарлұқтар", topicId: 12 },
    ],
    startYear: 850,
    endYear: 940,
  },
  {
    label: "X ғ. – XI ғ.",
    image: "/maps/10век-11век.jpg",
    states: [
      { name: "Қимақтар", topicId: 14 },
      { name: "Оғыздар", topicId: 13 },
      { name: "Қарахан", topicId: 15 },
      { name: "Найман", topicId: 18 },
      { name: "Керейттер", topicId: 19 },
    ],
    startYear: 940,
    endYear: 1100,
  },
  {
    label: "XI ғ. – XII ғ.",
    image: "/maps/11век-12век.jpg",
    states: [
      { name: "Қыпшақ", topicId: 16 },
      { name: "Қарахан", topicId: 15 },
      { name: "Қара қытайлар", topicId: 17 },
    ],
    startYear: 1100,
    endYear: 1213,
  },
];
